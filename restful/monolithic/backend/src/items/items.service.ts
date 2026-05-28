import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { Item } from '@prisma/client';
import { Parser } from 'json2csv';

export interface ItemFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto, userId: string) {
    return this.prisma.item.create({
      data: {
        ...createItemDto,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: ItemFilters,
  ): Promise<PaginatedResult<Item>> {
    const { page, limit, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    // Build where clause with filters
    const where: any = {
      deletedAt: null, // Exclude soft-deleted items
    };

    if (filters) {
      // Search across multiple fields
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { category: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Filter by category
      if (filters.category) {
        where.category = filters.category;
      }

      // Filter by price range
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined) {
          where.price.gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          where.price.lte = filters.maxPrice;
        }
      }

      // Filter by active status
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      // Filter by date range
      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.createdAt.lte = filters.endDate;
        }
      }
    }

    // Build orderBy object
    const orderBy = sortBy ? { [sortBy]: sortOrder } : { createdAt: sortOrder };

    // Get total count
    const total = await this.prisma.item.count({ where });

    // Get paginated data
    const data = await this.prisma.item.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id, deletedAt: null },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.item.update({
      where: { id },
      data: updateItemDto,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  // Soft delete
  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.item.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Hard delete (permanent)
  async hardDelete(id: string) {
    await this.findOne(id);

    return this.prisma.item.delete({
      where: { id },
    });
  }

  // Restore soft-deleted item
  async restore(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return this.prisma.item.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  // Get statistics
  async getStatistics() {
    const [total, active, inactive, totalValue, byCategory] = await Promise.all(
      [
        this.prisma.item.count({ where: { deletedAt: null } }),
        this.prisma.item.count({
          where: { deletedAt: null, isActive: true },
        }),
        this.prisma.item.count({
          where: { deletedAt: null, isActive: false },
        }),
        this.prisma.item.aggregate({
          where: { deletedAt: null },
          _sum: { price: true, quantity: true },
        }),
        this.prisma.item.groupBy({
          by: ['category'],
          where: { deletedAt: null },
          _count: true,
        }),
      ],
    );

    return {
      total,
      active,
      inactive,
      totalValue: totalValue._sum.price || 0,
      totalQuantity: totalValue._sum.quantity || 0,
      byCategory: byCategory.map((cat) => ({
        category: cat.category,
        count: cat._count,
      })),
    };
  }

  // Add a tag to an item
  async addTag(itemId: string, tagId: string) {
    await this.findOne(itemId);

    const tag = await this.prisma.tag.findUnique({ where: { id: tagId } });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    await this.prisma.itemTag.upsert({
      where: { itemId_tagId: { itemId, tagId } },
      create: { itemId, tagId },
      update: {},
    });

    return this.findOne(itemId);
  }

  // Remove a tag from an item
  async removeTag(itemId: string, tagId: string) {
    await this.findOne(itemId);

    await this.prisma.itemTag.deleteMany({
      where: { itemId, tagId },
    });

    return this.findOne(itemId);
  }

  // Export to CSV
  async exportToCSV(): Promise<string> {
    const items = await this.prisma.item.findMany({
      where: { deletedAt: null },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const data = items.map((item) => ({
      ID: item.id,
      Name: item.name,
      Description: item.description || '',
      Quantity: item.quantity,
      Price: item.price,
      Category: item.category || '',
      Active: item.isActive ? 'Yes' : 'No',
      'Created By': `${item.createdBy.firstName} ${item.createdBy.lastName}`,
      'Created At': item.createdAt.toISOString(),
    }));

    const parser = new Parser();
    return parser.parse(data);
  }
}
