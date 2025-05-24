import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getBookings() {
  const bookings = await prisma.booking.findMany({
    // ★ここを修正しました！★
    orderBy: [
      { bookingDate: 'asc' },
      { bookingTime: 'asc' },
    ],
  });
  return bookings;
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
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
  );
}