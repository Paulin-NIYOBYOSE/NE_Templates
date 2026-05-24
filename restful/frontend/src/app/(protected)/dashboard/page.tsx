"use client";

import { useEffect, useState } from "react";
import { authService } from "@/lib/auth";
import { User } from "@/types/auth";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import api from "@/lib/api";

interface DashboardData {
  overview: {
    totalUsers: number;
    totalItems: number;
    activeItems: number;
    deletedItems: number;
    totalTags: number;
  };
  financials: {
    totalValue: number;
    totalStock: number;
    averagePrice: number;
  };
  recentItems: {
    id: string;
    name: string;
    price: number;
    category: string;
    createdAt: string;
  }[];
  usersByRole: { role: string; count: number }[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get<DashboardData>("/reports/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Items"
          value={loading ? "..." : String(dashboard?.overview.totalItems || 0)}
          icon="📦"
          color="blue"
        />
        <StatCard
          title="Active Items"
          value={loading ? "..." : String(dashboard?.overview.activeItems || 0)}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Total Stock"
          value={
            loading ? "..." : String(dashboard?.financials.totalStock || 0)
          }
          icon="📊"
          color="purple"
        />
        <StatCard
          title="Total Value"
          value={
            loading
              ? "..."
              : formatCurrency(dashboard?.financials.totalValue || 0)
          }
          icon="💰"
          color="yellow"
        />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Users"
          value={loading ? "..." : String(dashboard?.overview.totalUsers || 0)}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Tags"
          value={loading ? "..." : String(dashboard?.overview.totalTags || 0)}
          icon="🏷️"
          color="green"
        />
        <StatCard
          title="Avg Price"
          value={
            loading
              ? "..."
              : formatCurrency(dashboard?.financials.averagePrice || 0)
          }
          icon="�"
          color="purple"
        />
        <StatCard
          title="Your Role"
          value={user?.role || "USER"}
          icon="🎭"
          color="yellow"
        />
      </div>

      {/* Quick Actions + Recent Items */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/items/new"
              className="flex items-center gap-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <span className="text-2xl">➕</span>
              <div>
                <h3 className="font-medium text-gray-900">Add New Item</h3>
                <p className="text-sm text-gray-600">
                  Create a new item in the system
                </p>
              </div>
            </Link>
            <Link
              href="/items"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="font-medium text-gray-900">View All Items</h3>
                <p className="text-sm text-gray-600">
                  Browse, search, and manage items
                </p>
              </div>
            </Link>
            <Link
              href="/reports"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-medium text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-600">
                  Analytics, exports, and insights
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Items</h2>
          <div className="space-y-3">
            {dashboard?.recentItems.map((item) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.category || "Uncategorized"}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(item.price)}
                </span>
              </Link>
            ))}
            {!loading &&
              (!dashboard?.recentItems ||
                dashboard.recentItems.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No items yet
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Users by Role */}
      {dashboard?.usersByRole && dashboard.usersByRole.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Users by Role</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dashboard.usersByRole.map((r) => (
              <div
                key={r.role}
                className="p-4 bg-gray-50 rounded-lg text-center"
              >
                <p className="text-2xl font-bold text-gray-900">{r.count}</p>
                <p className="text-sm text-gray-600">{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
