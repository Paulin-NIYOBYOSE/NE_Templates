import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.itemsService.findAll(+page, +limit, sortBy, sortOrder, search, category, isActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
