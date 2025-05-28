// src/app/bookings/page.jsx

'use client'; // Client Component に変更 (usePathname などを使用する場合)

import { PrismaClient } from '@prisma/client';
import NavigationBar from '../components/NavigationBar'; // ナビゲーションバーをインポート

// PrismaClient のインスタンスは、本番環境ではグローバルなシングルトンとして扱うのがベストプラクティスです。
// 開発中は問題ありませんが、デプロイ時に警告が出ることがあります。
// 詳細は Prisma 公式ドキュメントの「Best practices for instantiating PrismaClient」を参照してください。
const prisma = new PrismaClient();

async function getBookings() {
  // これは Server Component の中で呼び出されるべきです。
  // 'use client' を追加したため、この関数はクライアントサイドで呼び出されることになります。
  // Next.jsのApp Routerでは、データフェッチはServer Componentで行うのが推奨です。
  // ここをクライアントサイドでフェッチすると、APIルート（/api/bookingsなど）を別途用意してFetch APIで呼び出す必要があります。
  // 現状は、ビルド時のPrerenderingでデータが取得されますが、実行時にも必要なら工夫が必要です。
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: [
        { bookingDate: 'asc' },
        { bookingTime: 'asc' },
      ],
    });
    return bookings;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return []; // エラー時は空の配列を返す
  } finally {
    await prisma.$disconnect(); // 接続を閉じる (Vercel Lambdaには推奨)
  }
}

export default async function BookingsPage() {
  const bookings = await getBookings(); // ビルド時に実行される

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