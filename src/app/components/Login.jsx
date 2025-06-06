'use client'; // Client Component

import React from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function Login() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div className="text-center text-lg mt-8">Loading...</div>;
    }

    if (status !== 'authenticated') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-lg mb-4">あなたはログインしていません</p>
                <button
                    onClick={() => signIn('google', {}, { prompt: 'login' })}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Googleでログイン
                </button>
            </div>
        );
    }
    return null;
}