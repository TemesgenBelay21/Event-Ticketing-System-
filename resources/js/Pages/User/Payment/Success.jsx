import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../../Layouts/UserLayout';

export default function Success({ reference, flash }) {
    const isSuccess = !flash?.error;

    return (
        <UserLayout>
            <Head title="Payment" />

            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className={`p-6 text-center ${isSuccess ? 'bg-emerald-50' : 'bg-red-50'}`}>
                        <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-4xl ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
                            {isSuccess ? '✓' : '✕'}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isSuccess ? 'Payment Initiated' : 'Payment Issue'}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {isSuccess
                                ? 'Your payment is being processed. The system will update your ticket once confirmed.'
                                : flash.error}
                        </p>
                    </div>

                    <div className="p-6 space-y-4">
                        {reference && (
                            <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                                <span className="text-sm text-gray-500">Reference</span>
                                <span className="font-mono font-semibold text-gray-900 text-sm">{reference}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                            <span className="text-sm text-gray-500">Status</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {isSuccess ? 'Processing' : 'Failed'}
                            </span>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Link
                                href="/tickets"
                                className="flex-1 text-center px-4 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-200"
                            >
                                View My Tickets
                            </Link>
                            <Link
                                href="/events"
                                className="flex-1 text-center px-4 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200"
                            >
                                Browse Events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
