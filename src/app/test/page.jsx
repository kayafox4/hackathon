// src/app/test/page.jsx
'use client'; // クライアントコンポーネントとしてマーク

import { useSession, signOut } from 'next-auth/react'; // NextAuth.jsのフックをインポート
import Image from 'next/image'; // プロフィール画像表示のためにImageコンポーネントをインポート

export default function AccountPage() {
  const { data: session, status } = useSession(); // セッション情報とステータスを取得

  if (session && session.user) {
      console.log('User image URL:', session.user.image);
    }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-gray-700 dark:text-gray-300">
        <p className="text-lg">セッション情報を読み込み中...</p>
      </div>
    );
  }

  // ログインしている場合
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4">
        <h1 className="text-3xl font-bold mb-6 text-green-700 dark:text-green-300">アカウント情報</h1>

        {session.user.image && (
          <div className="mb-4">
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full border-4 border-green-500 dark:border-green-400 shadow-lg"
            />
          </div>
        )}

        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md">
          <p className="text-lg mb-2">
            <strong>名前:</strong> {session.user.name || 'N/A'}
          </p>
          <p className="text-lg mb-4">
            <strong>メール:</strong> {session.user.email || 'N/A'}
          </p>
          {/* 追加で表示したい情報があればここに追記 */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            (セッションID: {session.id}) {/* セッションIDはデバッグ用、本番では非表示にすることも検討 */}
          </p>

          <button
            onClick={() => signOut()} // ログアウトボタン
            className="mt-6 w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out"
          >
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  // ログインしていない場合
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 text-center">
      <h1 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">アクセス拒否</h1>
      <p className="text-lg mb-4">このページにアクセスするにはログインが必要です。</p>
      <p className="text-md text-gray-600 dark:text-gray-400">ナビゲーションバーの「ホーム」からログインしてください。</p>
    </div>
  );
}