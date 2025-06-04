// src/app/test/page.jsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { BellIcon as BellIconSolid, UserCircleIcon as UserCircleIconSolid, Cog6ToothIcon as Cog6ToothIconSolid, XMarkIcon, CreditCardIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState, useEffect, useRef, useTransition } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

import {
  getUnreadNotificationCount,
  getNotifications,
  markAllUserNotificationsAsRead
} from '@/app/actions/notification';

export default function MyPage() {
  const { data: session, status } = useSession();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // 通知パネル用
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isPanelClosing, setIsPanelClosing] = useState(false);
  
  const notificationPanelRef = useRef(null);
  const bellButtonRef = useRef(null);

  const [isMarkingReadPending, startMarkReadTransition] = useTransition();

  // --- ↓↓↓ 会員情報表示用のstateを追加 ↓↓↓ ---
  const [showMemberInfo, setShowMemberInfo] = useState(false); 
  // --- ↑↑↑ 会員情報表示用のstateを追加 ↑↑↑ ---

  const fetchUnreadCount = async () => {
    if (session?.user?.email) {
      const result = await getUnreadNotificationCount();
      if (result.success) setUnreadCount(result.count);
    }
  };

  useEffect(() => { fetchUnreadCount(); }, [session]);

  const fetchAndDisplayNotifications = async () => {
    setIsLoadingNotifications(true);
    const result = await getNotifications({ limit: 7, includeRead: true }); 
    if (result.success) setNotifications(result.notifications || []);
    else setNotifications([]);
    setIsLoadingNotifications(false);
  };

  const handleBellClick = () => {
    if (isPanelOpen) {
      setIsPanelClosing(true);
      setTimeout(() => { setIsPanelOpen(false); setIsPanelClosing(false); }, 200); 
    } else {
      setIsPanelOpen(true);
      fetchAndDisplayNotifications();
      if (unreadCount > 0) {
        startMarkReadTransition(async () => {
          const markResult = await markAllUserNotificationsAsRead();
          if(markResult.success) setUnreadCount(0);
        });
      }
    }
  };
  
  // --- ↓↓↓ プロフィールカードクリック時の処理を追加 ↓↓↓ ---
  const handleProfileCardClick = () => {
    setShowMemberInfo(prev => !prev); // 会員情報の表示/非表示を切り替え
  };
  // --- ↑↑↑ プロフィールカードクリック時の処理を追加 ↑↑↑ ---

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target) && bellButtonRef.current && !bellButtonRef.current.contains(event.target)) {
        if (isPanelOpen) {
          setIsPanelClosing(true);
          setTimeout(() => { setIsPanelOpen(false); setIsPanelClosing(false); }, 200);
        }
      }
    }
    if (isPanelOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelOpen]);

  if (status === 'loading') {
    return ( <div className="flex items-center justify-center min-h-screen p-4"><p className="text-lg">読み込み中...</p></div> );
  }

  if (session && session.user) {
    const InfoCard = ({ icon: Icon, label, badgeCount, onClick }) => (
      <button 
        onClick={onClick || (() => alert(`${label}がクリックされました（機能準備中）`))}
        className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square w-full text-center"
        aria-expanded={label === "プロフィール" ? showMemberInfo : (label === "通知" ? isPanelOpen : undefined )} // プロフィールカードと通知カードにaria-expanded追加
      >
        <div className="relative">
          <Icon className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
          {badgeCount > 0 && (
            <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-1 ring-white dark:ring-gray-700">
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          )}
        </div>
        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">{label}</span>
      </button>
    );

    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 pb-20">
        <h1 className="text-2xl font-bold mt-6 mb-6 text-gray-800 dark:text-gray-100">
          マイページ
        </h1>

        <div className="relative flex items-center justify-center space-x-6 mb-8" ref={notificationPanelRef}> {/* notificationPanelRefは通知パネル自身に付けた方が正確 */}
          {session.user.image ? ( <Image src={session.user.image} alt="User Avatar" width={72} height={72} className="rounded-full border-2 border-green-500 shadow-md" priority /> ) : ( <div className="w-18 h-18 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-green-500 shadow-md"><UserCircleIconSolid className="w-10 h-10" /></div> )}
          <button ref={bellButtonRef} onClick={handleBellClick} className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors" aria-label="通知" aria-expanded={isPanelOpen}>
            <BellIconSolid className="h-7 w-7" />
            {unreadCount > 0 && ( <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-white dark:ring-gray-800">{unreadCount > 9 ? '9+' : unreadCount}</span> )}
          </button>
          {isPanelOpen && ( <div ref={notificationPanelRef} className={`absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-30 overflow-hidden transition-all duration-200 ease-out origin-top-right sm:origin-top-center ${isPanelClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              {/* ... (通知パネルの中身はそのまま) ... */}
              <div className="flex justify-between items-center p-3 px-4 border-b border-gray-200 dark:border-gray-700"><h3 className="font-semibold text-md text-gray-800 dark:text-gray-100">通知</h3><button onClick={handleBellClick} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400" aria-label="通知パネルを閉じる"><XMarkIcon className="h-5 w-5"/></button></div>
              {isLoadingNotifications ? ( <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">読み込み中...</div> )
              : (notifications && notifications.length > 0) ? ( <ul className="max-h-80 overflow-y-auto">{notifications.map(notif => { let timeAgo = '日時不明'; try { if (notif && notif.createdAt) { timeAgo = formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true, locale: ja }); } else if (notif) { console.warn("Notification item missing createdAt:", notif); } else { console.warn("Notification item is null or undefined"); return null; } } catch (e) { console.error('日時のフォーマットエラー:', e, '元のcreatedAt:', notif?.createdAt); } return ( <li key={notif.id} className={`border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${!notif.isRead ? 'bg-green-50 dark:bg-green-900/20' : 'bg-transparent'}`}>{notif.link ? ( <Link href={notif.link} className="block p-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" onClick={() => setIsPanelOpen(false)}><p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>{notif.message || 'メッセージなし'}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo}</p></Link> ) : ( <div className="p-3 px-4 text-sm"><p className={`${!notif.isRead ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>{notif.message || 'メッセージなし'}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo}</p></div> )}</li> ); })}</ul> )
              : ( <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">新しい通知はありません。</p> )}
              <div className="p-2 px-4 border-t border-gray-200 dark:border-gray-700 text-center"><Link href="/history" onClick={() => { setIsPanelClosing(true); setTimeout(() => {setIsPanelOpen(false); setIsPanelClosing(false);}, 200);}} className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium">すべての履歴を見る</Link></div>
            </div>
          )}
        </div>

        <div className="w-full max-w-md mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300 px-1">基本情報</h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <InfoCard icon={BellIconSolid} label="通知" badgeCount={unreadCount} onClick={handleBellClick} />
            {/* --- ↓↓↓ プロフィールカードに onClick を設定 ↓↓↓ --- */}
            <InfoCard icon={UserCircleIconSolid} label="プロフィール" onClick={handleProfileCardClick} />
            {/* --- ↑↑↑ プロフィールカードに onClick を設定 ↑↑↑ --- */}
            <InfoCard icon={Cog6ToothIconSolid} label="設定" />
          </div>
        </div>

        {/* --- ↓↓↓ 会員情報セクションを条件付きで表示し、ニックネームを削除 ↓↓↓ --- */}
        {showMemberInfo && (
          <div className="w-full max-w-md mb-8 transition-all duration-300 ease-in-out opacity-100 transform_ animate-fadeIn"> {/* アニメーション用クラス（別途定義またはTailwind JITで） */}
            <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300 px-1">会員情報</h2>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              {/* ニックネームの表示を削除 */}
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400">お名前</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{session.user.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center mb-4"> {/* ニックネーム削除に伴い、下の要素のmbを調整 */}
                <span className="text-sm text-gray-600 dark:text-gray-400">メールアドレス</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{session.user.email || 'N/A'}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="mt-4 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition duration-200 ease-in-out"
              >
                ログアウト
              </button>
            </div>
          </div>
        )}
        {/* --- ↑↑↑ 会員情報セクションここまで ↑↑↑ --- */}

        <div className="w-full max-w-md mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300 px-1">お支払い</h2>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
            <CreditCardIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <button className="w-full max-w-xs mx-auto py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors">
              支払い方法選択
            </button>
            <p className="mt-3">
              <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-green-600 hover:underline">お支払いヘルプ</a>
            </p>
          </div>
        </div>
        
      </div>
    );
  }

  return ( <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 text-center"><h1 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">アクセスできません</h1><p className="text-lg text-gray-700 dark:text-gray-300 mb-4">このページを表示するにはログインが必要です。</p></div> );
}