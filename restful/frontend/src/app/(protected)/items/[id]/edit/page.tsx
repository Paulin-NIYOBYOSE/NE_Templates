"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { Item, UpdateItemDto } from "@/types/item";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateItemDto>();

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    try {
      setFetchingItem(true);
      const response = await api.get<Item>(`/items/${params.id}`);
      reset(response.data);
    } catch (error) {
      console.error("Failed to fetch item:", error);
      setError("Failed to load item");
    } finally {
      setFetchingItem(false);
    }
  };

  const onSubmit = async (data: UpdateItemDto) => {
    try {
      setLoading(true);
      setError("");
      await api.patch(`/items/${params.id}`, data);
      router.push(`/items/${params.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingItem) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Item</h1>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name *
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              className="input mt-1"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="input mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity *
              </label>
              <input
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 0, message: "Quantity must be at least 0" },
                })}
                type="number"
                className="input mt-1"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price *
              </label>
              <input
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be at least 0" },
                })}
                type="number"
                step="0.01"
                className="input mt-1"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              {...register("category")}
              type="text"
              className="input mt-1"
            />
          </div>

          <div className="flex items-center">
            <input
              {...register("isActive")}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-900"
            >
              Active
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Item"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
