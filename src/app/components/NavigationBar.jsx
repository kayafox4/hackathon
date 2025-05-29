// src/app/components/NavigationBar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  TicketIcon,         // 予約ページ用 (バスの直接的なアイコンがないため代替)
  CalendarDaysIcon,
  UserCircleIcon,     // テストページのアカウント用
} from '@heroicons/react/24/outline'; // または @heroicons/react/24/solid

export default function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'ホーム', Icon: HomeIcon },
    { href: '/bookings', label: '予約', Icon: TicketIcon }, // ラベルを短縮
    { href: '/history', label: '履歴', Icon: CalendarDaysIcon }, // ラベルを短縮
    { href: '/test', label: 'テスト', Icon: UserCircleIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-1 shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)] border-t border-gray-200 dark:border-gray-700 z-50">
      <ul className="flex justify-around items-center max-w-xl mx-auto h-16"> {/* 高さを指定 */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.label} className="flex-1"> {/* 各アイテムが均等に幅を取るように */}
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-0.5 h-full py-1 transition-colors duration-150
                            ${isActive
                              ? 'text-green-600 dark:text-green-400 font-semibold' // アクティブ時は緑色で太字
                              : 'hover:text-green-500 dark:hover:text-green-300'
                            }`}
              >
                {/* 文字を上に */}
                <span className="text-xs">
                  {item.label}
                </span>
                {/* アイコンを文字の下に */}
                <item.Icon
                  className={`h-5 w-5 ${isActive ? '' : 'text-gray-500 dark:text-gray-400'}`}
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}