import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  Header,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ItemsService, ItemFilters } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('items')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ATTENDANT)
  @ApiOperation({ summary: 'Create a new item (Admin/Attendant only)' })
  @ApiResponse({ status: 201, description: 'Item successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createItemDto: CreateItemDto,
    @Request() req: RequestWithUser,
  ) {
    return this.itemsService.create(createItemDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'name',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in name, description, category',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Filter from date (ISO format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Filter to date (ISO format)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of items with pagination metadata',
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('isActive') isActive?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: ItemFilters = {};

    if (search) filters.search = search;
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.itemsService.findAll(paginationDto, filters);
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.ATTENDANT)
  @ApiOperation({ summary: 'Get items statistics (Admin/Attendant only)' })
  @ApiResponse({ status: 200, description: 'Statistics data' })
  getStatistics() {
    return this.itemsService.getStatistics();
  }

  @Get('export/csv')
  @Roles(UserRole.ADMIN, UserRole.ATTENDANT)
  @ApiOperation({ summary: 'Export items to CSV (Admin/Attendant only)' })
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="items.csv"')
  @ApiResponse({ status: 200, description: 'CSV file' })
  async exportCSV(@Res() res: Response) {
    const csv = await this.itemsService.exportToCSV();
    res.send(csv);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiResponse({ status: 200, description: 'Item found' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ATTENDANT)
  @ApiOperation({ summary: 'Update an item (Admin/Attendant only)' })
  @ApiResponse({ status: 200, description: 'Item successfully updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Soft delete an item (Admin only)' })
  @ApiResponse({ status: 200, description: 'Item successfully deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }

  @Post(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a soft-deleted item (Admin only)' })
  @ApiResponse({ status: 200, description: 'Item successfully restored' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  restore(@Param('id') id: string) {
    return this.itemsService.restore(id);
  }

  @Delete(':id/hard')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Permanently delete an item (Admin only)' })
  @ApiResponse({ status: 200, description: 'Item permanently deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  hardDelete(@Param('id') id: string) {
    return this.itemsService.hardDelete(id);
  }

  @Post(':id/tags/:tagId')
  @Roles(UserRole.ADMIN, UserRole.ATTENDANT)
  @ApiOperation({ summary: 'Add a tag to an item (Admin/Attendant only)' })
  @ApiResponse({ status: 201, description: 'Tag added to item' })
  @ApiResponse({ status: 404, description: 'Item or tag not found' })
  addTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    return this.itemsService.addTag(id, tagId);
  }

  @Delete(':id/tags/:tagId')
  @Roles(UserRole.ADMIN, UserRole.ATTENDANT)
  @ApiOperation({ summary: 'Remove a tag from an item (Admin/Attendant only)' })
  @ApiResponse({ status: 200, description: 'Tag removed from item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  removeTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    return this.itemsService.removeTag(id, tagId);
  }
}
