// src/app/actions/booking.js (完全版)
"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // NextAuthの設定をインポート

const prisma = new PrismaClient();

// 予約を作成するServer Action
export async function createBooking(formData) {
  const bookingNumber = formData.get('bookingNumber');
  const email = formData.get('email'); // 予約者のメール (通知の対象者)
  const departureBusStop = formData.get('departureBusStop');
  const arrivalBusStop = formData.get('arrivalBusStop');
  const bookingDate = formData.get('bookingDate'); // "YYYY-MM-DD" 形式の文字列
  const bookingTime = formData.get('bookingTime'); // "HH:MM" 形式の文字列
  const typeFromForm = formData.get('type'); // 'PERSON' または 'LUGGAGE'
  const luggageOptionsRaw = formData.get('luggageOptions');
  const luggageOptions = luggageOptionsRaw ? JSON.parse(luggageOptionsRaw) : null;

  if (!bookingNumber || !email || !departureBusStop || !arrivalBusStop || !bookingDate || !bookingTime || !typeFromForm) {
    return { success: false, message: '全ての項目を入力してください。' };
  }

  if (typeFromForm !== 'PERSON' && typeFromForm !== 'LUGGAGE') {
    return { success: false, message: '予約タイプは「人」または「荷物」を選択してください。' };
  }

  try {
    const bookingDateObj = new Date(bookingDate);

    const year = bookingDateObj.getFullYear();
    const month = String(bookingDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(bookingDateObj.getDate()).padStart(2, '0');
    const formattedDateForMessage = `${year}年${month}月${day}日`;
    const typeForMessage = typeFromForm === 'PERSON' ? '人' : '荷物';

    const newBooking = await prisma.booking.create({
      data: {
        bookingNumber,
        email,
        departureBusStop,
        arrivalBusStop,
        bookingDate: bookingDateObj,
        bookingTime,
        type: typeFromForm,
        luggageOptions: typeFromForm === 'LUGGAGE' ? luggageOptions : null,
      },
    });

    if (newBooking) {
      try {
        const notificationMessage = `${formattedDateForMessage} ${bookingTime}に 発：${departureBusStop}、着：${arrivalBusStop}、タイプ：${typeForMessage}の予約が入りました`;
        const newNotification = await prisma.notification.create({
          data: {
            userEmail: newBooking.email,
            message: notificationMessage,
            link: `/history#booking-${newBooking.id}`,
            bookingId: newBooking.id,
          },
        });
        console.log('[アクション:createBooking] 通知が作成されました:', newNotification);
      } catch (notificationError) {
        console.error("[アクション:createBooking] 通知の作成に失敗しました:", notificationError);
      }
    }

    revalidatePath('/bookings'); 
    revalidatePath('/history');
    return { success: true, booking: newBooking };
  } catch (error) {
    console.error("予約作成エラー:", error);
    if (error.code === 'P2002') {
      return { success: false, message: 'この予約番号は既に存在します。別の番号をお試しください。' };
    }
    return { success: false, message: '予約作成に失敗しました。' };
  }
}

// 今後の予約のみ取得し、日時順で最大10件返す
export async function getBookings() {
  const prisma = new PrismaClient();
  try {
    const now = new Date();
    // bookingDate, bookingTimeで昇順、今日以降のみ、最大10件
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { bookingDate: { gt: now } },
          {
            bookingDate: { equals: now.toISOString().slice(0, 10) },
            bookingTime: { gte: now.toTimeString().slice(0, 5) }
          }
        ]
      },
      orderBy: [
        { bookingDate: 'asc' },
        { bookingTime: 'asc' }
      ],
      take: 10,
    });
    return { success: true, bookings };
  } catch (error) {
    console.error("全予約取得エラー:", error);
    return { success: false, message: '予約の取得に失敗しました。', bookings: [] };
  }
}

// 特定のユーザーの予約を取得するServer Action (履歴ページ用)
export async function getUserBookings(userEmail) {
  if (!userEmail) {
    // この関数を呼び出す側(HistoryPage)で既にsession.user.emailの存在確認をしているので、
    // ここで null/undefined になるケースは少ないはずですが、念のため。
    console.error("[アクション:getUserBookings] userEmailが提供されませんでした。");
    return { success: false, message: 'ユーザー情報が取得できませんでした。', bookings: [] };
  }
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        email: userEmail,
      },
      orderBy: [
        { bookingDate: 'desc' },
        { bookingTime: 'desc' },
      ],
    });
    return { success: true, bookings: bookings };
  } catch (error) {
    console.error("ユーザーの予約取得エラー:", error);
    return { success: false, message: '予約履歴の取得に失敗しました。', bookings: [] };
  }
}

// 予約をキャンセルするServer Action
export async function cancelBookingAction(bookingId) {
  'use server';

  if (!bookingId) {
    return { success: false, message: '予約IDが指定されていません。' };
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return { success: false, message: '認証されていません。ログインしてください。' };
  }

  try {
    const bookingToCancel = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!bookingToCancel) {
      return { success: false, message: 'キャンセル対象の予約が見つかりませんでした。' };
    }

    if (bookingToCancel.email !== session.user.email) {
      return { success: false, message: 'この予約をキャンセルする権限がありません。' };
    }

    await prisma.booking.delete({
      where: {
        id: bookingId,
        email: session.user.email, 
      },
    });

    revalidatePath('/history');
    return { success: true, message: '予約をキャンセルしました。' };

  } catch (error) {
    console.error("予約キャンセルエラー:", error);
    // @ts-ignore
    if (error.code === 'P2025') {
        return { success: false, message: 'キャンセル対象の予約が見つからないか、既に削除されています。'}
    }
    return { success: false, message: '予約のキャンセル中にエラーが発生しました。' };
  }
}