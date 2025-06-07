// src/app/history/page.jsx (または .js)
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // ステップ2でエクスポートしたものをインポート
import { getUserBookings } from '@/app/actions/booking';      // ステップ1で作成した関数をインポート
import NavigationBar from '@/app/components/NavigationBar';
import CancelBookingButton from '@/app/components/CancelBookingButton'; // ステップ3で作成したボタンをインポート
import Link from 'next/link'; // ログインしていないユーザー向け

// 日付と時間を指定の形式にフォーマットするヘルパー関数
function formatBookingDateTime(dateString, timeString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  // getMonth() は 0 から始まるので +1 する
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日 ${timeString}`;
}

// 荷物ラベルの対応表
const luggageLabels = [
  { value: 'fragile', label: 'こわれもの' },
  { value: 'perishable', label: 'なまもの' },
  { value: 'breakable', label: 'われもの' },
  { value: 'upside_down_ng', label: '逆さま厳禁' },
  { value: 'other', label: 'その他' },
];

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-white dark:bg-gray-800">
        <main className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">予約履歴</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            予約履歴をご覧になるには、ログインが必要です。
          </p>
          <Link
            href="/api/auth/signin" // NextAuthのデフォルトサインインページへ
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
          >
            ログインする
          </Link>
        </main>
        <div className="mt-auto w-full pt-4">
          <NavigationBar />
        </div>
      </div>
    );
  }

  const { bookings, success, message } = await getUserBookings(session.user.email);

  return (
    <div className="flex flex-col min-h-screen items-center px-2 sm:px-4 py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-700 dark:text-green-400">
        あなたの予約履歴
      </h1>

      {success && bookings.length > 0 ? (
        <div className="w-full max-w-xl space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                {formatBookingDateTime(booking.bookingDate, booking.bookingTime)}
              </p>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-4">
                <p>
                  <span className="font-medium">出発バス停：</span>
                  {booking.departureBusStop}
                </p>
                <p>
                  <span className="font-medium">到着バス停：</span>
                  {booking.arrivalBusStop}
                </p>
                <p>
                  <span className="font-medium">タイプ：</span>
                  {booking.type === 'PERSON' ? '人' : booking.type === 'LUGGAGE' ? '荷物' : '不明'}
                </p>
                {/* 荷物の種類を表示 */}
                {booking.type === 'LUGGAGE' && Array.isArray(booking.luggageOptions) && booking.luggageOptions.length > 0 && (
                  <p>
                    <span className="font-medium">荷物の種類：</span>
                    {booking.luggageOptions
                      .map(opt => luggageLabels.find(l => l.value === opt)?.label || opt)
                      .join('、')}
                  </p>
                )}
              </div>
              <CancelBookingButton bookingId={booking.id} />
            </div>
          ))}
        </div>
      ) : success && bookings.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-md shadow">
          まだ予約履歴はありません。
        </p>
      ) : (
        <p className="text-center text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 p-4 rounded-md shadow">
          {message || '予約履歴の読み込みに失敗しました。'}
        </p>
      )}
      <div className="mt-auto w-full pt-4">
        <NavigationBar />
      </div>
    </div>
  );
}