import React from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function Dashboard() {
    return (
        <UserLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-2xl">
                        👋
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Welcome!</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            You can view and manage your tickets from here.
                        </p>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
