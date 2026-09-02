import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/register');
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Head title="Register" />

            {/* Full-width header banner */}
            <header className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-10 -left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 flex items-center gap-5 px-6 sm:px-10 py-12 text-white">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shrink-0">
                        E
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                            Join the<br />Event<br />Experience
                        </h1>
                        <p className="text-white/80 text-sm sm:text-base max-w-md leading-relaxed">
                            Create your account and start exploring amazing events near you.
                        </p>
                    </div>
                </div>
            </header>

            {/* Form centered in remaining space */}
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h1>
                        <p className="text-sm text-gray-500 mb-7">
                            The very first account created becomes the admin account.
                        </p>

                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            placeholder="Your name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}

                        <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-4">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email}</p>}

                        <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-4">Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            placeholder="Create a password"
                        />
                        {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password}</p>}

                        <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-4">Confirm password</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full mb-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            placeholder="Confirm your password"
                        />

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-6 bg-red-500 text-white font-semibold rounded-lg py-2.5 text-sm hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200 disabled:opacity-50"
                        >
                            Create account
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 mt-6 text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="text-red-500 hover:text-red-600 font-semibold transition-colors duration-200">
                            Log in
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
