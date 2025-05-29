// src/app/bookings/page.js (修正後)

// 'use client'; を削除

// PrismaClientのインポートとインスタンス化を削除
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

import NavigationBar from '../components/NavigationBar';
import { getBookings as fetchServerBookings } from '../actions/booking'; // Server Actionをインポート

// ローカルのgetBookings関数を削除

export default async function BookingsPage() {
  // Server Actionを呼び出してデータを取得
  const { success, bookings, message } = await fetchServerBookings();

  if (!success) {
    // エラーハンドリング（例: エラーメッセージを表示）
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center p-24">
          <h1 className="text-4xl font-bold mb-8">予約一覧</h1>
          <p>予約情報の読み込みに失敗しました: {message || '不明なエラー'}</p>
        </main>
        <NavigationBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center p-24">
        <h1 className="text-4xl font-bold mb-8">予約一覧</h1>
        {bookings.length === 0 ? (
          <p>まだ予約はありません。</p>
        ) : (
          <ul className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
            {bookings.map((booking) => (
              <li key={booking.id} className="mb-4 p-4 border-b last:border-b-0">
                <p className="text-lg font-semibold">予約番号: {booking.bookingNumber}</p>
                <p>メールアドレス: {booking.email}</p>
                <p>出発バス停: {booking.departureBusStop}</p>
                <p>到着バス停: {booking.arrivalBusStop}</p>
                <p>日時: {new Date(booking.bookingDate).toLocaleDateString()} {booking.bookingTime}</p>
                <p>タイプ: {booking.type === 'PERSON' ? '人' : '荷物'}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
      <NavigationBar />
    </div>
  );
}