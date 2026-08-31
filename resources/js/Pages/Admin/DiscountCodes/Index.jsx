import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

function DiscountFormModal({ discount, events, onClose }) {
    const isEdit = !!discount;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: discount?.code ?? '',
        type: discount?.type ?? 'percentage',
        value: discount?.value ?? '',
        event_id: discount?.event_id ?? '',
        max_uses: discount?.max_uses ?? '',
        expires_at: discount?.expires_at ? discount.expires_at.slice(0, 16) : '',
        active: discount?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        const options = { onSuccess: () => { reset(); onClose(); } };
        if (isEdit) {
            put(`/admin/discount-codes/${discount.id}`, options);
        } else {
            post('/admin/discount-codes', options);
        }
    }

    const inputClass = "w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200";

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Discount Code' : 'Create Discount Code'}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Offer discounts to your attendees</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">✕</button>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">Code</label>
                <input
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                    className={`${inputClass} uppercase`}
                    placeholder="SAVE10"
                />
                {errors.code && <p className="text-red-500 text-xs mb-2">{errors.code}</p>}

                <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200 cursor-pointer"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed (ETB)</option>
                        </select>
                        {errors.type && <p className="text-red-500 text-xs mb-2">{errors.type}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{data.type === 'percentage' ? 'Percent' : 'Amount'}</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            className={inputClass}
                            placeholder={data.type === 'percentage' ? '10' : '100'}
                        />
                        {errors.value && <p className="text-red-500 text-xs mb-2">{errors.value}</p>}
                    </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-3">Apply To Event</label>
                <select
                    value={data.event_id}
                    onChange={(e) => setData('event_id', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200 cursor-pointer"
                >
                    <option value="">All events (global)</option>
                    {events.map((e) => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                </select>
                {errors.event_id && <p className="text-red-500 text-xs mb-2">{errors.event_id}</p>}

                <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Uses</label>
                        <input
                            type="number"
                            min="1"
                            value={data.max_uses}
                            onChange={(e) => setData('max_uses', e.target.value)}
                            className={inputClass}
                            placeholder="Unlimited"
                        />
                        {errors.max_uses && <p className="text-red-500 text-xs mb-2">{errors.max_uses}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Expires At</label>
                        <input
                            type="datetime-local"
                            value={data.expires_at}
                            onChange={(e) => setData('expires_at', e.target.value)}
                            className={inputClass}
                        />
                        {errors.expires_at && <p className="text-red-500 text-xs mb-2">{errors.expires_at}</p>}
                    </div>
                </div>

                <label className="flex items-center gap-2 mt-3 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={data.active}
                        onChange={(e) => setData('active', e.target.checked)}
                        className="w-4 h-4 accent-red-500"
                    />
                    Active
                </label>

                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200">
                        Cancel
                    </button>
                    <button type="submit" disabled={processing} className="px-5 py-2.5 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200 disabled:opacity-50">
                        {isEdit ? 'Save Changes' : 'Create Code'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Index({ discountCodes, events }) {
    const [modalCode, setModalCode] = useState(null);
    const [showModal, setShowModal] = useState(false);

    function destroy(code) {
        if (confirm(`Delete discount code "${code.code}"?`)) {
            router.delete(`/admin/discount-codes/${code.id}`);
        }
    }

    const isExpired = (code) => code.expires_at && new Date(code.expires_at) < new Date();
    const isUsedUp = (code) => code.max_uses !== null && code.used_count >= code.max_uses;

    return (
        <AdminLayout title="Discount Codes">
            <Head title="Discount Codes" />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm text-gray-500 mt-0.5">Create and manage promotional discount codes</p>
                </div>
                <button
                    onClick={() => { setModalCode(null); setShowModal(true); }}
                    className="bg-red-500 text-white font-medium rounded-lg px-5 py-2.5 text-sm hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200"
                >
                    + Create Code
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">All Discount Codes</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage promotional offers</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="px-5 py-3">Code</th>
                                <th className="px-5 py-3">Discount</th>
                                <th className="px-5 py-3">Applies To</th>
                                <th className="px-5 py-3">Usage</th>
                                <th className="px-5 py-3">Expires</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discountCodes.map((code) => {
                                const expired = isExpired(code);
                                const usedUp = isUsedUp(code);
                                const inactive = !code.active || expired || usedUp;
                                return (
                                    <tr key={code.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                                        <td className="px-5 py-3.5">
                                            <span className="font-mono font-bold text-gray-900 bg-gray-100 rounded px-2 py-1">{code.code}</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-700">
                                            {code.type === 'percentage' ? `${code.value}%` : `ETB ${Number(code.value).toLocaleString()}`}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">
                                            {code.event ? code.event.name : <span className="text-blue-600">All events</span>}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">
                                            {code.used_count}{code.max_uses ? ` / ${code.max_uses}` : ''}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">
                                            {code.expires_at ? new Date(code.expires_at).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inactive ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                {inactive ? 'Inactive' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right space-x-3">
                                            <button onClick={() => { setModalCode(code); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                                                Edit
                                            </button>
                                            <button onClick={() => destroy(code)} className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {discountCodes.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                                        No discount codes yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <DiscountFormModal discount={modalCode} events={events} onClose={() => setShowModal(false)} />
            )}
        </AdminLayout>
    );
}
