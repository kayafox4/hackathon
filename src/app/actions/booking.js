// src/app/actions/booking.js (完全版)
"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // NextAuthの設定をインポート

const prisma = new PrismaClient();

// 4桁のランダムな数字を生成
function generateBookingNumber() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// 予約を作成するServer Action
export async function createBooking(formData) {
  const bookingNumber = formData.get('bookingNumber') || generateBookingNumber();
  const email = formData.get('email');
  const departureBusStop = formData.get('departureBusStop');
  const arrivalBusStop = formData.get('arrivalBusStop');
  const bookingDate = formData.get('bookingDate');
  const bookingTime = formData.get('bookingTime');
  const typeFromForm = formData.get('type');
  const luggageOptionsRaw = formData.get('luggageOptions');
  const luggageOptions = luggageOptionsRaw ? JSON.parse(luggageOptionsRaw) : null;

  if (!bookingNumber || !email || !departureBusStop || !arrivalBusStop || !bookingDate || !bookingTime || !typeFromForm) {
    return { success: false, message: '全ての項目を入力してください。' };
  }

  if (typeFromForm !== 'PERSON' && typeFromForm !== 'LUGGAGE') {
    return { success: false, message: '予約タイプは「人」または「荷物」を選択してください。' };
  }

  try {
    // 既存便の検索（便のカウント用）
    const existing = await prisma.booking.findFirst({
      where: {
        departureBusStop,
        arrivalBusStop,
        bookingDate: new Date(bookingDate),
        bookingTime,
      },
    });

    if (existing) {
      // 便のカウントをインクリメント
      await prisma.booking.update({
        where: { id: existing.id },
        data: { count: { increment: 1 } },
      });
    }

    // 自分の予約レコードを新規作成（必ず作る）
    const newBooking = await prisma.booking.create({
      data: {
        bookingNumber,
        email,
        departureBusStop,
        arrivalBusStop,
        bookingDate: new Date(bookingDate),
        bookingTime,
        type: typeFromForm,
        luggageOptions: typeFromForm === 'LUGGAGE' ? luggageOptions : null,
        count: 1,
      },
    });

    revalidatePath('/history');
    revalidatePath('/');
    return { success: true, booking: newBooking, message: '予約が完了しました。' };
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
    // すべての予約を便ごとにグループ化して取得
    const bookings = await prisma.booking.groupBy({
      by: ['departureBusStop', 'arrivalBusStop', 'bookingDate', 'bookingTime'],
      _sum: { count: true },
      _min: { id: true, type: true }, // 代表値として最初のid/typeを使う
      orderBy: [
        { bookingDate: 'asc' },
        { bookingTime: 'asc' }
      ],
      take: 10,
    });

    // 表示用に整形
    const result = bookings.map(b => ({
      id: b._min.id,
      departureBusStop: b.departureBusStop,
      arrivalBusStop: b.arrivalBusStop,
      bookingDate: b.bookingDate,
      bookingTime: b.bookingTime,
      type: b._min.type,
      count: b._sum.count,
    }));

    return { success: true, bookings: result };
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
    // 過去・未来すべての予約を取得（フィルタなし）
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