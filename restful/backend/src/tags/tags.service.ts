import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const existing = await this.prisma.tag.findUnique({
      where: { name: createTagDto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Tag "${createTagDto.name}" already exists`,
      );
    }

    return this.prisma.tag.create({
      data: createTagDto,
      include: { items: { include: { item: true } } },
    });
  }

  async findAll() {
    return this.prisma.tag.findMany({
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    await this.findOne(id);

    if (updateTagDto.name) {
      const existing = await this.prisma.tag.findUnique({
        where: { name: updateTagDto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Tag "${updateTagDto.name}" already exists`,
        );
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.tag.delete({ where: { id } });
  }
}
