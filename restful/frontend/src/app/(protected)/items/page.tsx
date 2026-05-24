"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Item, PaginatedItems } from "@/types/item";
import Pagination from "@/components/Pagination";
import { formatCurrency, formatDate } from "@/lib/utils";
import { authService } from "@/lib/auth";
import { UserRole } from "@/types/auth";

export default function ItemsPage() {
  const [items, setItems] = useState<PaginatedItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [exporting, setExporting] = useState(false);
  const user = authService.getCurrentUser();

  const canModify =
    user?.role === UserRole.ADMIN || user?.role === UserRole.ATTENDANT;

  useEffect(() => {
    fetchItems();
  }, [page, search, category, isActive, sortBy, sortOrder]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit, sortBy, sortOrder };
      if (search) params.search = search;
      if (category) params.category = category;
      if (isActive !== "") params.isActive = isActive;

      const response = await api.get<PaginatedItems>("/items", { params });
      setItems(response.data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item");
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const response = await api.get("/items/export/csv", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "items.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export CSV:", error);
      alert("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Items</h1>
        <div className="flex gap-2">
          {canModify && (
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="btn btn-secondary"
            >
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          )}
          {canModify && (
            <Link href="/items/new" className="btn btn-primary">
              + Add Item
            </Link>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={handleSearchChange}
              className="input"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter by category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="input"
            />
          </div>
          <div>
            <select
              value={isActive}
              onChange={(e) => {
                setIsActive(e.target.value);
                setPage(1);
              }}
              className="input"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order as "asc" | "desc");
                setPage(1);
              }}
              className="input"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-600">Loading...</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items?.data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/items/${item.id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          View
                        </Link>
                        {canModify && (
                          <>
                            <Link
                              href={`/items/${item.id}/edit`}
                              className="text-yellow-600 hover:text-yellow-900 mr-4"
                            >
                              Edit
                            </Link>
                            {user?.role === UserRole.ADMIN && (
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {items?.data.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No items found. Try adjusting your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {items && items.meta.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={items.meta.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {items && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {items.data.length} of {items.meta.total} items
        </div>
      )}
    </div>
  );
}
