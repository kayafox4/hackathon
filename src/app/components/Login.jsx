'use client';

import React from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function Login() {
    const { status } = useSession();

    if (status === 'loading') {
        return <div className="text-center text-lg mt-8">Loading...</div>;
    }

    if (status !== 'authenticated') {
        return (
            <button
                onClick={() => signIn('google', {}, { prompt: 'login' })}
                className="rounded-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-7 shadow-lg text-base transition"
            >
                Google でログイン
            </button>
        );
    }
    return null;
}