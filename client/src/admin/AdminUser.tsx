import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { TrashIcon, CheckIcon, EnvelopeOpenIcon, UserIcon } from "@heroicons/react/24/outline";
import AdminLayout from "./AdminLayout";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, { withCredentials: true });
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600 mb-6">View and manage registered users</p>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
                {users.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 flex items-center gap-1">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                        {user.name}
                      </div>
                      <div className="text-gray-400 text-xs">{"USER-" + user._id.toString().slice(-6).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{user.email}</div>
                      <div className="text-gray-500 text-xs">{user.phone || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.address
                        ? <>
                            <div>{user.address.street || ""}</div>
                            <div className="text-xs text-gray-500">
                              {[user.address.city, user.address.state, user.address.country].filter(Boolean).join(", ")}
                            </div>
                          </>
                        : <span className="text-gray-400 text-xs">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-bold"
                          : "bg-gray-100 text-gray-700 rounded px-2 py-1 text-xs"
                      }>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isVerified
                        ? <span className="flex items-center gap-1 text-green-600 text-xs font-semibold"><CheckIcon className="w-4 h-4" /> Verified</span>
                        : <span className="text-gray-500 text-xs">No</span>}
                    </td>
                    <td className="px-6 py-4">
                      {user.subscription
                        ? <span className="flex items-center gap-1 text-orange-600 text-xs font-semibold"><EnvelopeOpenIcon className="w-4 h-4" /> Subscribed</span>
                        : <span className="text-gray-500 text-xs">No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
