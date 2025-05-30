// src/app/components/CancelBookingButton.jsx
'use client';

import { useState, useTransition } from 'react'; // useTransition を追加
import { cancelBookingAction } from '@/app/actions/booking'; // Server Action をインポート

export default function CancelBookingButton({ bookingId }) {
  // isPending はServer Actionの処理中かどうかを示す
  // startTransition はServer Actionの呼び出しをラップする
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(''); // ユーザーへのフィードバックメッセージ

  const handleCancel = () => {
    setMessage(''); // 前のメッセージをクリア

    // 確認ダイアログを表示
    if (!window.confirm('本当にこの予約をキャンセルしますか？')) {
      return; // ユーザーが「いいえ」を選んだら何もしない
    }

    startTransition(async () => {
      const result = await cancelBookingAction(bookingId);
      if (result.success) {
        // revalidatePath が /history を更新するので、
        // ここで特別な画面更新は不要なはず。
        // 必要であれば、短い成功メッセージを表示するのも良いでしょう。
        alert(result.message); // シンプルにalertで表示
      } else {
        alert(`エラー: ${result.message || 'キャンセルに失敗しました。'}`);
        setMessage(result.message || 'キャンセルに失敗しました。');
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCancel}
        disabled={isPending} // 処理中はボタンを無効化
        className="w-full sm:w-auto mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? 'キャンセル処理中...' : 'キャンセル'}
      </button>
      {/* エラーメッセージなどを表示したい場合 */}
      {message && !isPending && <p className="text-xs text-red-500 mt-1">{message}</p>}
    </>
  );
}