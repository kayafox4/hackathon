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
} from '@/app/actions/notification'; // パスを確認

export default function MyPage() {
  const { data: session, status } = useSession();

  // 通知関連のstate (変更なし)
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isNotificationPanelClosing, setIsNotificationPanelClosing] = useState(false);
  
  const notificationPanelRef = useRef(null);
  const bellButtonRef = useRef(null);
  const [isMarkingReadPending, startMarkReadTransition] = useTransition();

  // --- ↓↓↓ プロフィール情報モーダル用のstateとrefを追加 ↓↓↓ ---
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileModalClosing, setIsProfileModalClosing] = useState(false);
  const profileModalRef = useRef(null);
  const profileCardRef = useRef(null); // プロフィールカードのref (外側クリック判定用)
  // --- ↑↑↑ プロフィール情報モーダル用のstateとrefを追加 ↑↑↑ ---

  // 未読通知件数取得 (変更なし)
  const fetchUnreadCount = async () => {
    if (session?.user?.email) {
      const result = await getUnreadNotificationCount();
      if (result.success) setUnreadCount(result.count);
    }
  };
  useEffect(() => { fetchUnreadCount(); }, [session]);

  // 通知リスト取得 (変更なし)
  const fetchAndDisplayNotifications = async () => {
    setIsLoadingNotifications(true);
    const result = await getNotifications({ limit: 7, includeRead: true }); 
    if (result.success) setNotifications(result.notifications || []);
    else setNotifications([]);
    setIsLoadingNotifications(false);
  };

  // ベルアイコンクリック処理 (プロフィールモーダルを閉じる処理を追加)
  const handleBellClick = () => {
    if (isNotificationPanelOpen) {
      setIsNotificationPanelClosing(true);
      setTimeout(() => { setIsNotificationPanelOpen(false); setIsNotificationPanelClosing(false); }, 200); 
    } else {
      setIsProfileModalOpen(false); // ★ プロフィールモーダルが開いていれば閉じる
      setIsNotificationPanelOpen(true);
      fetchAndDisplayNotifications();
      if (unreadCount > 0) {
        startMarkReadTransition(async () => {
          const markResult = await markAllUserNotificationsAsRead();
          if(markResult.success) setUnreadCount(0);
        });
      }
    }
  };
  
  // プロフィールカードクリック処理 (通知パネルを閉じる処理を追加)
  const handleProfileCardClick = () => {
    if (isProfileModalOpen) {
        setIsProfileModalClosing(true);
        setTimeout(() => { setIsProfileModalOpen(false); setIsProfileModalClosing(false); }, 200);
    } else {
        setIsNotificationPanelOpen(false); // ★ 通知パネルが開いていれば閉じる
        setIsProfileModalOpen(true);
    }
  };

  // 通知パネルの外側クリックで閉じる (変更なし)
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target) && bellButtonRef.current && !bellButtonRef.current.contains(event.target)) {
        if (isNotificationPanelOpen) {
          setIsNotificationPanelClosing(true);
          setTimeout(() => { setIsNotificationPanelOpen(false); setIsNotificationPanelClosing(false); }, 200);
        }
      }
    }
    if (isNotificationPanelOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationPanelOpen]);

  // --- ↓↓↓ プロフィールモーダルの外側クリックで閉じる useEffect を追加 ↓↓↓ ---
  useEffect(() => {
    function handleClickOutsideProfileModal(event) {
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target) && // モーダル自身の内側でない
        profileCardRef.current && 
        !profileCardRef.current.contains(event.target) // プロフィールカード自身でない (開くトリガーなので)
      ) {
        if (isProfileModalOpen) {
            setIsProfileModalClosing(true);
            setTimeout(() => { setIsProfileModalOpen(false); setIsProfileModalClosing(false); }, 200);
        }
      }
    }
    if (isProfileModalOpen) {
      document.addEventListener('mousedown', handleClickOutsideProfileModal);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideProfileModal);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideProfileModal);
    };
  }, [isProfileModalOpen]);
  // --- ↑↑↑ プロフィールモーダルの外側クリックで閉じる useEffect を追加 ↑↑↑ ---


  if (status === 'loading') { /* ... (変更なし) ... */ }

  if (session && session.user) {
    const InfoCard = ({ icon: Icon, label, badgeCount, onClick, cardRef }) => ( // cardRef を追加
      <button 
        ref={cardRef} // ref を設定
        onClick={onClick || (() => alert(`${label}がクリックされましたにゃん（機能準備中）`))}
        className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square w-full text-center"
        aria-expanded={
            label === "プロフィール" ? isProfileModalOpen : 
            (label === "通知" ? isNotificationPanelOpen : undefined )
        }
      >
        {/* ... (InfoCardの中身は変更なし) ... */}
        <div className="relative"><Icon className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />{badgeCount > 0 && ( <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-1 ring-white dark:ring-gray-700">{badgeCount > 9 ? '9+' : badgeCount}</span> )}</div><span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">{label}</span>
      </button>
    );

    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 pb-20">
        <h1 className="text-2xl font-bold mt-6 mb-6 text-gray-800 dark:text-gray-100">マイページ</h1>
        
        {/* アバターとベルアイコン */}
        <div className="relative flex items-center justify-center space-x-6 mb-8"> {/* このdivが通知パネルの基準点 */}
          {/* ... (アバター表示、ベルボタン表示は変更なし) ... */}
          {session.user.image ? ( <Image src={session.user.image} alt="User Avatar" width={72} height={72} className="rounded-full border-2 border-green-500 shadow-md" priority /> ) : ( <div className="w-18 h-18 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-green-500 shadow-md"><UserCircleIconSolid className="w-10 h-10" /></div> )}
          <button ref={bellButtonRef} onClick={handleBellClick} className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors" aria-label="通知" aria-expanded={isNotificationPanelOpen}>
            <BellIconSolid className="h-7 w-7" />
            {unreadCount > 0 && ( <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-white dark:ring-gray-800">{unreadCount > 9 ? '9+' : unreadCount}</span> )}
          </button>

          {/* 通知パネル (変更なし) */}
          {isNotificationPanelOpen && ( <div ref={notificationPanelRef} className={`absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-30 overflow-hidden transition-all duration-200 ease-out origin-top-right sm:origin-top-center ${isNotificationPanelClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              {/* ... (通知パネルの中身はそのまま) ... */}
              <div className="flex justify-between items-center p-3 px-4 border-b border-gray-200 dark:border-gray-700"><h3 className="font-semibold text-md text-gray-800 dark:text-gray-100">通知</h3><button onClick={handleBellClick} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400" aria-label="通知パネルを閉じる"><XMarkIcon className="h-5 w-5"/></button></div>
              {isLoadingNotifications ? ( <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">読み込み中...</div> )
              : (notifications && notifications.length > 0) ? ( <ul className="max-h-80 overflow-y-auto">{notifications.map(notif => { let timeAgo = '日時不明'; try { if (notif && notif.createdAt) { timeAgo = formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true, locale: ja }); } else if (notif) { console.warn("Notification item missing createdAt:", notif); } else { console.warn("Notification item is null or undefined"); return null; } } catch (e) { console.error('日時のフォーマットエラー:', e, '元のcreatedAt:', notif?.createdAt); } return ( <li key={notif.id} className={`border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${!notif.isRead ? 'bg-green-50 dark:bg-green-900/20' : 'bg-transparent'}`}>{notif.link ? ( <Link href={notif.link} className="block p-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" onClick={() => setIsNotificationPanelOpen(false)}><p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>{notif.message || 'メッセージなし'}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo}</p></Link> ) : ( <div className="p-3 px-4 text-sm"><p className={`${!notif.isRead ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>{notif.message || 'メッセージなし'}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo}</p></div> )}</li> ); })}</ul> )
              : ( <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">新しい通知はありません。</p> )}
              <div className="p-2 px-4 border-t border-gray-200 dark:border-gray-700 text-center"><Link href="/history" onClick={() => { setIsNotificationPanelClosing(true); setTimeout(() => {setIsNotificationPanelOpen(false); setIsNotificationPanelClosing(false);}, 200);}} className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium">すべての履歴を見る</Link></div>
            </div>
          )}
        </div>

        {/* 基本情報セクション */}
        <div className="w-full max-w-md mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300 px-1">基本情報</h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <InfoCard icon={BellIconSolid} label="通知" badgeCount={unreadCount} onClick={handleBellClick} />
            {/* --- ↓↓↓ プロフィールカードに onClick と ref を設定 ↓↓↓ --- */}
            <InfoCard 
              icon={UserCircleIconSolid} 
              label="プロフィール" 
              onClick={handleProfileCardClick} 
              cardRef={profileCardRef} // refを渡す
            />
            {/* --- ↑↑↑ プロフィールカードに onClick と ref を設定 ↑↑↑ --- */}
            <InfoCard icon={Cog6ToothIconSolid} label="設定" />
          </div>
        </div>

        {/* --- ↓↓↓ プロフィール情報モーダル (小ウィンドウ) ↓↓↓ --- */}
        {isProfileModalOpen && (
          <div 
            ref={profileModalRef} // ref を設定
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm bg-white dark:bg-gray-700 rounded-xl shadow-2xl p-6 z-40
                       transition-all duration-200 ease-out
                       ${isProfileModalClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
            // 画面中央に表示するスタイル (top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2)
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">アカウント情報</h3>
              <button onClick={handleProfileCardClick} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                <span>お名前:</span>
                <span className="font-medium">{session.user.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>メール:</span>
                <span className="font-medium">{session.user.email || 'N/A'}</span>
              </div>
            </div>
            <button
              onClick={() => {
                signOut();
                setIsProfileModalOpen(false); // ログアウト時にモーダルも閉じる
              }}
              className="mt-6 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition duration-200 ease-in-out"
            >
              ログアウト
            </button>
          </div>
        )}
        {/* --- ↑↑↑ プロフィール情報モーダルここまで ↑↑↑ --- */}


        {/* お支払いセクション (変更なし) */}
        <div className="w-full max-w-md mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300 px-1">お支払い</h2>
          {/* ... (お支払いセクションの中身はそのまま) ... */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center"><CreditCardIcon className="h-16 w-16 text-green-500 mx-auto mb-4" /><button className="w-full max-w-xs mx-auto py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors">支払い方法選択</button><p className="mt-3"><a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-green-600 hover:underline">お支払いヘルプ</a></p></div>
        </div>
        
        {/* 会員情報セクションは、上記プロフィールモーダルに移動したので削除 */}
        
      </div>
    );
  }

  return ( <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 text-center"><h1 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">アクセスできません</h1><p className="text-lg text-gray-700 dark:text-gray-300 mb-4">このページを表示するにはログインが必要ですにゃ。</p></div> );
}