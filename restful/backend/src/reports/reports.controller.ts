import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.ATTENDANT)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard overview stats' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Get items grouped by category' })
  @ApiResponse({ status: 200, description: 'Items by category report' })
  getByCategory() {
    return this.reportsService.getItemsByCategory();
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get items creation timeline (last 30 days)' })
  @ApiResponse({ status: 200, description: 'Items timeline data' })
  getTimeline() {
    return this.reportsService.getItemsTimeline();
  }

  @Get('top-items')
  @ApiOperation({ summary: 'Get top items by price' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Top items list' })
  getTopItems(@Query('limit') limit?: string) {
    return this.reportsService.getTopItems(limit ? parseInt(limit) : 10);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock items' })
  @ApiQuery({
    name: 'threshold',
    required: false,
    type: Number,
    example: 5,
    description: 'Stock threshold (default: 5)',
  })
  @ApiResponse({ status: 200, description: 'Low stock items list' })
  getLowStock(@Query('threshold') threshold?: string) {
    return this.reportsService.getLowStockItems(
      threshold ? parseInt(threshold) : 5,
    );
  }
}
