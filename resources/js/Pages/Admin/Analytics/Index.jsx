import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

function BarChart({ labels, data, color = 'bg-red-500' }) {
    const max = Math.max(...data, 1);
    return (
        <div>
            <div className="flex items-end gap-2 h-40">
                {data.map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${labels[i]}: ${value}`}>
                        <div className={`w-full max-w-[40px] ${color} rounded-t-lg transition-all duration-300`}
                            style={{ height: `${(value / max) * 100}%`, minHeight: value > 0 ? '6px' : '2px', opacity: value > 0 ? 1 : 0.15 }} />
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-2 border-t border-gray-100 pt-2">
                {labels.map((label, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] text-gray-400 font-medium truncate">{label}</div>
                ))}
            </div>
        </div>
    );
}

export default function Analytics({ metrics, revenueOverTime, ticketsOverTime, popularEvents, categoryBreakdown, paymentMethods }) {
    const [months, setMonths] = useState(6);

    function changeMonths(value) {
        setMonths(value);
        router.get('/admin/analytics', { months: value }, { preserveState: true });
    }

    const cards = [
        { label: 'Total Revenue', value: `ETB ${Number(metrics.totalRevenue).toLocaleString()}`, icon: '💰', color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Avg Ticket Price', value: `ETB ${Number(metrics.avgTicketPrice).toLocaleString()}`, icon: '💳', color: 'bg-blue-50 text-blue-600' },
        { label: 'Tickets Sold', value: metrics.ticketsSold, icon: '🎟️', color: 'bg-red-50 text-red-600' },
        { label: 'Check-in Rate', value: `${metrics.checkedIn}/${metrics.conversionRate}%`, icon: '✅', color: 'bg-purple-50 text-purple-600' },
    ];

    const totalCategory = categoryBreakdown.reduce((sum, c) => sum + c.value, 0) || 1;

    return (
        <AdminLayout title="Analytics">
            <Head title="Analytics" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <p className="text-sm text-gray-500 mt-0.5">Advanced insights into your events and sales</p>
                <div className="flex gap-1 mt-3 sm:mt-0 bg-gray-100 rounded-lg p-1">
                    {[3, 6, 12].map((m) => (
                        <button
                            key={m}
                            onClick={() => changeMonths(m)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${months === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {m}M
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900">Revenue Over Time</h2>
                    <p className="text-sm text-gray-500 mb-4">Last {months} months</p>
                    <BarChart labels={revenueOverTime.labels} data={revenueOverTime.data} />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900">Tickets Sold Over Time</h2>
                    <p className="text-sm text-gray-500 mb-4">Last {months} months</p>
                    <BarChart labels={ticketsOverTime.labels} data={ticketsOverTime.data} color="bg-blue-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Category Breakdown</h2>
                    <div className="space-y-4">
                        {categoryBreakdown.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                    <span className="text-gray-500">{cat.value} tickets</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(cat.value / totalCategory) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {categoryBreakdown.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">No category data yet</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Popular Events</h2>
                    <div className="space-y-3">
                        {popularEvents.map((event, i) => (
                            <div key={event.name} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-800 truncate text-sm">{event.name}</div>
                                    <div className="text-xs text-gray-400">{event.sold} tickets sold</div>
                                </div>
                                <div className="text-sm font-bold text-gray-900">ETB {Number(event.revenue).toLocaleString()}</div>
                            </div>
                        ))}
                        {popularEvents.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">No event data yet</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Payment Methods</h2>
                    <div className="space-y-4">
                        {paymentMethods.map((pm) => (
                            <div key={pm.method}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 capitalize">{pm.method}</span>
                                    <span className="text-gray-500">{pm.count} · ETB {Number(pm.total).toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(pm.count / Math.max(1, metrics.ticketsSold)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {paymentMethods.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">No payment data yet</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
