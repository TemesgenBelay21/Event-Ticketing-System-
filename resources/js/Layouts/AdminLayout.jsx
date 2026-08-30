import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', match: '/dashboard' },
    { label: 'Users', href: '/admin/users', match: '/admin/users' },
    { label: 'Events', href: '/admin/events', match: '/admin/events' },
    { label: 'Scanner', href: '/admin/scanner', match: '/admin/scanner' },
];

export default function AdminLayout({ title, children }) {
    const { url, props } = usePage();
    const user = props.auth.user;

    return (
        <div className="min-h-screen flex bg-gray-950 text-gray-100">
            <aside className="w-56 border-r border-gray-800 flex flex-col justify-between p-4">
                <div>
                    <div className="font-semibold mb-6 px-2">Event Ticketing</div>
                    <p className="text-xs uppercase text-gray-500 px-2 mb-2">Platform</p>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded px-3 py-2 text-sm ${
                                    url.startsWith(item.match)
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-gray-800 pt-3 px-2">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <button
                        onClick={() => router.post('/logout')}
                        className="text-xs text-gray-500 hover:text-gray-300 mt-1"
                    >
                        Log out
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8">
                {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}
                {children}
            </main>
        </div>
    );
}
