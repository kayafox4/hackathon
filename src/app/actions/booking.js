// src/app/actions/booking.js
"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

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

export async function cancelBookingAction(bookingId) {
  'use server';
  console.log(`Server Action: 予約ID「${bookingId}」のキャンセル処理を実行します。（仮）`);
  return { success: false, message: 'キャンセル機能は現在開発中ですにゃ！' };
}