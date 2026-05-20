"use client";

import { useEffect, useState } from "react";
import { authService } from "@/lib/auth";
import { User } from "@/types/auth";
import StatCard from "@/components/StatCard";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Items"
          value="12"
          icon="📦"
          trend={{ value: "12%", isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value="3"
          icon="👥"
          trend={{ value: "5%", isPositive: true }}
          color="green"
        />
        <StatCard title="Categories" value="4" icon="📂" color="purple" />
        <StatCard
          title="Your Role"
          value={user?.role || "USER"}
          icon="🎭"
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
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
                <p className="text-sm text-gray-600">Browse and manage items</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">✅</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  System initialized
                </p>
                <p className="text-xs text-gray-500">
                  Database seeded with demo data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">👤</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  User logged in
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">🚀 Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              1. Explore the Template
            </h3>
            <p className="text-sm text-gray-600">
              Navigate through Items to see CRUD operations, pagination, and
              role-based access in action.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              2. Check API Docs
            </h3>
            <p className="text-sm text-gray-600">
              Visit{" "}
              <code className="bg-white px-2 py-1 rounded text-xs">
                localhost:3001/api/docs
              </code>{" "}
              for Swagger documentation.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              3. Copy the Pattern
            </h3>
            <p className="text-sm text-gray-600">
              Use the Items module as a template. Copy it for each entity in
              your exam scenario.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              4. Adapt for Your Exam
            </h3>
            <p className="text-sm text-gray-600">
              Update the database schema, copy modules, and customize for your
              specific requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
