'use client'; // Client Component

import { useSession } from 'next-auth/react';
import Login from './components/Login';
import NavigationBar from './components/NavigationBar';
import AuthStatus from './components/AuthStatus';
import { useEffect, useState } from 'react';
import busStops from '@/lib/busStops';
import { getBookings, createBooking } from './actions/booking';
import React from 'react';

// 日付と時間を日本語でフォーマット
function formatBookingDateTime(dateString, timeString) {
  // dateStringがDate型の場合も考慮
  let date;
  if (typeof dateString === 'string') {
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'T00:00:00');
    }
  } else if (dateString instanceof Date) {
    date = dateString;
  } else {
    return '';
  }
  // 日本時間に変換
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const month = jstDate.getMonth() + 1;
  const day = jstDate.getDate();
  return `${month}月${day}日 ${timeString}`;
}

// 予約タイプアイコン
function BookingTypeIcon({ type }) {
  if (type === 'PERSON') return <span title="人" className="mr-1">🧑</span>;
  if (type === 'LUGGAGE') return <span title="荷物" className="mr-1">🧳</span>;
  return null;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rideType, setRideType] = useState('PERSON');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  // 予約データを取得
  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(true);
      getBookings()
        .then(result => {
          console.log('取得した予約:', result);
          setAllBookings(result.bookings || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  // バス停ごとに直近の出発予定をまとめる
  const upcomingDepartures = busStops.map(stop => {
    const now = new Date();
    const futureBookings = allBookings.filter(
      b =>
        b.departureBusStop === stop &&
        new Date(`${b.bookingDate}T${b.bookingTime}`) > now
    );
    futureBookings.sort(
      (a, b) =>
        new Date(`${a.bookingDate}T${a.bookingTime}`) -
        new Date(`${b.bookingDate}T${b.bookingTime}`)
    );
    return {
      stop,
      nextBooking: futureBookings[0] || null,
    };
  });

  // 予約作成
  async function handleRideShareBooking() {
    setBookingLoading(true);
    setBookingMessage('');
    const formData = new FormData();
    formData.append('bookingNumber', `RS-${Math.random().toString(36).slice(2, 10)}`);
    formData.append('email', session.user.email);
    formData.append('departureBusStop', selectedBooking.departureBusStop);
    formData.append('arrivalBusStop', selectedBooking.arrivalBusStop);
    formData.append('bookingDate', selectedBooking.bookingDate);
    formData.append('bookingTime', selectedBooking.bookingTime);
    formData.append('type', rideType);
    // 荷物の場合は空配列
    if (rideType === 'LUGGAGE') {
      formData.append('luggageOptions', JSON.stringify([]));
    }
    try {
      const result = await createBooking(formData); // ここを修正
      if (result.success) {
        setBookingMessage('予約が完了しました！');
      } else {
        setBookingMessage(result.message || '予約に失敗しました');
      }
    } catch (e) {
      setBookingMessage('エラーが発生しました');
    }
    setBookingLoading(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        {status === 'loading' && <div>セッションを読み込み中...</div>}
        {status === 'authenticated' ? (
          <div className="w-full max-w-2xl mx-auto">
            <AuthStatus />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">
                今後の予約一覧
              </h2>
              {loading ? (
                <div>読み込み中...</div>
              ) : (
                <div className="grid gap-4">
                  {allBookings.length > 0 ? (
                    allBookings.map(booking => (
                      <div
                        key={booking.id}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <div className="flex items-center mb-2">
                            <BookingTypeIcon type={booking.type} />
                            <span className="text-lg font-semibold">
                              {formatBookingDateTime(booking.bookingDate, booking.bookingTime)}
                            </span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300">
                            出発: {booking.departureBusStop} → 到着: {booking.arrivalBusStop}
                          </div>
                        </div>
                        <div className="flex items-center mt-4 sm:mt-0 sm:ml-4">
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowModal(true);
                              setRideType('PERSON');
                              setBookingMessage('');
                            }}
                          >
                            相乗り
                          </button>
                          {/* カウント表示 */}
                          <span className="ml-3 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-bold text-gray-700 dark:text-gray-200">
                            {booking.count}人
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      現在、今後の予約はありません
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="text-center">
              <a
                href="/bookings"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-md font-semibold shadow hover:bg-green-700 transition"
              >
                バスを予約する
              </a>
            </div>
          </div>
        ) : (
          <Login />
        )}
        {/* モーダル */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h3 className="text-lg font-bold mb-4">相乗り予約内容の確認</h3>
              <div className="mb-2">
                <span className="font-semibold">日時：</span>
                {formatBookingDateTime(selectedBooking.bookingDate, selectedBooking.bookingTime)}
              </div>
              <div className="mb-2">
                <span className="font-semibold">出発：</span>{selectedBooking.departureBusStop}
              </div>
              <div className="mb-2">
                <span className="font-semibold">到着：</span>{selectedBooking.arrivalBusStop}
              </div>
              <div className="mb-2">
                <span className="font-semibold">料金：</span>
                {rideType === 'PERSON' ? '500円' : '300円'}
              </div>
              <div className="flex gap-2 mb-4">
                <button
                  className={`flex-1 py-2 rounded-md font-semibold ${rideType === 'PERSON' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setRideType('PERSON')}
                >
                  人
                </button>
                <button
                  className={`flex-1 py-2 rounded-md font-semibold ${rideType === 'LUGGAGE' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setRideType('LUGGAGE')}
                >
                  荷物
                </button>
              </div>
              <button
                className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                onClick={handleRideShareBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? '予約中...' : 'この内容で相乗り予約する'}
              </button>
              {bookingMessage && (
                <div className="mt-3 text-center text-green-600 font-semibold">{bookingMessage}</div>
              )}
            </div>
          </div>
        )}
      </main>
      <NavigationBar />
    </div>
  );
}