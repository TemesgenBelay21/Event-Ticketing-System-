import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', match: '/dashboard', icon: '📊' },
    { label: 'Users', href: '/admin/users', match: '/admin/users', icon: '👥' },
    { label: 'Events', href: '/admin/events', match: '/admin/events', icon: '🎫' },
    { label: 'Scanner', href: '/admin/scanner', match: '/admin/scanner', icon: '📷' },
];

export default function AdminLayout({ title, children }) {
    const { url, props } = usePage();
    const user = props.auth.user;

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-950 text-gray-300 flex flex-col justify-between p-5 shadow-2xl">
                <div>
                    <div className="flex items-center gap-2.5 mb-8 px-3">
                        <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-red-500/30">
                            E
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">EventHub</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 px-3 mb-3 font-semibold">Platform</p>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const active = url.startsWith(item.match);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                        active
                                            ? 'bg-red-500/10 text-red-400 border-l-[3px] border-red-500 ml-0 pl-[9px]'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent ml-0 pl-[9px]'
                                    }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="border-t border-gray-800 pt-4 px-3">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => router.post('/logout')}
                        className="w-full text-left text-xs text-gray-500 hover:text-red-400 transition-colors duration-200 px-1 py-1"
                    >
                        Log out
                    </button>
                </div>
            </aside>

            <main className="flex-1 bg-gray-50 p-8 overflow-auto">
                {title && (
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
