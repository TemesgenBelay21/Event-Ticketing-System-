import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function Dashboard({ events }) {
    const totalTickets = events.reduce((sum, e) => sum + (e.registrations_count || 0), 0);
    const upcoming = events.filter((e) => new Date(e.event_date) >= new Date()).length;

    const cards = [
        { label: 'Your Events', value: events.length, icon: '🎫', color: 'bg-red-50 text-red-600' },
        { label: 'Total Registrations', value: totalTickets, icon: '🎟️', color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Upcoming Events', value: upcoming, icon: '📅', color: 'bg-blue-50 text-blue-600' },
    ];

    return (
        <UserLayout title="Organizer Dashboard">
            <Head title="Organizer Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                        <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center text-lg mb-4`}>
                            {card.icon}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">{card.label}</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-gray-900">My Events</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Registrations and ticket types for your events</p>
                    </div>
                    <Link
                        href="/events"
                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                        Manage →
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="px-5 py-3">Event</th>
                                <th className="px-5 py-3">Category</th>
                                <th className="px-5 py-3">Date</th>
                                <th className="px-5 py-3">Ticket Types</th>
                                <th className="px-5 py-3">Registrations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                                        <span className="block">{event.name}</span>
                                        <span className="text-xs text-gray-400 font-normal">{event.location}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500">
                                        {event.category?.icon} {event.category?.name || 'Uncategorized'}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500">
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {(event.ticket_types || []).map((t) => (
                                                <span key={t.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                                                    {t.name} · ETB {Number(t.price).toLocaleString()}
                                                </span>
                                            ))}
                                            {(event.ticket_types || []).length === 0 && (
                                                <span className="text-gray-400 text-xs">No ticket types</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 font-medium text-gray-800">
                                        {event.registrations_count || 0}
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                                        You don't have any events yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </UserLayout>
    );
}
