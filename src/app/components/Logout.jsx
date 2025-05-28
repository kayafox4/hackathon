'use client'; // Client Component

import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Logout() {
    const { data: session, status } = useSession();

    if (status === 'authenticated') {
        return (
            <div className="mt-4">
                <button
                    onClick={() => signOut()}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    ログアウト
                </button>
            </div>
        );
    }
    return null;
}