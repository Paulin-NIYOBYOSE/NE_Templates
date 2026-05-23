import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // Dashboard overview stats
  async getDashboard() {
    const [
      totalUsers,
      totalItems,
      activeItems,
      deletedItems,
      totalTags,
      itemValue,
      recentItems,
      usersByRole,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.item.count({ where: { deletedAt: null } }),
      this.prisma.item.count({ where: { deletedAt: null, isActive: true } }),
      this.prisma.item.count({ where: { NOT: { deletedAt: null } } }),
      this.prisma.tag.count(),
      this.prisma.item.aggregate({
        where: { deletedAt: null },
        _sum: { price: true, quantity: true },
        _avg: { price: true },
      }),
      this.prisma.item.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          createdAt: true,
        },
      }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
    ]);

    return {
      overview: {
        totalUsers,
        totalItems,
        activeItems,
        deletedItems,
        totalTags,
      },
      financials: {
        totalValue: itemValue._sum.price || 0,
        totalStock: itemValue._sum.quantity || 0,
        averagePrice: Math.round((itemValue._avg.price || 0) * 100) / 100,
      },
      recentItems,
      usersByRole: usersByRole.map((r) => ({
        role: r.role,
        count: r._count,
      })),
    };
  }

  // Items by category report
  async getItemsByCategory() {
    const categories = await this.prisma.item.groupBy({
      by: ['category'],
      where: { deletedAt: null },
      _count: true,
      _sum: { price: true, quantity: true },
      _avg: { price: true },
    });

    return categories.map((cat) => ({
      category: cat.category || 'Uncategorized',
      count: cat._count,
      totalValue: cat._sum.price || 0,
      totalStock: cat._sum.quantity || 0,
      averagePrice: Math.round((cat._avg.price || 0) * 100) / 100,
    }));
  }

  // Items created over time (last 30 days)
  async getItemsTimeline() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const items = await this.prisma.item.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        deletedAt: null,
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const timeline: Record<string, number> = {};
    items.forEach((item) => {
      const date = item.createdAt.toISOString().split('T')[0];
      timeline[date] = (timeline[date] || 0) + 1;
    });

    return Object.entries(timeline).map(([date, count]) => ({
      date,
      count,
    }));
  }

  // Top items by value (price * quantity)
  async getTopItems(limit = 10) {
    const items = await this.prisma.item.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        price: true,
        quantity: true,
        category: true,
      },
      orderBy: { price: 'desc' },
      take: limit,
    });

    return items.map((item) => ({
      ...item,
      totalValue: item.price * item.quantity,
    }));
  }

  // Low stock items
  async getLowStockItems(threshold = 5) {
    return this.prisma.item.findMany({
      where: {
        deletedAt: null,
        quantity: { lte: threshold },
      },
      select: {
        id: true,
        name: true,
        quantity: true,
        category: true,
        price: true,
      },
      orderBy: { quantity: 'asc' },
    });
  }
}
