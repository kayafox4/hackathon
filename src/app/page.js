'use client'; // Client Component

import { useSession } from 'next-auth/react';
import Login from './components/Login';
import NavigationBar from './components/NavigationBar';
import AuthStatus from './components/AuthStatus';
import { useEffect, useState } from 'react';
import busStops from '@/lib/busStops';
import { getBookings } from './actions/booking';

// 日付と時間を日本語でフォーマット
function formatBookingDateTime(dateString, timeString) {
  const date = new Date(dateString + 'T' + (timeString || '00:00'));
  return `${date.getMonth() + 1}月${date.getDate()}日 ${timeString}`;
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

  // 予約データを取得
  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(true);
      getBookings()
        .then(result => {
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
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow flex flex-col"
                      >
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
      </main>
      <NavigationBar />
    </div>
  );
}