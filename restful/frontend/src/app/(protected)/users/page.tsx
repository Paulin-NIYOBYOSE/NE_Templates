"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User, UserRole } from "@/types/auth";
import { formatDate } from "@/lib/utils";
import { authService } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const currentUser = authService.getCurrentUser();

  // Only admin/attendant can access
  useEffect(() => {
    if (
      currentUser?.role !== UserRole.ADMIN &&
      currentUser?.role !== UserRole.ATTENDANT
    ) {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get<UserListItem[]>("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own account");
      return;
    }
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setCreating(true);
      setError("");
      await api.post("/users", {
        email: formData.get("email"),
        password: formData.get("password"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        role: formData.get("role"),
      });
      setShowCreateModal(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        {currentUser?.role === UserRole.ADMIN && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            + Add User
          </button>
        )}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                {currentUser?.role === UserRole.ADMIN && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === UserRole.ADMIN
                          ? "bg-red-100 text-red-800"
                          : user.role === UserRole.ATTENDANT
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  {currentUser?.role === UserRole.ADMIN && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    className="input mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="input mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="input mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select name="role" required className="input mt-1">
                  <option value="USER">User</option>
                  <option value="ATTENDANT">Attendant</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary flex-1"
                >
                  {creating ? "Creating..." : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setError(""); }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
