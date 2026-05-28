import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalItems,
      totalTags,
      activeItems,
      totalStockAgg,
      totalValueAgg,
      averagePriceAgg,
      recentItems,
    ] = await Promise.all([
      this.prisma.item.count(),
      this.prisma.tag.count(),
      this.prisma.item.count({ where: { quantity: { gt: 0 } } }),
      this.prisma.item.aggregate({ _sum: { quantity: true } }),
      this.prisma.item.aggregate({ _sum: { price: true } }),
      this.prisma.item.aggregate({ _avg: { price: true } }),
      this.prisma.item.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, price: true, createdAt: true },
      }),
    ]);

    return {
      overview: {
        totalUsers: 0,
        totalItems,
        activeItems,
        deletedItems: 0,
        totalTags,
      },
      financials: {
        totalValue: totalValueAgg._sum.price || 0,
        totalStock: totalStockAgg._sum.quantity || 0,
        averagePrice: averagePriceAgg._avg.price || 0,
      },
      recentItems: recentItems.map((item) => ({
        ...item,
        category: '',
        createdAt: item.createdAt.toISOString(),
      })),
      usersByRole: [],
    };
  }
}
