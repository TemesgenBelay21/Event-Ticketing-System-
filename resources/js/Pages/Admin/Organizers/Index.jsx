import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index({ organizers }) {
    function destroy(organizer) {
        if (confirm(`Remove organizer "${organizer.user?.name}"? Their role will revert to user.`)) {
            router.delete(`/admin/organizers/${organizer.id}`);
        }
    }

    return (
        <AdminLayout title="Organizers">
            <Head title="Organizers" />

            <p className="text-sm text-gray-500 mb-6 mt-0.5">Manage event organizers and their company profiles</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizers.map((organizer) => (
                    <div key={organizer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-lg font-bold">
                                    {organizer.user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{organizer.user?.name}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-[160px]">{organizer.user?.email}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => destroy(organizer)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-sm">
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500">Company</span>
                                <span className="font-medium text-gray-800">{organizer.company_name || '—'}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500">Phone</span>
                                <span className="font-medium text-gray-800">{organizer.phone || '—'}</span>
                            </div>
                            {organizer.website && (
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500">Website</span>
                                    <span className="font-medium text-gray-800">{organizer.website}</span>
                                </div>
                            )}
                            {organizer.bio && (
                                <p className="text-gray-600 mt-2 text-xs leading-relaxed">{organizer.bio}</p>
                            )}
                        </div>
                    </div>
                ))}
                {organizers.length === 0 && (
                    <div className="col-span-full bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🎪</div>
                        <div className="font-bold text-gray-900 text-lg">No organizers yet</div>
                        <p className="text-sm text-gray-500 mt-1">
                            Assign the organizer role to users from the Users page.
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
