'use client'; // Client Component

import { useSession } from 'next-auth/react';
import Login from './components/Login';
import Logout from './components/Logout';
import NavigationBar from './components/NavigationBar'; // ナビゲーションバーをインポート

export default function Home() {
    const { data: session, status } = useSession();

    return (
        <div className="flex flex-col min-h-screen"> {/* flex-colとmin-h-screenを追加してナビゲーションを一番下に */}
            <main className="flex-grow flex flex-col items-center justify-center p-24"> {/* mainコンテンツが中央に */}
                {status === 'loading' && <div>セッションを読み込み中...</div>}
                {status === 'authenticated' ? (
                    <div className="text-center">
                        <p className="text-lg">ようこそ、{session.user?.name}さん</p>
                        <p className="text-sm text-gray-500 mb-4">セッションの期限：{new Date(session.expires).toLocaleString()}</p>
                        {session.user?.image && (
                            <img
                                src={session.user.image}
                                alt="User Avatar"
                                className="rounded-full mx-auto w-24 h-24 object-cover mb-4" // Tailwind CSSでスタイル追加
                            />
                        )}
                        <Logout />
                    </div>
                ) : (
                    <Login />
                )}
            </main>
            <NavigationBar /> {/* ナビゲーションバーをフッターとして追加 */}
        </div>
    );
}