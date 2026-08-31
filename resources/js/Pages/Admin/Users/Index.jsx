import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index({ users }) {
    function changeRole(user, role) {
        router.patch(`/admin/users/${user.id}/role`, { role });
    }

    function destroy(user) {
        if (confirm(`Delete ${user.name}? This cannot be undone.`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    }

    return (
        <AdminLayout>
            <Head title="Users" />

            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
            <p className="text-sm text-gray-500 mb-6 mt-0.5">Manage user roles and permissions</p>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">All Users</h2>
                    <p className="text-sm text-gray-500 mt-0.5">View and manage user roles in the system</p>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Email</th>
                            <th className="px-5 py-3">Role</th>
                            <th className="px-5 py-3">Joined</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                                            {user.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                                <td className="px-5 py-3.5">
                                    <select
                                        value={user.role}
                                        onChange={(e) => changeRole(user, e.target.value)}
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 cursor-pointer"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-5 py-3.5 text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <button
                                        onClick={() => destroy(user)}
                                        className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
