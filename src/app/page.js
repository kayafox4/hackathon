'use client'; // Client Component

import { useSession, signIn } from 'next-auth/react';
import Login from './components/Login';
import NavigationBar from './components/NavigationBar';
import AuthStatus from './components/AuthStatus';
import { useEffect, useState } from 'react';
import busStops from '@/lib/busStops';
import { getBookings, createBooking } from './actions/booking';
import React from 'react';
import { FaUser, FaSuitcase, FaBus, FaSmile, FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa';
import Image from 'next/image';

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
  const style = { color: '#666', marginRight: '0.25rem', fontSize: '1.2em', verticalAlign: 'middle' };
  if (type === 'PERSON') {
    return <FaUser title="人" style={style} />;
  }
  if (type === 'LUGGAGE') {
    return <FaSuitcase title="荷物" style={style} />;
  }
  return null;
}

// 4桁のランダムな数字を生成
function generateBookingNumber() {
  return Math.floor(1000 + Math.random() * 9000).toString();
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
  const [showBookingNumberModal, setShowBookingNumberModal] = useState(false);
  const [lastBookingNumber, setLastBookingNumber] = useState('');

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
    formData.append('bookingNumber', generateBookingNumber()); // ←ここを修正
    formData.append('email', session.user.email);
    formData.append('departureBusStop', selectedBooking.departureBusStop);
    formData.append('arrivalBusStop', selectedBooking.arrivalBusStop);
    formData.append('bookingDate', selectedBooking.bookingDate);
    formData.append('bookingTime', selectedBooking.bookingTime);
    formData.append('type', rideType);
    if (rideType === 'LUGGAGE') {
      formData.append('luggageOptions', JSON.stringify([]));
    }
    try {
      const result = await createBooking(formData);
      if (result.success && result.booking) {
        setLastBookingNumber(result.booking.bookingNumber);
        setShowBookingNumberModal(true);
        setBookingMessage('予約が完了しました！');
      } else {
        setBookingMessage(result.message || '予約に失敗しました');
      }
    } catch (e) {
      setBookingMessage('エラーが発生しました');
    } finally {
      setBookingLoading(false);
    }
  }

  // ログインしていない場合の広告風パネル
  if (status !== 'authenticated') {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center p-4 space-y-6">
          {/* BIWAKOバス画像をAppBarの下・1つ目のパネルの上に表示 */}
          <div className="w-full max-w-xl mb-4">
            <Image
              src="/bus.jpg" // publicフォルダに保存した場合のパス
              alt="BIWAKOバス"
              width={1200}
              height={650}
              className="rounded-xl w-full object-cover"
              priority
            />
          </div>
          {/* 1つ目のパネル */}
          <div className="w-full max-w-xl flex items-center justify-between bg-green-900 rounded-2xl p-6 shadow-lg min-h-[110px]">
            <div>
              <div className="text-xs text-green-200 mb-1 tracking-widest">hakobune app</div>
              <div className="text-white text-sm font-semibold leading-relaxed">
                いつでも気軽にバスに乗ろう。<br />
                ハコブネで人だけでなく荷物も。
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <FaBus className="text-white text-4xl" />
              <FaSmile className="text-yellow-300 text-4xl" />
            </div>
          </div>
          {/* 2つ目のパネル */}
          <div className="w-full max-w-xl flex items-center justify-between bg-[#4E342E] rounded-2xl p-6 shadow-lg min-h-[90px]">
            <div>
              <div className="text-xs text-green-200 mb-1 tracking-widest">MOBILE booking & pay</div>
              <div className="text-white text-base font-semibold leading-relaxed">
                アプリで予約・お支払い
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <FaMobileAlt className="text-white text-3xl" />
              <FaMoneyBillWave className="text-green-300 text-3xl" />
            </div>
          </div>
          {/* Googleでログインボタン（中央寄せ） */}
          <div className="w-full flex justify-center mt-6">
            <Login />
          </div>
        </main>
        <NavigationBar />
      </div>
    );
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
        {/* 予約完了モーダル */}
        {showBookingNumberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-xs relative text-center">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowBookingNumberModal(false)}
              >
                ×
              </button>
              <div className="text-lg font-bold mb-2">予約が完了しました！</div>
              <div className="text-2xl font-bold text-green-700 mb-4">
                予約番号 {lastBookingNumber}
              </div>
              <div className="text-sm text-gray-600">この番号を控えておいてください。</div>
            </div>
          </div>
        )}
      </main>
      <NavigationBar />
    </div>
  );
}