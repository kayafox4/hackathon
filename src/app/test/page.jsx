// src/app/test/page.jsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { BellIcon as BellIconSolid, UserCircleIcon as UserCircleIconSolid, Cog6ToothIcon as Cog6ToothIconSolid, XMarkIcon, CreditCardIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState, useEffect, useRef, useTransition } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

// 通知用サーバーアクションをインポート (実際のパスに合わせてください)
import {
  getUnreadNotificationCount,
  getNotifications,
  markAllUserNotificationsAsRead
} from '@/app/actions/notification';

export default function MyPage() {
  const { data: session, status } = useSession();

  // 各種モーダル・パネルのstate
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isNotificationPanelClosing, setIsNotificationPanelClosing] = useState(false);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileModalClosing, setIsProfileModalClosing] = useState(false);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Refs for popovers/modals and their triggers
  const notificationPanelRef = useRef(null);
  const bellButtonRef = useRef(null);
  const profileModalRef = useRef(null);
  const profileCardRef = useRef(null);
  const paymentModalRef = useRef(null);
  const paymentButtonRef = useRef(null);
  const helpModalRef = useRef(null);
  const helpLinkRef = useRef(null);

  const [isMarkingReadPending, startMarkReadTransition] = useTransition();

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
    else {
      console.error("通知の取得に失敗:", result.error);
      setNotifications([]);
    }
    setIsLoadingNotifications(false);
  };
  
  const closeModalWithAnimation = (setter, closingSetter) => {
    if (closingSetter) closingSetter(true);
    setTimeout(() => {
        setter(false);
        if (closingSetter) closingSetter(false);
    }, 200); // アニメーション時間
  };

  const openModalAndCloseOthers = (modalSetterToOpen) => {
    setIsNotificationPanelOpen(false);
    setIsProfileModalOpen(false);
    setIsPaymentModalOpen(false);
    setIsHelpModalOpen(false);
    modalSetterToOpen(true);
  };

  const handleBellClick = () => {
    if (isNotificationPanelOpen) {
      closeModalWithAnimation(setIsNotificationPanelOpen, setIsNotificationPanelClosing);
    } else {
      openModalAndCloseOthers(setIsNotificationPanelOpen);
      fetchAndDisplayNotifications();
      if (unreadCount > 0) {
        startMarkReadTransition(async () => {
          const markResult = await markAllUserNotificationsAsRead();
          if(markResult.success) setUnreadCount(0);
        });
      }
    }
  };
  
  const handleProfileCardClick = () => {
    if (isProfileModalOpen) {
      closeModalWithAnimation(setIsProfileModalOpen, setIsProfileModalClosing);
    } else {
      openModalAndCloseOthers(setIsProfileModalOpen);
    }
  };

  const handlePaymentButtonClick = () => {
    openModalAndCloseOthers(setIsPaymentModalOpen);
  };
  
  const handleHelpLinkClick = (e) => {
    e.preventDefault();
    openModalAndCloseOthers(setIsHelpModalOpen);
  };
  
  const paymentOptions = [
    { id: 'credit_card', name: 'クレジットカード／デビットカード', examples: 'Visa, Mastercard, JCB など' },
    { id: 'online_payment_service', name: 'オンライン決済サービス', examples: 'PayPal, Apple Pay, Google Pay' },
    { id: 'qr_code', name: 'QRコード決済', examples: 'PayPay, LINE Pay, 楽天ペイ など' },
    { id: 'konbini', name: 'コンビニ決済' },
    { id: 'carrier', name: 'キャリア決済' },
    { id: 'bank_transfer', name: '銀行振込' },
    { id: 'e_money', name: '電子マネー', examples: '交通系IC、楽天Edy など' },
  ];

  const handlePaymentMethodSelect = (methodName) => {
    setSelectedPaymentMethod(methodName);
    setIsPaymentModalOpen(false); // 選択したら支払いモーダルを閉じる
    alert(`${methodName} が選択されましたにゃん！（実際の処理はまだです）`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      // 通知パネル
      if (isNotificationPanelOpen && notificationPanelRef.current && !notificationPanelRef.current.contains(event.target) && bellButtonRef.current && !bellButtonRef.current.contains(event.target)) {
        closeModalWithAnimation(setIsNotificationPanelOpen, setIsNotificationPanelClosing);
      }
      // プロフィールモーダル
      if (isProfileModalOpen && profileModalRef.current && !profileModalRef.current.contains(event.target) && profileCardRef.current && !profileCardRef.current.contains(event.target)) {
        closeModalWithAnimation(setIsProfileModalOpen, setIsProfileModalClosing);
      }
      // 支払い方法選択モーダル
      if (isPaymentModalOpen && paymentModalRef.current && !paymentModalRef.current.contains(event.target) && paymentButtonRef.current && !paymentButtonRef.current.contains(event.target)) {
        setIsPaymentModalOpen(false);
      }
      // ヘルプモーダル
      if (isHelpModalOpen && helpModalRef.current && !helpModalRef.current.contains(event.target) && helpLinkRef.current && !helpLinkRef.current.contains(event.target)) {
        setIsHelpModalOpen(false);
      }
    }
    if (isNotificationPanelOpen || isProfileModalOpen || isPaymentModalOpen || isHelpModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationPanelOpen, isProfileModalOpen, isPaymentModalOpen, isHelpModalOpen]);


  if (status === 'loading') {
    return ( <div className="flex items-center justify-center min-h-screen p-4"><p className="text-lg">読み込み中...</p></div> );
  }

  if (session && session.user) {
    const InfoCard = ({ icon: Icon, label, badgeCount, onClick, cardRef }) => (
      <button 
        ref={cardRef}
        onClick={onClick || (() => alert(`${label}がクリックされましたにゃん（機能準備中）`))}
        className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square w-full text-center"
        aria-expanded={
            label === "プロフィール" ? isProfileModalOpen : 
            (label === "通知" ? isNotificationPanelOpen : undefined )
        }
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
        
        <div className="relative flex items-center justify-center space-x-6 mb-8">
          {session.user.image ? ( <Image src={session.user.image} alt="User Avatar" width={72} height={72} className="rounded-full border-2 border-green-500 shadow-md" priority onError={(e) => { e.currentTarget.style.display = 'none'; const placeholder = e.currentTarget.nextSibling; if(placeholder) placeholder.style.display='flex'; }} /> ) : null }
          {(!session.user.image) && <div className="w-[72px] h-[72px] rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-green-500 shadow-md"><UserCircleIconSolid className="w-10 h-10" /></div>}
          
          <button ref={bellButtonRef} onClick={handleBellClick} className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors" aria-label="通知" aria-expanded={isNotificationPanelOpen}>
            <BellIconSolid className="h-7 w-7" />
            {unreadCount > 0 && ( <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-white dark:ring-gray-800">{unreadCount > 9 ? '9+' : unreadCount}</span> )}
          </button>

          {isNotificationPanelOpen && ( <div ref={notificationPanelRef} className={`absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-30 overflow-hidden transition-all duration-200 ease-out origin-top-right sm:origin-top-center ${isNotificationPanelClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              <div className="flex justify-between items-center p-3 px-4 border-b border-gray-200 dark:border-gray-700"><h3 className="font-semibold text-md text-gray-800 dark:text-gray-100">通知</h3><button onClick={handleBellClick} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400" aria-label="通知パネルを閉じる"><XMarkIcon className="h-5 w-5"/></button></div>
              {isLoadingNotifications ? ( <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">読み込み中...</div> )
              : (notifications && notifications.length > 0) ? ( <ul className="max-h-80 overflow-y-auto">{notifications.map(notif => { let timeAgo = '日時不明'; try { if (notif && notif.createdAt) { timeAgo = formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true, locale: ja }); } else { if(notif) console.warn("Notification item missing createdAt:", notif); else console.warn("Notification item is null/undefined");} } catch (e) { console.error('日時のフォーマットエラー:', e, '元のcreatedAt:', notif?.createdAt); } return ( <li key={notif.id} className={`border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${!notif.isRead ? 'bg-green-50 dark:bg-green-900/20' : 'bg-transparent'}`}>{notif.link ? ( <Link href={notif.link} className="block p-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" onClick={() => closeModalWithAnimation(setIsNotificationPanelOpen, setIsNotificationPanelClosing)}><p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>{notif.message || 'メッセージなし'}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo}</p></Link> ) : ( <div className="p-3 px-4 text-sm"><p className={`${!notif.isRead ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>{notif.message || 'メッセージなし'}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo}</p></div> )}</li> ); })}</ul> )
              : ( <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">新しい通知はありません。</p> )}
              <div className="p-2 px-4 border-t border-gray-200 dark:border-gray-700 text-center"><Link href="/history" onClick={() => closeModalWithAnimation(setIsNotificationPanelOpen, setIsNotificationPanelClosing)} className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium">すべての履歴を見る</Link></div>
            </div>
          )}
        </div>

        <div className="w-full max-w-md mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300 px-1">基本情報</h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <InfoCard icon={BellIconSolid} label="通知" badgeCount={unreadCount} onClick={handleBellClick} cardRef={bellButtonRef} />
            <InfoCard icon={UserCircleIconSolid} label="プロフィール" onClick={handleProfileCardClick} cardRef={profileCardRef} />
            <InfoCard icon={Cog6ToothIconSolid} label="設定" onClick={() => alert('アプリ設定機能は準備中ですにゃん')} />
          </div>
        </div>

        {isProfileModalOpen && (
          <div ref={profileModalRef} className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-40 p-4 transition-all duration-200 ease-out ${isProfileModalClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-2xl p-6 w-11/12 max-w-sm">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">アカウント情報</h3><button onClick={handleProfileCardClick} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500"><XMarkIcon className="h-6 w-6" /></button></div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300"><div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600"><span>お名前:</span><span className="font-medium">{session.user.name || 'N/A'}</span></div><div className="flex justify-between items-center py-2"><span>メール:</span><span className="font-medium">{session.user.email || 'N/A'}</span></div></div>
              <button onClick={() => { signOut(); closeModalWithAnimation(setIsProfileModalOpen, setIsProfileModalClosing); }} className="mt-6 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition duration-200 ease-in-out">ログアウト</button>
            </div>
          </div>
        )}

        <div className="w-full max-w-md mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300 px-1">お支払い</h2>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
            <CreditCardIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <button ref={paymentButtonRef} onClick={handlePaymentButtonClick} className="w-full max-w-xs mx-auto py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors">
              支払い方法選択
            </button>
            {selectedPaymentMethod && (<p className="mt-3 text-sm text-gray-600 dark:text-gray-400">選択中の方法: <span className="font-semibold">{selectedPaymentMethod}</span></p>)}
            <p className="mt-3"><a href="#" ref={helpLinkRef} onClick={handleHelpLinkClick} className="text-xs text-green-600 hover:underline">お支払いヘルプ</a></p>
          </div>
        </div>

        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={paymentModalRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">お支払い方法を選択</h3><button onClick={() => setIsPaymentModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="閉じる"><XMarkIcon className="h-6 w-6" /></button></div>
              <ul className="space-y-3 overflow-y-auto pr-2">{paymentOptions.map(option => ( <li key={option.id}><button onClick={() => handlePaymentMethodSelect(option.name)} className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"><span className="font-medium text-gray-800 dark:text-gray-100">{option.name}</span>{option.examples && <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.examples}</span>}</button></li> ))}</ul>
            </div>
          </div>
        )}
        
        {isHelpModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div ref={helpModalRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-600"><h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">お支払いヘルプ</h3><button onClick={() => setIsHelpModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="閉じる"><XMarkIcon className="h-6 w-6" /></button></div>
              <div className="space-y-4 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 pr-2"><p><strong>利用可能なお支払い方法について</strong><br/>当サービスでは、クレジットカード、デビットカード、各種オンライン決済、QRコード決済、コンビニ決済、キャリア決済、銀行振込、電子マネーをご利用いただけるよう準備を進めています。（現在は表示のみです）</p><p><strong>クレジットカード情報の登録・変更</strong><br/>「支払い方法選択」ボタンから、ご利用になるカード情報を登録・変更してください。セキュリティは万全を期しております。</p><p><strong>決済が失敗する場合</strong><br/>カード情報（番号、有効期限、セキュリティコード）に誤りがないかご確認ください。また、カード会社側の利用制限や残高不足なども原因となることがあります。</p><p><strong>お問い合わせ</strong><br/>その他ご不明な点がございましたら、サポートまでお気軽にお問い合わせください。（現在はまだサポート窓口はありません）</p></div>
              <button onClick={() => setIsHelpModalOpen(false)} className="mt-6 w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors">閉じる</button>
            </div>
          </div>
        )}
      </div> // ← ページ全体を囲む一番外側のdivの閉じタグ
    );
  }

  // ログインしていない場合の表示
  return ( <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 text-center"><h1 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">アクセスできません</h1><p className="text-lg text-gray-700 dark:text-gray-300 mb-4">このページを表示するにはログインが必要ですにゃ。</p></div> );
}