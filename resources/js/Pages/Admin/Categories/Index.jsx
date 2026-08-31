import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

function CategoryFormModal({ category, onClose }) {
    const isEdit = !!category;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: category?.name ?? '',
        description: category?.description ?? '',
        icon: category?.icon ?? '',
    });

    function submit(e) {
        e.preventDefault();
        const options = { onSuccess: () => { reset(); onClose(); } };
        if (isEdit) {
            put(`/admin/categories/${category.id}`, options);
        } else {
            post('/admin/categories', options);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Category' : 'Create New Category'}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Organize events into categories</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">✕</button>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                    placeholder="Technology"
                />
                {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-3">Icon (emoji)</label>
                <input
                    value={data.icon}
                    onChange={(e) => setData('icon', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                    placeholder="💻"
                />
                {errors.icon && <p className="text-red-500 text-xs mb-2">{errors.icon}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-3">Description</label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Describe this category..."
                />
                {errors.description && <p className="text-red-500 text-xs mb-2">{errors.description}</p>}

                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200">
                        Cancel
                    </button>
                    <button type="submit" disabled={processing} className="px-5 py-2.5 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200 disabled:opacity-50">
                        {isEdit ? 'Save Changes' : 'Create Category'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Index({ categories }) {
    const [modalCategory, setModalCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);

    function destroy(category) {
        if (confirm(`Delete category "${category.name}"? Events in this category will become uncategorized.`)) {
            router.delete(`/admin/categories/${category.id}`);
        }
    }

    return (
        <AdminLayout title="Categories">
            <Head title="Categories" />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm text-gray-500 mt-0.5">Organize events into browsable categories</p>
                </div>
                <button
                    onClick={() => { setModalCategory(null); setShowModal(true); }}
                    className="bg-red-500 text-white font-medium rounded-lg px-5 py-2.5 text-sm hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200"
                >
                    + Create Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl">
                                {category.icon || '🏷️'}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setModalCategory(category); setShowModal(true); }}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => destroy(category)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                        {category.description && (
                            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        )}
                        <div className="mt-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                                {category.events_count} events
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <CategoryFormModal category={modalCategory} onClose={() => setShowModal(false)} />
            )}
        </AdminLayout>
    );
}
