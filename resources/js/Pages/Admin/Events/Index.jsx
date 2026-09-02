import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

function EventFormModal({ event, categories, onClose }) {
    const isEdit = !!event;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: event?.name ?? '',
        description: event?.description ?? '',
        event_date: event?.event_date ? event.event_date.slice(0, 16) : '',
        category_id: event?.category_id ?? '',
        ticket_type_name: '',
        ticket_type_price: '',
        ticket_type_quantity: '',
    });

    function submit(e) {
        e.preventDefault();
        const options = { onSuccess: () => { reset(); onClose(); } };

        if (isEdit) {
            put(`/admin/events/${event.id}`, options);
        } else {
            post('/admin/events', options);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Fill in the details {isEdit ? 'to update this' : 'to create a new'} event</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">✕</button>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Name</label>
                <input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                    placeholder="Summer Tech Conference"
                />
                {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-3">Category</label>
                <select
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 cursor-pointer"
                >
                    <option value="">No category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-xs mb-2">{errors.category_id}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-3">Description</label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Describe the event..."
                />
                {errors.description && <p className="text-red-500 text-xs mb-2">{errors.description}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-3">Event Date &amp; Time</label>
                <input
                    type="datetime-local"
                    value={data.event_date}
                    onChange={(e) => setData('event_date', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                />
                {errors.event_date && <p className="text-red-500 text-xs mb-2">{errors.event_date}</p>}

                {!isEdit && (
                    <div className="mt-5 p-4 rounded-xl bg-purple-50 border border-purple-100">
                        <div className="text-sm font-bold text-gray-900 mb-0.5">First Ticket Type (optional)</div>
                        <p className="text-xs text-gray-500 mb-3">
                            Add a ticket type now so users can buy tickets immediately. You can add more later.
                        </p>

                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        <input
                            value={data.ticket_type_name}
                            onChange={(e) => setData('ticket_type_name', e.target.value)}
                            className="w-full mb-1 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            placeholder="General Admission"
                        />

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Price (ETB)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.ticket_type_price}
                                    onChange={(e) => setData('ticket_type_price', e.target.value)}
                                    className="w-full rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                                    placeholder="0.00 (free)"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.ticket_type_quantity}
                                    onChange={(e) => setData('ticket_type_quantity', e.target.value)}
                                    className="w-full rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                                    placeholder="e.g. 100"
                                />
                            </div>
                        </div>
                        {errors.ticket_type_name && <p className="text-red-500 text-xs mt-1">{errors.ticket_type_name}</p>}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200">
                        Cancel
                    </button>
                    <button type="submit" disabled={processing} className="px-5 py-2.5 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200 disabled:opacity-50">
                        {isEdit ? 'Save Changes' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function TicketTypeModal({ event, ticketType, onClose }) {
    const isEdit = !!ticketType;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: ticketType?.name ?? '',
        price: ticketType?.price ?? '',
        quantity: ticketType?.quantity ?? '',
        description: ticketType?.description ?? '',
    });

    function submit(e) {
        e.preventDefault();
        const options = { onSuccess: () => { reset(); onClose(); } };
        if (isEdit) {
            put(`/admin/events/${event.id}/ticket-types/${ticketType.id}`, options);
        } else {
            post(`/admin/events/${event.id}/ticket-types`, options);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Ticket Type' : 'Add Ticket Type'}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">For: {event.name}</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">✕</button>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                    placeholder="VIP / General / Early Bird"
                />
                {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}

                <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (ETB)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            placeholder="0.00"
                        />
                        {errors.price && <p className="text-red-500 text-xs mb-2">{errors.price}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                        <input
                            type="number"
                            min="0"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', e.target.value)}
                            className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            placeholder="100"
                        />
                        {errors.quantity && <p className="text-red-500 text-xs mb-2">{errors.quantity}</p>}
                    </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-3">Description</label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none"
                    rows={2}
                />
                {errors.description && <p className="text-red-500 text-xs mb-2">{errors.description}</p>}

                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200">
                        Cancel
                    </button>
                    <button type="submit" disabled={processing} className="px-5 py-2.5 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200 disabled:opacity-50">
                        {isEdit ? 'Save Changes' : 'Add Type'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Index({ events, categories }) {
    const [modalEvent, setModalEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [typesModal, setTypesModal] = useState(null); // { event, ticketType|null }

    function openCreate() {
        setModalEvent(null);
        setShowModal(true);
    }

    function openEdit(event) {
        setModalEvent(event);
        setShowModal(true);
    }

    function destroy(event) {
        if (confirm(`Delete "${event.name}"? This cannot be undone.`)) {
            router.delete(`/admin/events/${event.id}`);
        }
    }

    function destroyType(event, type) {
        if (confirm(`Delete ticket type "${type.name}"?`)) {
            router.delete(`/admin/events/${event.id}/ticket-types/${type.id}`);
        }
    }

    const filteredEvents = categoryFilter
        ? events.filter((e) => e.category_id === parseInt(categoryFilter))
        : events;

    return (
        <AdminLayout>
            <Head title="Events" />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Event Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Create and manage events, categories, and ticket types</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-red-500 text-white font-medium rounded-lg px-5 py-2.5 text-sm hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200"
                >
                    + Create Event
                </button>
            </div>

            <div className="mb-4">
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">All Events</h2>
                    <p className="text-sm text-gray-500 mt-0.5">View, manage events and their ticket types</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="px-5 py-3">Event Name</th>
                                <th className="px-5 py-3">Category</th>
                                <th className="px-5 py-3">Ticket Types</th>
                                <th className="px-5 py-3">Date</th>
                                <th className="px-5 py-3">Registrations</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                                    <td className="px-5 py-3.5 font-semibold text-gray-900">{event.name}</td>
                                    <td className="px-5 py-3.5">
                                        {event.category ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                                                {event.category.icon} {event.category.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {event.ticket_types?.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {event.ticket_types.map((t) => (
                                                    <span key={t.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                        {t.name} · ETB {Number(t.price).toLocaleString()}
                                                        <button
                                                            onClick={() => { setTypesModal({ event, ticketType: t }); }}
                                                            className="text-gray-400 hover:text-blue-600 ml-0.5"
                                                            title="Edit"
                                                        >✎</button>
                                                        <button
                                                            onClick={() => destroyType(event, t)}
                                                            className="text-gray-400 hover:text-red-500 ml-0.5"
                                                            title="Delete"
                                                        >×</button>
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">No types</span>
                                        )}
                                        <button
                                            onClick={() => { setTypesModal({ event, ticketType: null }); }}
                                            className="text-xs text-red-500 hover:text-red-600 font-medium mt-1"
                                        >
                                            + Add type
                                        </button>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500">
                                        {new Date(event.event_date).toLocaleString()}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                                            {event.registrations_count}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right space-x-3">
                                        <button onClick={() => openEdit(event)} className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                                            Edit
                                        </button>
                                        <button onClick={() => destroy(event)} className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredEvents.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                                        No events found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <EventFormModal event={modalEvent} categories={categories} onClose={() => setShowModal(false)} />
            )}

            {typesModal && (
                <TicketTypeModal event={typesModal.event} ticketType={typesModal.ticketType} onClose={() => setTypesModal(null)} />
            )}
        </AdminLayout>
    );
}
