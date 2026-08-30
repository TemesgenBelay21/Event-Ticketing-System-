import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import UserLayout from '../../Layouts/UserLayout';

function QrModal({ ticket, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden w-full max-w-sm">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-start">
                    <div>
                        <div className="font-semibold">{ticket.event.name}</div>
                        <div className="text-sm text-white/80">
                            {new Date(ticket.event.event_date).toLocaleDateString(undefined, {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
                </div>
                <div className="p-6 flex flex-col items-center">
                    <div className="bg-white p-3 rounded">
                        <QRCodeSVG value={ticket.barcode} size={180} />
                    </div>
                    <div className="text-xs text-gray-500 mt-3 uppercase">Verification Code</div>
                    <div className="text-sm font-mono mt-1">{ticket.barcode}</div>
                    <div className={`text-xs mt-3 px-2 py-1 rounded ${ticket.is_verified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {ticket.is_verified ? '✓ Checked in' : '● Ready to Scan'}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TicketCard({ ticket, onView }) {
    return (
        <div className="bg-gray-900 border-l-4 border-blue-500 border-y border-r border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs px-2 py-1 rounded ${ticket.is_verified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {ticket.is_verified ? '● Checked-in' : '● Pending Check-in'}
                </span>
                <span className="text-xs text-gray-500 font-mono">#{ticket.barcode}</span>
            </div>
            <div className="font-semibold">{ticket.event.name}</div>
            <div className="text-sm text-gray-400 mb-3">
                {new Date(ticket.event.event_date).toLocaleDateString(undefined, {
                    weekday: 'short', month: 'short', day: 'numeric',
                })}, {new Date(ticket.event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            <button
                onClick={() => onView(ticket)}
                className="w-full flex justify-between items-center bg-gray-800 rounded px-3 py-2 text-sm mb-3"
            >
                <span>Digital Pass — Scan at entrance</span>
                <span className="text-blue-400">View</span>
            </button>

            <div className="flex gap-2">
                <a
                    href={`/tickets/${ticket.id}/pdf`}
                    className="flex-1 text-center text-sm border border-gray-700 rounded py-2 hover:bg-gray-800"
                >
                    PDF Ticket
                </a>
            </div>
        </div>
    );
}

export default function Tickets({ events, tickets }) {
    const [activeTicket, setActiveTicket] = useState(null);
    const { props } = usePage();
    const flashError = props.flash?.error;
    const flashSuccess = props.flash?.success;

    const registeredEventIds = new Set(tickets.map((t) => t.event_id));

    function getTicket(event) {
        router.post('/tickets', { event_id: event.id });
    }

    return (
        <UserLayout>
            <Head title="My Tickets" />

            {flashSuccess && (
                <div className="bg-green-950 border border-green-800 text-green-300 text-sm rounded px-4 py-2 mb-4">
                    {flashSuccess}
                </div>
            )}
            {flashError && (
                <div className="bg-red-950 border border-red-800 text-red-300 text-sm rounded px-4 py-2 mb-4">
                    {flashError}
                </div>
            )}

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8">
                <div className="text-xs uppercase tracking-wide text-white/80 mb-2">Ticket Management</div>
                <h1 className="text-3xl font-bold">Your Event Experience</h1>
                <p className="text-white/80 mt-2 max-w-lg">
                    Discover upcoming events, book your spot, and manage all your tickets in one secure place.
                </p>
            </div>

            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <p className="text-sm text-gray-400 mb-4">Don&apos;t miss out on these amazing experiences.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {events.map((event) => {
                    const already = registeredEventIds.has(event.id);
                    return (
                        <div key={event.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                            <div className="h-24 bg-gray-800 flex items-center justify-center text-gray-600">📅</div>
                            <div className="p-4">
                                <div className="text-xs text-gray-500 mb-1">
                                    {new Date(event.event_date).toLocaleDateString(undefined, {
                                        month: 'short', day: 'numeric', year: 'numeric',
                                    })}
                                </div>
                                <div className="font-semibold mb-1">{event.name}</div>
                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{event.description}</p>
                                <button
                                    disabled={already}
                                    onClick={() => getTicket(event)}
                                    className={`w-full text-sm rounded py-2 font-medium ${
                                        already
                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                            : 'bg-white text-gray-900 hover:bg-gray-200'
                                    }`}
                                >
                                    {already ? 'Ticket Booked' : 'Get Ticket →'}
                                </button>
                            </div>
                        </div>
                    );
                })}
                {events.length === 0 && (
                    <p className="text-gray-500 text-sm col-span-full">No upcoming events right now — check back soon.</p>
                )}
            </div>

            <h2 className="text-lg font-semibold">My Tickets</h2>
            <p className="text-sm text-gray-400 mb-4">Access your passes and view status.</p>

            {tickets.length === 0 ? (
                <div className="bg-gray-800/60 rounded-lg p-10 text-center text-gray-300">
                    <div className="text-2xl mb-2">🎟️</div>
                    <div className="font-medium">No tickets yet</div>
                    <p className="text-sm text-gray-400 mt-1">
                        You haven&apos;t registered for any events yet. Browse the upcoming events above to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} onView={setActiveTicket} />
                    ))}
                </div>
            )}

            {activeTicket && <QrModal ticket={activeTicket} onClose={() => setActiveTicket(null)} />}
        </UserLayout>
    );
}
