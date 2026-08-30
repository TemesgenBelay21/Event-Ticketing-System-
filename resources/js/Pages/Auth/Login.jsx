import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
            <Head title="Log in" />
            <form onSubmit={submit} className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
                <p className="text-sm text-gray-400 mb-6">Log in to manage or claim your tickets.</p>

                <label className="block text-sm mb-1">Email</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full mb-1 rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                />
                {errors.email && <p className="text-red-400 text-xs mb-2">{errors.email}</p>}

                <label className="block text-sm mb-1 mt-3">Password</label>
                <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full mb-1 rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                />
                {errors.password && <p className="text-red-400 text-xs mb-2">{errors.password}</p>}

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-4 bg-white text-gray-900 font-medium rounded py-2 text-sm hover:bg-gray-200"
                >
                    Log in
                </button>

                <p className="text-sm text-gray-400 mt-4 text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-white underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
