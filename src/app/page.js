'use client'; // Client Component

import { useSession } from 'next-auth/react';
import Login from './components/Login';
import NavigationBar from './components/NavigationBar';
import { useEffect, useState } from 'react';
import busStops from '@/lib/busStops';

export default function Home() {
  const { data: session, status } = useSession();
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // 予約データを取得
  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(true);
      fetch('/api/all-bookings')
        .then(res => res.json())
        .then(data => {
          setAllBookings(data.bookings || []);
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">
                バス停ごとの直近の出発予定
              </h2>
              {loading ? (
                <div>読み込み中...</div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {upcomingDepartures.map(({ stop, nextBooking }) => (
                    <div key={stop} className="flex items-center justify-between border-b pb-2">
                      <span className="font-semibold">{stop}</span>
                      {nextBooking ? (
                        <span>
                          {nextBooking.bookingDate?.slice(0, 10)} {nextBooking.bookingTime} 発
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">直近の予約なし</span>
                      )}
                    </div>
                  ))}
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