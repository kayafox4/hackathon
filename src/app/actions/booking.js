// src/app/actions/booking.js
"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache'; // これはキャンセル機能実装時に使うかも

const prisma = new PrismaClient();

// ... (createBooking 関数 と generateBookingNumber 関数はそのまま) ...

// 特定のユーザーの予約を取得するServer Action (履歴ページ用)
export async function getUserBookings(userEmail) {
  if (!userEmail) {
    return { success: false, message: 'ユーザー情報が取得できませんでした。', bookings: [] };
  }
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        email: userEmail, // ユーザーのメールアドレスで絞り込み
      },
      orderBy: [
        { bookingDate: 'desc' }, // 予約日で降順 (新しい順)
        { bookingTime: 'desc' }, // 予約時間で降順
      ],
    });
    return { success: true, bookings: bookings };
  } catch (error) {
    console.error("ユーザーの予約取得エラー:", error);
    return { success: false, message: '予約履歴の取得に失敗しました。', bookings: [] };
  }
}

// (既存の getBookings 関数は、管理者用など、全件取得の用途があれば残してもOKです)