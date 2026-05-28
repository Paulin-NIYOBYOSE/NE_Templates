"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface CategoryReport {
  category: string;
  count: number;
  totalValue: number;
  totalStock: number;
  averagePrice: number;
}

interface TopItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  totalValue: number;
}

interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  price: number;
}

export default function ReportsPage() {
  const [categories, setCategories] = useState<CategoryReport[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [catRes, topRes, lowRes] = await Promise.all([
        api.get<CategoryReport[]>("/reports/by-category"),
        api.get<TopItem[]>("/reports/top-items?limit=10"),
        api.get<LowStockItem[]>("/reports/low-stock?threshold=10"),
      ]);
      setCategories(catRes.data);
      setTopItems(topRes.data);
      setLowStock(lowRes.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get("/items/export/csv", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "items-report.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export:", error);
      alert("Failed to export CSV");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <button onClick={handleExportCSV} className="btn btn-primary">
          Export All (CSV)
        </button>
      </div>

      {/* By Category */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Items by Category</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avg Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.category} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {cat.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{cat.count}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{cat.totalStock}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatCurrency(cat.averagePrice)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(cat.totalValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Top Items by Price</h2>
          <div className="space-y-3">
            {topItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Value: {formatCurrency(item.totalValue)}
                  </p>
                </div>
              </div>
            ))}
            {topItems.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No items</p>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Low Stock Alert</h2>
          <div className="space-y-3">
            {lowStock.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">
                    {item.quantity} left
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="text-sm text-green-600 text-center py-4">
                All items are well-stocked!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
