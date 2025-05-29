// src/app/components/CancelBookingButton.jsx
'use client';

export default function CancelBookingButton({ bookingId }) {
  const handleCancel = () => {
    // 将来的にはここでサーバーアクションを呼び出してキャンセル処理を行う
    alert(`予約ID「${bookingId}」のキャンセル機能は、まだ準備中にゃ！👷`);
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      className="w-full sm:w-auto mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out"
    >
      キャンセル
    </button>
  );
}