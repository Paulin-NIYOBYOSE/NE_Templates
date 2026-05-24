"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Item } from "@/types/item";
import { formatCurrency, formatDate } from "@/lib/utils";
import { authService } from "@/lib/auth";
import { UserRole } from "@/types/auth";

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  const canModify =
    user?.role === UserRole.ADMIN || user?.role === UserRole.ATTENDANT;

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await api.get<Item>(`/items/${params.id}`);
      setItem(response.data);
    } catch (error) {
      console.error("Failed to fetch item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/items/${params.id}`);
      router.push("/items");
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <p className="text-gray-600">Item not found</p>
          <Link
            href="/items"
            className="text-primary-600 hover:text-primary-500 mt-4 inline-block"
          >
            Back to Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Item Details</h1>
        <div className="flex gap-2">
          {canModify && (
            <Link href={`/items/${item.id}/edit`} className="btn btn-primary">
              Edit
            </Link>
          )}
          {user?.role === UserRole.ADMIN && (
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          )}
          <Link href="/items" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </div>

      <div className="card">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{item.name}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {item.category || "N/A"}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {item.description || "No description"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Quantity</dt>
            <dd className="mt-1 text-sm text-gray-900">{item.quantity}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Price</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatCurrency(item.price)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </dd>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <span
                    key={t.tag.id}
                    className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                  >
                    {t.tag.name}
                  </span>
                ))}
              </dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500">Created By</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {item.createdBy
                ? `${item.createdBy.firstName} ${item.createdBy.lastName}`
                : "Unknown"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(item.createdAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Updated At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(item.updatedAt)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
