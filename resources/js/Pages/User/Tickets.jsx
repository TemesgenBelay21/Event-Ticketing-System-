import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import UserLayout from '../../Layouts/UserLayout';

function QrModal({ ticket, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm border border-gray-100">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-5 flex justify-between items-start">
                    <div>
                        <div className="font-bold text-white">{ticket.event.name}</div>
                        <div className="text-sm text-white/80 mt-0.5">
                            {new Date(ticket.event.event_date).toLocaleDateString(undefined, {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">✕</button>
                </div>
                <div className="p-6 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        <QRCodeSVG value={ticket.barcode} size={180} />
                    </div>
                    <div className="text-xs text-gray-400 mt-3 uppercase tracking-wider font-semibold">Verification Code</div>
                    <div className="text-sm font-mono mt-1 text-gray-700">{ticket.barcode}</div>
                    <div className={`text-xs mt-3 px-3 py-1 rounded-full font-medium ${ticket.is_verified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {ticket.is_verified ? '✓ Checked in' : '● Ready to Scan'}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TicketCard({ ticket, onView }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-400"></div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ticket.is_verified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {ticket.is_verified ? '● Checked-in' : '● Pending Check-in'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">#{ticket.barcode}</span>
                </div>
                <div className="font-bold text-gray-900 text-lg">{ticket.event.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                    {new Date(ticket.event.event_date).toLocaleDateString(undefined, {
                        weekday: 'short', month: 'short', day: 'numeric',
                    })}, {new Date(ticket.event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                <button
                    onClick={() => onView(ticket)}
                    className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 text-sm mb-3 mt-4 transition-colors duration-200"
                >
                    <span className="text-gray-700 font-medium">Digital Pass — Scan at entrance</span>
                    <span className="text-red-500 font-semibold">View</span>
                </button>

                <div className="flex gap-2">
                    <a
                        href={`/tickets/${ticket.id}/pdf`}
                        className="flex-1 text-center text-sm border border-gray-200 text-gray-600 rounded-lg py-2.5 hover:bg-gray-50 font-medium transition-all duration-200"
                    >
                        PDF Ticket
                    </a>
                </div>
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
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4 font-medium">
                    {flashSuccess}
                </div>
            )}
            {flashError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 font-medium">
                    {flashError}
                </div>
            )}

            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 mb-8 shadow-lg shadow-red-500/20">
                <div className="text-xs uppercase tracking-widest text-white/70 mb-2 font-semibold">Ticket Management</div>
                <h1 className="text-3xl font-bold text-white">Your Event Experience</h1>
                <p className="text-white/80 mt-2 max-w-lg leading-relaxed">
                    Discover upcoming events, book your spot, and manage all your tickets in one secure place.
                </p>
            </div>

            <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-sm text-gray-500 mb-4 mt-0.5">Don&apos;t miss out on these amazing experiences.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {events.map((event) => {
                    const already = registeredEventIds.has(event.id);
                    return (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="h-24 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                                <span className="text-3xl">📅</span>
                            </div>
                            <div className="p-4">
                                <div className="text-xs text-red-500 font-semibold mb-1 uppercase tracking-wide">
                                    {new Date(event.event_date).toLocaleDateString(undefined, {
                                        month: 'short', day: 'numeric', year: 'numeric',
                                    })}
                                </div>
                                <div className="font-bold text-gray-900 mb-1">{event.name}</div>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
                                <button
                                    disabled={already}
                                    onClick={() => getTicket(event)}
                                    className={`w-full text-sm rounded-lg py-2.5 font-semibold transition-all duration-200 ${
                                        already
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/25'
                                    }`}
                                >
                                    {already ? 'Ticket Booked' : 'Get Ticket →'}
                                </button>
                            </div>
                        </div>
                    );
                })}
                {events.length === 0 && (
                    <p className="text-gray-400 text-sm col-span-full">No upcoming events right now — check back soon.</p>
                )}
            </div>

            <h2 className="text-lg font-bold text-gray-900">My Tickets</h2>
            <p className="text-sm text-gray-500 mb-4 mt-0.5">Access your passes and view status.</p>

            {tickets.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                        🎟️
                    </div>
                    <div className="font-bold text-gray-900 text-lg">No tickets yet</div>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
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
