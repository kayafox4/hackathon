// src/app/components/NavigationBar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  TicketIcon,           // 予約ページ用 (バスの直接的なアイコンがないため代替)
  CalendarDaysIcon,
  UserCircleIcon,       // テストページのアカウント用
} from '@heroicons/react/24/outline'; // または @heroicons/react/24/solid

export default function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'ホーム', Icon: HomeIcon },
    { href: '/bookings', label: '予約', Icon: TicketIcon },
    { href: '/history', label: '履歴', Icon: CalendarDaysIcon },
    { href: '/test', label: 'アカウント', Icon: UserCircleIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-1 shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)] border-t border-gray-200 dark:border-gray-700 z-50">
      <ul className="flex justify-around items-center max-w-xl mx-auto h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center h-full py-1 transition-colors duration-150
                            ${isActive
                                ? 'text-green-600 dark:text-green-400 font-semibold'
                                : 'hover:text-green-500 dark:hover:text-green-300'
                            }`}
              >
                {/* --- アイコンを文字の上に (変更点) --- */}
                {/* アイコンの余白に色を付け、縁は白/色なし (変更点) */}
                <div className={`
                    p-2 rounded-full flex items-center justify-center 
                    ${isActive 
                        ? 'bg-green-600 dark:bg-green-400' // アクティブ時の背景色
                        : 'bg-gray-200 dark:bg-gray-700' // 非アクティブ時の背景色 (例: gray-200)
                    }
                `}>
                  <item.Icon
                    className={`h-5 w-5 text-white`} // アイコンの色を白に固定
                    aria-hidden="true"
                  />
                </div>
                {/* --- 文字をアイコンの下に (変更点) --- */}
                <span className="text-xs mt-1"> {/* アイコンとの間に少しマージン */}
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