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
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
            <Head title="Register" />
            <form onSubmit={submit} className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h1 className="text-xl font-semibold mb-1">Create an account</h1>
                <p className="text-sm text-gray-400 mb-6">
                    The very first account created becomes the admin account.
                </p>

                <label className="block text-sm mb-1">Name</label>
                <input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full mb-1 rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                />
                {errors.name && <p className="text-red-400 text-xs mb-2">{errors.name}</p>}

                <label className="block text-sm mb-1 mt-3">Email</label>
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

                <label className="block text-sm mb-1 mt-3">Confirm password</label>
                <input
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="w-full mb-1 rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
                />

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-4 bg-white text-gray-900 font-medium rounded py-2 text-sm hover:bg-gray-200"
                >
                    Create account
                </button>

                <p className="text-sm text-gray-400 mt-4 text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-white underline">
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}
