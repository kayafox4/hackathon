// src/app/components/NavigationBar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  MapPinIcon,
  TicketIcon,
  CalendarDaysIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'; // ← outline から solid に変更！

export default function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'ホーム', Icon: HomeIcon },
    { href: '/map', label: 'マップ', Icon: MapPinIcon },
    { href: '/bookings', label: '予約', Icon: TicketIcon },
    { href: '/history', label: '履歴', Icon: CalendarDaysIcon },
    { href: '/test', label: 'アカウント', Icon: UserCircleIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.07)] border-t border-gray-200 dark:border-gray-700 z-50">
      <ul className="flex justify-around items-stretch max-w-xl mx-auto h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-0.5 h-full py-1 transition-colors duration-150 rounded-md
                            ${isActive
                              ? 'text-green-600 dark:text-green-400 font-semibold' // アクティブ時の色
                              : 'hover:text-green-500 dark:hover:text-green-300' // ホバー時の色
                            }`}
              >
                {/* アイコンを文字の上に表示 */}
                <item.Icon
                  className={`h-6 w-6 mb-0.5 ${isActive ? '' : 'text-gray-500 dark:text-gray-400 group-hover:text-green-500'}`}
                  aria-hidden="true"
                />
                {/* 文字をアイコンの下に表示 */}
                <span className="text-xs">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}