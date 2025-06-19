'use client';
import { useSession } from 'next-auth/react';

export default function AppBar() {
  const { data: session } = useSession();
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="text-2xl font-bold text-green-700 dark:text-green-400">ハコブネ</div>
      {session?.user?.name && (
        <div className="text-base text-gray-700 dark:text-gray-200 font-medium">
          ようこそ、{session.user.name}さん
        </div>
      )}
    </header>
  );
}