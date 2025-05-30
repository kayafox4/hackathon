// src/app/test/page.jsx
'use client'; // クライアントコンポーネントとしてマーク

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Cog6ToothIcon } from '@heroicons/react/24/solid'; // 設定用の歯車アイコンをインポート

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-gray-700 dark:text-gray-300">
        <p className="text-lg">セッション情報を読み込み中...</p>
      </div>
    );
  }

  if (session && session.user) { // session.user も存在するか確認
    return (
      // ページ全体のコンテナ: 上部からのパディングを追加し、justify-startで上寄せに
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 pt-12 md:pt-20">
        
        {/* ページタイトル */}
        <h1 className="text-3xl font-bold mb-8 text-green-700 dark:text-green-400 text-center">
          アカウント情報
        </h1>

        {/* アバターと設定ボタンの行 */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {session.user.image ? ( // 画像がある場合のみ表示
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={80} // サイズを小さく (例: 100 -> 80)
              height={80} // サイズを小さく
              className="rounded-full border-2 border-green-500 dark:border-green-400 shadow-md" // 枠線を少し細く、影を調整
              priority // ページ読み込み優先度を上げる場合
            />
          ) : (
            // 画像がない場合のプレースホルダー (任意)
            <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-green-500 dark:border-green-400 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A18.75 18.75 0 0 1 12 22.5c-2.786 0-5.433-.608-7.499-1.688Z" />
              </svg>
            </div>
          )}
          
          {/* 設定ボタン (歯車アイコン) */}
          <button
            onClick={() => alert('設定ボタンが押されましたにゃん！機能はまだ準備中です🐾')} // 仮の動作
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors"
            aria-label="アカウント設定"
          >
            <Cog6ToothIcon className="h-7 w-7" /> {/* アイコンサイズ調整 */}
          </button>
        </div>

        {/* ユーザー詳細情報カード */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md text-gray-700 dark:text-gray-300">
          <p className="text-lg mb-2">
            <strong>名前:</strong> {session.user.name || 'N/A'}
          </p>
          <p className="text-lg mb-4">
            <strong>メール:</strong> {session.user.email || 'N/A'}
          </p>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400">
            (セッションID: {session.id}) // デバッグ用
          </p> */}
          <button
            onClick={() => signOut()}
            className="mt-6 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out"
          >
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  // ログインしていない場合 (変更なし)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 text-center">
      <h1 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">アクセスできません</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">このページを表示するにはログインが必要ですにゃ。</p>
      {/* ここにログインページへのリンクボタンなどを置くと親切です */}
      {/* 例: <Link href="/api/auth/signin" className="text-green-600 hover:underline">ログインページへ</Link> */}
    </div>
  );
}