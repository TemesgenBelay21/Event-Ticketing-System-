import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Dashboard({ stats }) {
    const cards = [
        { label: 'Total Events', value: stats.totalEvents, color: 'bg-red-500', lightColor: 'bg-red-50 text-red-600', icon: '🎫' },
        { label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-600', icon: '👥' },
        { label: 'Total Tickets', value: stats.totalTickets, color: 'bg-emerald-500', lightColor: 'bg-emerald-50 text-emerald-600', icon: '🎟️' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-11 h-11 ${card.lightColor} rounded-xl flex items-center justify-center text-lg`}>
                                {card.icon}
                            </div>
                            <div className={`w-2 h-2 ${card.color} rounded-full`}></div>
                        </div>
                        <div className="text-sm text-gray-500 font-medium">{card.label}</div>
                        <div className="text-3xl font-bold text-gray-900 mt-1">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-2xl">
                        👋
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Welcome Back!</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Manage your events, users, and tickets from this dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
