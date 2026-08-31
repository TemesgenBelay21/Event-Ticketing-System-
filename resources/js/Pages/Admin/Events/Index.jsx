import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

function EventFormModal({ event, onClose }) {
    const isEdit = !!event;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: event?.name ?? '',
        description: event?.description ?? '',
        event_date: event?.event_date ? event.event_date.slice(0, 16) : '',
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

export default function Index({ events }) {
    const [modalEvent, setModalEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    return (
        <AdminLayout>
            <Head title="Events" />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Event Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Create and manage events for ticket registration</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-red-500 text-white font-medium rounded-lg px-5 py-2.5 text-sm hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200"
                >
                    + Create Event
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">All Events</h2>
                    <p className="text-sm text-gray-500 mt-0.5">View and manage all events in the system</p>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            <th className="px-5 py-3">Event Name</th>
                            <th className="px-5 py-3">Description</th>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Registrations</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                                <td className="px-5 py-3.5 font-semibold text-gray-900">{event.name}</td>
                                <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">{event.description}</td>
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
                        {events.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                                    No events yet — create your first one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <EventFormModal event={modalEvent} onClose={() => setShowModal(false)} />
            )}
        </AdminLayout>
    );
}
