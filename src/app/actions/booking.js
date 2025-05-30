// src/app/actions/booking.js
"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next'; // セッション情報を取得するためにインポート
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // NextAuthの設定をインポート

const prisma = new PrismaClient();

// ... (createBooking, getBookings, getUserBookings 関数は変更なし) ...
// (これらの関数がこのファイルに全て定義されていることを確認してください)

export async function createBooking(formData) {
  const bookingNumber = formData.get('bookingNumber');
  const email = formData.get('email');
  const departureBusStop = formData.get('departureBusStop');
  const arrivalBusStop = formData.get('arrivalBusStop');
  const bookingDate = formData.get('bookingDate');
  const bookingTime = formData.get('bookingTime');
  const type = formData.get('type');

  if (!bookingNumber || !email || !departureBusStop || !arrivalBusStop || !bookingDate || !bookingTime || !type) {
    return { success: false, message: '全ての項目を入力してください。' };
  }
  if (type !== 'PERSON' && type !== 'LUGGAGE') {
    return { success: false, message: '予約タイプは「人」または「荷物」を選択してください。' };
  }
  try {
    const newBooking = await prisma.booking.create({
      data: {
        bookingNumber,
        email,
        departureBusStop,
        arrivalBusStop,
        bookingDate: new Date(bookingDate),
        bookingTime,
        type: type,
      },
    });
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

export async function getBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: [ { bookingDate: 'asc' }, { bookingTime: 'asc' } ],
    });
    return { success: true, bookings };
  } catch (error) {
    console.error("全予約取得エラー:", error);
    return { success: false, message: '予約の取得に失敗しました。', bookings: [] };
  }
}

export async function getUserBookings(userEmail) {
  if (!userEmail) {
    return { success: false, message: 'ユーザー情報が取得できませんでした。', bookings: [] };
  }
  try {
    const bookings = await prisma.booking.findMany({
      where: { email: userEmail },
      orderBy: [ { bookingDate: 'desc' }, { bookingTime: 'desc' } ],
    });
    return { success: true, bookings: bookings };
  } catch (error) {
    console.error("ユーザーの予約取得エラー:", error);
    return { success: false, message: '予約履歴の取得に失敗しました。', bookings: [] };
  }
}


// --- ↓↓↓ 予約をキャンセルするServer Action (実装) ↓↓↓ ---
export async function cancelBookingAction(bookingId) {
  'use server';

  if (!bookingId) {
    return { success: false, message: '予約IDが指定されていません。' };
  }

  // 現在のログインユーザー情報を取得
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return { success: false, message: '認証されていません。ログインしてください。' };
  }

  try {
    // 念のため、削除しようとしている予約が本当にこのユーザーのものか確認
    const bookingToCancel = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!bookingToCancel) {
      return { success: false, message: 'キャンセル対象の予約が見つかりませんでした。' };
    }

    // 予約の持ち主と現在のユーザーが一致するか確認
    if (bookingToCancel.email !== session.user.email) {
      // ここで管理者権限チェックなどを追加することも可能
      return { success: false, message: 'この予約をキャンセルする権限がありません。' };
    }

    // データベースから予約を削除
    await prisma.booking.delete({
      where: {
        id: bookingId,
        email: session.user.email, // さらに絞り込み (念のため)
      },
    });

    revalidatePath('/history'); // 履歴ページを再検証して表示を更新
    return { success: true, message: '予約をキャンセルしました。' };

  } catch (error) {
    console.error("予約キャンセルエラー:", error);
    // @ts-ignore
    if (error.code === 'P2025') { // Record to delete does not exist.
        return { success: false, message: 'キャンセル対象の予約が見つからないか、既に削除されています。'}
    }
    return { success: false, message: '予約のキャンセル中にエラーが発生しました。' };
  }
}