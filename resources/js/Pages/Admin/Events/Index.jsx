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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <form onSubmit={submit} className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
                        <p className="text-sm text-gray-400">Fill in the details {isEdit ? 'to update this' : 'to create a new'} event</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
                </div>

                <label className="block text-sm mb-1">Event Name</label>
                <input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full mb-1 rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                    placeholder="Summer Tech Conference"
                />
                {errors.name && <p className="text-red-400 text-xs mb-2">{errors.name}</p>}

                <label className="block text-sm mb-1 mt-3">Description</label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full mb-1 rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Describe the event..."
                />
                {errors.description && <p className="text-red-400 text-xs mb-2">{errors.description}</p>}

                <label className="block text-sm mb-1 mt-3">Event Date &amp; Time</label>
                <input
                    type="datetime-local"
                    value={data.event_date}
                    onChange={(e) => setData('event_date', e.target.value)}
                    className="w-full mb-1 rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                />
                {errors.event_date && <p className="text-red-400 text-xs mb-2">{errors.event_date}</p>}

                <div className="flex justify-end gap-2 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded border border-gray-700 text-gray-300">
                        Cancel
                    </button>
                    <button type="submit" disabled={processing} className="px-4 py-2 text-sm rounded bg-white text-gray-900 font-medium">
                        {isEdit ? 'Save Changes' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Index({ events }) {
    const [modalEvent, setModalEvent] = useState(null); // null = closed, {} = create, {...} = edit
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
                    <h1 className="text-2xl font-semibold">Event Management</h1>
                    <p className="text-sm text-gray-400">Create and manage events for ticket registration</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-white text-gray-900 font-medium rounded px-4 py-2 text-sm"
                >
                    + Create Event
                </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="font-medium">All Events</h2>
                    <p className="text-sm text-gray-400">View and manage all events in the system</p>
                </div>

                <table className="w-full text-sm">
                    <thead className="text-gray-400 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium">Event Name</th>
                            <th className="px-4 py-2 font-medium">Description</th>
                            <th className="px-4 py-2 font-medium">Date</th>
                            <th className="px-4 py-2 font-medium">Registrations</th>
                            <th className="px-4 py-2 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id} className="border-t border-gray-800">
                                <td className="px-4 py-3 font-medium">{event.name}</td>
                                <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{event.description}</td>
                                <td className="px-4 py-3 text-gray-400">
                                    {new Date(event.event_date).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-gray-400">{event.registrations_count}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button onClick={() => openEdit(event)} className="text-blue-400 hover:underline">
                                        Edit
                                    </button>
                                    <button onClick={() => destroy(event)} className="text-red-400 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
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
