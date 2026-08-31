import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index({ summary, events, filters }) {
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    function applyFilters() {
        router.get('/admin/reports', { from, to }, { preserveState: true });
    }

    function exportCsv() {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        params.set('format', 'csv');
        window.location.href = `/admin/reports/export?${params.toString()}`;
    }

    const cards = [
        { label: 'Total Revenue', value: `ETB ${Number(summary.totalRevenue).toLocaleString()}`, color: 'bg-emerald-50 text-emerald-600', icon: '💰' },
        { label: 'Total Discounts', value: `ETB ${Number(summary.totalDiscount).toLocaleString()}`, color: 'bg-amber-50 text-amber-600', icon: '🏷️' },
        { label: 'Tickets Sold', value: summary.totalTicketsSold, color: 'bg-red-50 text-red-600', icon: '🎟️' },
        { label: 'Avg Ticket Price', value: `ETB ${Number(summary.avgTicketPrice).toLocaleString()}`, color: 'bg-blue-50 text-blue-600', icon: '📊' },
        { label: 'Checked In', value: `${summary.checkedIn}/${summary.totalTickets}`, color: 'bg-purple-50 text-purple-600', icon: '✅' },
    ];

    return (
        <AdminLayout title="Reports">
            <Head title="Reports" />

            <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                </div>
                <button
                    onClick={applyFilters}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-200"
                >
                    Apply
                </button>
                <button
                    onClick={exportCsv}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200"
                >
                    ⬇ Export CSV
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-lg mb-3`}>
                            {card.icon}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">{card.label}</div>
                        <div className="text-xl font-bold text-gray-900 mt-0.5">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">Revenue &amp; Attendance by Event</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Sales performance across events</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="px-5 py-3">Event</th>
                                <th className="px-5 py-3">Registrations</th>
                                <th className="px-5 py-3">Revenue</th>
                                <th className="px-5 py-3">Checked In</th>
                                <th className="px-5 py-3">Check-in Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                                    <td className="px-5 py-3.5 font-semibold text-gray-900">{event.name}</td>
                                    <td className="px-5 py-3.5 text-gray-500">{event.registrations}</td>
                                    <td className="px-5 py-3.5 text-gray-700 font-medium">ETB {Number(event.revenue).toLocaleString()}</td>
                                    <td className="px-5 py-3.5 text-gray-500">{event.checked_in}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-500 rounded-full"
                                                    style={{ width: `${Math.min(event.checked_in_rate, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{event.checked_in_rate}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                                        No events found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
