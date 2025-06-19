'use client';
import { useSession } from 'next-auth/react';
import Login from './Login';
import Logout from './Logout';

export default function AuthStatus() {
  const { data: session, status } = useSession();
  if (status === 'loading') return <div>セッションを読み込み中...</div>;
  if (status === 'authenticated') {
    return (
      <div className="mb-4 text-center">
        <Logout />
      </div>
    );
  }
  return <Login />;
}