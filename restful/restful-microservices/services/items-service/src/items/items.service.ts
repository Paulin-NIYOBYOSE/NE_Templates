import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    search?: string,
    category?: string,
    isActive?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const orderBy: any =
      sortBy === 'name' || sortBy === 'price'
        ? { [sortBy]: sortOrder }
        : { createdAt: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.item.findMany({
        skip,
        take: limit,
        where,
        include: { tags: true },
        orderBy,
      }),
      this.prisma.item.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async create(dto: CreateItemDto) {
    return this.prisma.item.create({
      data: {
        name: dto.name,
        description: dto.description,
        quantity: dto.quantity,
        price: dto.price,
        tags: dto.tagIds ? { connect: dto.tagIds.map(id => ({ id })) } : undefined,
      },
      include: { tags: true },
    });
  }

  async update(id: string, dto: UpdateItemDto) {
    return this.prisma.item.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        quantity: dto.quantity,
        price: dto.price,
        tags: dto.tagIds ? { set: dto.tagIds.map(id => ({ id })) } : undefined,
      },
      include: { tags: true },
    });
  }

  async remove(id: string) {
    await this.prisma.item.delete({ where: { id } });
    return { message: 'Item deleted' };
  }
}
