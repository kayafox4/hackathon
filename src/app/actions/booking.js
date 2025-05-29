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
        type: type, // Enumの値を直接渡す
      },
    });
    revalidatePath('/bookings'); // 予約一覧ページを再検証
    return { success: true, booking: newBooking };
  } catch (error) {
    console.error("予約作成エラー:", error);
    // PrismaのエラーコードP2002はunique制約違反 (bookingNumberの重複)
    if (error.code === 'P2002') {
      return { success: false, message: 'この予約番号は既に存在します。別の番号をお試しください。' };
    }
    return { success: false, message: '予約作成に失敗しました。' };
  }
}

// 全ての予約を取得するServer Action
export async function getBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: [ // ← オブジェクトの配列形式に修正
        { bookingDate: 'asc' },
        { bookingTime: 'asc' },
      ],
    });
    return { success: true, bookings };
  } catch (error) {
    console.error("予約取得エラー:", error); // エラーログはここから出力されています
    return { success: false, message: '予約の取得に失敗しました。' };
  }
}