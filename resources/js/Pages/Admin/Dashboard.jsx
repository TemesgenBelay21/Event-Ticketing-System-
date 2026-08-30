import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Dashboard({ stats }) {
    const cards = [
        { label: 'Total Events', value: stats.totalEvents },
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Total Tickets', value: stats.totalTickets },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {cards.map((card) => (
                    <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                        <div className="text-sm text-gray-400">{card.label}</div>
                        <div className="text-3xl font-semibold mt-2">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-10 text-center">
                <h2 className="text-lg font-semibold">Welcome Back 👋</h2>
                <p className="text-sm text-gray-400 mt-1">
                    Manage your events, users, and tickets from this dashboard.
                </p>
            </div>
        </AdminLayout>
    );
}
