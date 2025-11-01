import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { TrashIcon, CheckIcon, EnvelopeOpenIcon, ArrowUturnRightIcon } from "@heroicons/react/24/outline";
import AdminLayout from "./AdminLayout";

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/contact`, { withCredentials: true });
      setContacts(res.data);
    } catch {
      toast.error("Failed to fetch contacts.");
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const handleMarkRead = async (id: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact/read`, { id }, { withCredentials: true });
      toast.success("Marked as read!");
      fetchContacts();
    } catch {
      toast.error("Failed to mark as read.");
    }
  };
  // Mark as responded
  const handleMarkResponded = async (id: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact/response`, { id }, { withCredentials: true });
      toast.success("Marked as responded!");
      fetchContacts();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Cannot respond before reading.");
    }
  };
  // Delete
  const handleDelete = async (id: string, read: boolean, response: boolean) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/contact/delete`,
        { id },
        { withCredentials: true }
      );
      toast.success("Deleted successfully!");
      fetchContacts();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to delete. Mark as read & response first.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
        <p className="text-gray-600 mb-6">View and manage customer feedback/messages</p>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">No feedback found.</td>
                  </tr>
                )}
                {contacts.map(contact => (
                  <tr key={contact._id} className="">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</div>
                      <div className="text-gray-600 text-xs mt-1">{contact.email}</div>
                      <div className="text-gray-500 text-xs">{contact.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-semibold">{contact.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contact.orderId || "-"}</td>
                    <td className="px-6 py-4 whitespace-pre-line max-w-xs break-words">
                      <div className="text-gray-900">{contact.message}</div>
                      <div className="text-gray-400 text-xs mt-1">{new Date(contact.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.images?.length ? contact.images.map((img: string, i: number) => (
                          <a
                            key={i}
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-12 h-12 rounded border border-gray-300"
                          >
                            <img src={img} alt="feedback-img" className="w-full h-full object-cover rounded" />
                          </a>
                        )) : <span className="text-gray-400 text-xs">None</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs font-semibold">
                        <span className={contact.read ? "text-green-600" : "text-gray-500"}>{contact.read ? "Read" : "Unread"}</span>
                        <span className={contact.response ? "text-blue-600" : "text-gray-500"}>{contact.response ? "Responded" : "No Response"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex flex-col gap-2 min-w-[115px]">
                      <button
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-green-100 ${
                          contact.read ? "text-green-600 pointer-events-none" : "text-gray-700"
                        }`}
                        disabled={contact.read}
                        onClick={() => handleMarkRead(contact._id)}
                      >
                        <EnvelopeOpenIcon className="w-4 h-4" /> Mark Read
                      </button>
                      <button
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-blue-100 ${
                          contact.response ? "text-blue-600 pointer-events-none" : "text-gray-700"
                        }`}
                        disabled={contact.response || !contact.read}
                        onClick={() => handleMarkResponded(contact._id)}
                      >
                        <ArrowUturnRightIcon className="w-4 h-4" /> Mark Responded
                      </button>
                      <button
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-red-100 text-red-600"
                        onClick={() => handleDelete(contact._id, contact.read, contact.response)}
                      >
                        <TrashIcon className="w-4 h-4" /> Delete
                      </button>
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

export default AdminContacts;
