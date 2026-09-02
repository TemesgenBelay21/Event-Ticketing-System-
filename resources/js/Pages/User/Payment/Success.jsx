import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../../Layouts/UserLayout';

function formatDate(value) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatMoney(value) {
    if (value === null || value === undefined) return null;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 2,
    }).format(Number(value));
}

export default function Success({ reference, payment, flash }) {
    const isSuccess = !flash?.error;
    const confirmed = payment?.status === 'completed';

    const [status, setStatus] = useState(payment?.status ?? null);
    const [chapaRef, setChapaRef] = useState(payment?.chapa_ref ?? null);
    const [method, setMethod] = useState(payment?.payment_method ?? null);
    const [paidAt, setPaidAt] = useState(payment?.paid_at ?? null);

    const confirmedLive = status === 'completed';

    useEffect(() => {
        if (!reference) return;

        let cancelled = false;
        const timer = setInterval(async () => {
            try {
                const res = await window.axios.get(`/payment/${reference}/status`);
                const data = res.data;
                if (cancelled) return;
                setStatus(data.status);
                setChapaRef(data.chapa_ref);
                setMethod(data.payment_method);
                setPaidAt(data.paid_at);

                if (data.status === 'completed') {
                    clearInterval(timer);
                }
            } catch (e) {
                // Payment temporarily unavailable; keep polling.
            }
        }, 5000);

        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [reference]);

    const ticket = payment?.ticket ?? null;
    const event = ticket?.event ?? null;
    const discount = payment?.discount_amount > 0 ? payment.discount_amount : null;

    return (
        <UserLayout>
            <Head title="Receipt" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className={`p-6 text-center ${confirmedLive ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                        <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-4xl ${
                            confirmedLive ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                            {confirmedLive ? '✓' : '⏳'}
                        </div>
                        {isSuccess ? (
                            <>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {confirmedLive ? 'Payment Confirmed' : 'Payment Initiated'}
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    {confirmedLive
                                        ? 'Your payment was successful and your ticket is confirmed.'
                                        : 'Your payment is being processed. This page will update automatically once confirmed.'}
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-gray-900">Payment Issue</h1>
                                <p className="text-gray-500 mt-1">{flash.error}</p>
                            </>
                        )}
                    </div>

                    {isSuccess && (
                        <div className="p-6">
                            <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-5">
                                Your Receipt
                            </p>

                            {event && (
                                <div className="mb-5">
                                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{event.name}</h2>
                                    {event.event_date && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {formatDate(event.event_date)}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                {reference && (
                                    <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                                        <span className="text-sm text-gray-500">Reference</span>
                                        <span className="font-mono font-semibold text-gray-900 text-sm break-all text-right">{reference}</span>
                                    </div>
                                )}

                                {ticket?.ticket_type?.name && (
                                    <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                                        <span className="text-sm text-gray-500">Ticket</span>
                                        <span className="font-semibold text-gray-900 text-sm">{ticket.ticket_type.name}</span>
                                    </div>
                                )}

                                {payment?.amount !== null && payment?.amount !== undefined && (
                                    <div className="rounded-lg bg-gray-50 px-4 py-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Subtotal</span>
                                            <span className="text-sm text-gray-900">{formatMoney(payment.amount + (discount ?? 0))}</span>
                                        </div>
                                        {discount ? (
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-sm text-gray-500">
                                                    Discount{payment?.discountCode?.code ? ` (${payment.discountCode.code})` : ''}
                                                </span>
                                                <span className="text-sm text-red-500">−{formatMoney(discount)}</span>
                                            </div>
                                        ) : null}
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                                            <span className="text-sm font-semibold text-gray-700">Total Paid</span>
                                            <span className="text-base font-bold text-gray-900">{formatMoney(payment.amount)}</span>
                                        </div>
                                    </div>
                                )}

                                {chapaRef && (
                                    <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                                        <span className="text-sm text-gray-500">Chapa Reference</span>
                                        <span className="font-mono font-semibold text-gray-900 text-sm break-all text-right">{chapaRef}</span>
                                    </div>
                                )}

                                {method && (
                                    <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                                        <span className="text-sm text-gray-500">Payment Method</span>
                                        <span className="font-medium text-gray-900 text-sm capitalize">{method}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        confirmedLive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        {confirmedLive ? 'Confirmed' : 'Processing'}
                                    </span>
                                </div>

                                {paidAt && (
                                    <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                                        <span className="text-sm text-gray-500">Paid On</span>
                                        <span className="text-sm text-gray-900">{formatDate(paidAt)}</span>
                                    </div>
                                )}

                                {ticket?.barcode && (
                                    <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                                        <span className="text-sm text-gray-500">Ticket Barcode</span>
                                        <span className="font-mono font-semibold text-gray-900 text-sm">{ticket.barcode}</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
                                Keep this page as your record. You can view and download your ticket anytime
                                from <span className="text-gray-500 font-medium">My Tickets</span>. This page will
                                not leave on its own — use the buttons below when you are ready.
                            </p>

                            <div className="flex gap-3 pt-2 mt-4">
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
                                    Back to Events
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}