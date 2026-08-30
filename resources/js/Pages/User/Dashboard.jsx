import React from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function Dashboard() {
    return (
        <UserLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-10 text-center">
                <h2 className="text-lg font-semibold">Welcome 👋</h2>
                <p className="text-sm text-gray-400 mt-1">
                    You can view and manage your tickets from here.
                </p>
            </div>
        </UserLayout>
    );
}
