'use client'; // Client Component

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // アクティブなリンクのスタイル付け用

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
      <ul className="flex justify-around items-center max-w-xl mx-auto">
        <li>
          <Link href="/" className={`block py-2 px-4 rounded ${pathname === '/' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            ホーム
          </Link>
        </li>
        <li>
          <Link href="/bookings" className={`block py-2 px-4 rounded ${pathname === '/bookings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            予約ページ
          </Link>
        </li>
        <li>
          <Link href="/history" className={`block py-2 px-4 rounded ${pathname === '/history' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            履歴確認ページ
          </Link>
        </li>
        <li>
          <Link href="/test" className={`block py-2 px-4 rounded ${pathname === '/test' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            テスト
          </Link>
        </li>
      </ul>
    </nav>
  );
}