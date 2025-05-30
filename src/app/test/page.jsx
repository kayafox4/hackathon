// src/app/test/page.jsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Cog6ToothIcon, BellIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link'; // 通知アイテムからのリンク用 (任意)
import { useState, useEffect, useRef, useTransition } from 'react';

// date-fns から必要な関数をインポート
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

// 作成した通知用サーバーアクションをインポート
import {
  getUnreadNotificationCount,
  getNotifications,
  markAllUserNotificationsAsRead
} from '@/app/actions/notification'; // 正しいパスを指定してください

export default function AccountPage() {
  const { data: session, status } = useSession();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isPanelClosing, setIsPanelClosing] = useState(false); // パネルを閉じるアニメーション用
  
  const notificationPanelRef = useRef(null); // パネルの外側クリック検知用
  const bellButtonRef = useRef(null); // ベルボタンの参照 (外側クリック検知の除外用)

  const [isMarkingReadPending, startMarkReadTransition] = useTransition();

  // 未読通知件数を取得する関数
  const fetchUnreadCount = async () => {
    if (session?.user?.email) {
      const result = await getUnreadNotificationCount();
      if (result.success) {
        setUnreadCount(result.count);
      }
    }
  };

  // 最初に未読件数を取得
  useEffect(() => {
    fetchUnreadCount();
  }, [session]);

  // 通知リストを取得し表示する関数
  const fetchAndDisplayNotifications = async () => {
    setIsLoadingNotifications(true);
    // includeRead: true で既読もいくつか表示する（最新の通知が見えるように）
    const result = await getNotifications({ limit: 7, includeRead: true }); 
    if (result.success) {
      setNotifications(result.notifications);
    } else {
      console.error("通知の取得に失敗しました:", result.error);
      setNotifications([]);
    }
    setIsLoadingNotifications(false);
  };

  // ベルアイコンがクリックされたときの処理
  const handleBellClick = () => {
    if (isPanelOpen) { // パネルが開いていたら閉じる
      setIsPanelClosing(true);
      setTimeout(() => {
        setIsPanelOpen(false);
        setIsPanelClosing(false);
      }, 200); // アニメーション時間と合わせる
    } else { // パネルが閉じていたら開く
      setIsPanelOpen(true);
      fetchAndDisplayNotifications(); // 通知リストを取得・表示
      if (unreadCount > 0) { // 未読があれば既読にする
        startMarkReadTransition(async () => {
          await markAllUserNotificationsAsRead();
          setUnreadCount(0); // UIを即時更新
        });
      }
    }
  };

  // 通知パネルの外側をクリックしたら閉じる useEffect
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target) &&
        bellButtonRef.current && // ベルボタンが存在し
        !bellButtonRef.current.contains(event.target) // ベルボタン自体へのクリックでない場合
      ) {
        if (isPanelOpen) { // パネルが開いているときのみ閉じる処理
            setIsPanelClosing(true);
            setTimeout(() => {
                setIsPanelOpen(false);
                setIsPanelClosing(false);
            }, 200);
        }
      }
    }
    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen]);


  if (status === 'loading') {
    return ( <div className="flex items-center justify-center min-h-screen p-4"><p className="text-lg">読み込み中...</p></div> );
  }

  if (session && session.user) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 pt-12 md:pt-20">
        <h1 className="text-3xl font-bold mb-8 text-green-700 dark:text-green-400 text-center">アカウント情報</h1>
        
        <div className="relative flex items-center justify-center space-x-4 mb-8"> {/* 通知パネルの基準点 */}
          <button
            ref={bellButtonRef} // ref をベルボタンに設定
            onClick={handleBellClick}
            className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors"
            aria-label="通知"
            aria-expanded={isPanelOpen}
          >
            <BellIcon className="h-7 w-7" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-gray-50 dark:ring-gray-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* アバター画像 (変更なし) */}
          {session.user.image ? ( <Image src={session.user.image} alt="User Avatar" width={80} height={80} className="rounded-full border-2 border-green-500 dark:border-green-400 shadow-md" priority /> ) : ( <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-green-500 dark:border-green-400 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A18.75 18.75 0 0 1 12 22.5c-2.786 0-5.433-.608-7.499-1.688Z" /></svg></div> )}
          {/* 設定ボタン (変更なし) */}
          <button onClick={() => alert('設定ボタン機能は準備中です🐾')} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors" aria-label="アカウント設定"><Cog6ToothIcon className="h-7 w-7" /></button>

          {/* 通知パネル */}
          {isPanelOpen && (
            <div
              ref={notificationPanelRef} // ref をパネルに設定
              className={`absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-30 overflow-hidden
                         transition-all duration-200 ease-out origin-top-right sm:origin-top-center
                         ${isPanelClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
            >
              <div className="flex justify-between items-center p-3 px-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-md text-gray-800 dark:text-gray-100">通知</h3>
                <button 
                  onClick={handleBellClick} // 閉じる動作も兼ねる
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                  aria-label="通知パネルを閉じる"
                >
                  <XMarkIcon className="h-5 w-5"/>
                </button>
              </div>
              {isLoadingNotifications ? (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">読み込み中...</div>
              ) : notifications.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.map(notif => (
                    <li key={notif.id} className={`border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${!notif.isRead ? 'bg-green-50 dark:bg-green-900/20' : 'bg-transparent'}`}>
                      {notif.link ? ( // 通知にリンクがある場合
                        <Link 
                          href={notif.link} 
                          className="block p-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setIsPanelOpen(false)} // リンククリックでパネルを閉じる
                        >
                          <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true, locale: ja })}
                          </p>
                        </Link>
                      ) : ( // リンクがない場合
                        <div className="p-3 px-4 text-sm">
                           <p className={`${!notif.isRead ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                             {notif.message}
                           </p>
                           <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true, locale: ja })}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">新しい通知はありません。</p>
              )}
               <div className="p-2 px-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <Link 
                  href="/history" 
                  onClick={() => setIsPanelOpen(false)} // リンククリックでパネルを閉じる
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                >
                  すべての履歴を見る
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ユーザー詳細情報カード (変更なし) */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md text-gray-700 dark:text-gray-300">
          <p className="text-lg mb-2"><strong>名前:</strong> {session.user.name || 'N/A'}</p>
          <p className="text-lg mb-4"><strong>メール:</strong> {session.user.email || 'N/A'}</p>
          <button onClick={() => signOut()} className="mt-6 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out">ログアウト</button>
        </div>
      </div>
    );
  }

  return ( <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 text-center"><h1 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">アクセスできません</h1><p className="text-lg text-gray-700 dark:text-gray-300 mb-4">このページを表示するにはログインが必要ですにゃ。</p></div> );
}