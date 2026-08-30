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

            <h1 className="text-2xl font-semibold">User Management</h1>
            <p className="text-sm text-gray-400 mb-6">Manage user roles and permissions</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="font-medium">All Users</h2>
                    <p className="text-sm text-gray-400">View and manage user roles in the system</p>
                </div>

                <table className="w-full text-sm">
                    <thead className="text-gray-400 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium">Name</th>
                            <th className="px-4 py-2 font-medium">Email</th>
                            <th className="px-4 py-2 font-medium">Role</th>
                            <th className="px-4 py-2 font-medium">Joined</th>
                            <th className="px-4 py-2 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t border-gray-800">
                                <td className="px-4 py-3 font-medium">{user.name}</td>
                                <td className="px-4 py-3 text-gray-400">{user.email}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={user.role}
                                        onChange={(e) => changeRole(user, e.target.value)}
                                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-gray-400">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => destroy(user)}
                                        className="text-red-400 hover:underline"
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
