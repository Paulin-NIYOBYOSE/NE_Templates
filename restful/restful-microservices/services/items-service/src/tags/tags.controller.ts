import { Controller, Get, Post, Body } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.tagsService.create(name);
  }
}
