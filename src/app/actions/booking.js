// src/app/actions/booking.js (修正・統合版)
"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// 予約を作成するServer Action
export async function createBooking(formData) {
  const bookingNumber = formData.get('bookingNumber');
  const email = formData.get('email');
  const departureBusStop = formData.get('departureBusStop');
  const arrivalBusStop = formData.get('arrivalBusStop');
  const bookingDate = formData.get('bookingDate');
  const bookingTime = formData.get('bookingTime');
  const type = formData.get('type'); // 'PERSON' または 'LUGGAGE'

  // 簡易的なバリデーション
  if (!bookingNumber || !email || !departureBusStop || !arrivalBusStop || !bookingDate || !bookingTime || !type) {
    return { success: false, message: '全ての項目を入力してください。' };
  }

  // Enumの値が正しいかチェック (簡易的)
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
        bookingDate: new Date(bookingDate), // 日付形式に変換
        bookingTime,
        type: type, // Enumの値を直接渡す (PrismaがBookingTypeにマッピング)
      },
    });
    // 予約ページが一覧を表示する場合や、他の場所で一覧を更新する必要がある場合
    revalidatePath('/bookings'); 
    revalidatePath('/history'); // 履歴ページも再検証して新しい予約が反映されるように
    return { success: true, booking: newBooking };
  } catch (error) {
    console.error("予約作成エラー:", error);
    if (error.code === 'P2002') { // unique制約違反 (bookingNumberの重複)
      return { success: false, message: 'この予約番号は既に存在します。別の番号をお試しください。' };
    }
    return { success: false, message: '予約作成に失敗しました。' };
  }
}

// 全ての予約を取得するServer Action (管理者用などに使えます)
export async function getBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: [
        { bookingDate: 'asc' },
        { bookingTime: 'asc' },
      ],
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

// 予約をキャンセルするServer Action (仮実装)
export async function cancelBookingAction(bookingId) {
  'use server';
  console.log(`Server Action: 予約ID「${bookingId}」のキャンセル処理を実行します。（仮）`);
  
  // 本来はここに Prisma を使ったデータベースからの削除処理などを書きます
  // 例:
  // try {
  //   await prisma.booking.delete({
  //     where: { id: bookingId },
  //   });
  //   revalidatePath('/history'); // 履歴ページを再検証
  //   return { success: true, message: '予約をキャンセルしました。' };
  // } catch (error) {
  //   console.error("予約キャンセルエラー:", error);
  //   return { success: false, message: '予約のキャンセルに失敗しました。' };
  // }

  // 今はまだ実際の処理は書かずに、メッセージだけ返すようにしておきます
  return { success: false, message: 'キャンセル機能は現在開発中ですにゃ！' };
}