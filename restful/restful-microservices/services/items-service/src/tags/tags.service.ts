import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tag.findMany({ include: { items: true } });
  }

  create(name: string) {
    return this.prisma.tag.create({ data: { name } });
  }
}
