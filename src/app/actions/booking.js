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
  const bookingDate = formData.get('bookingDate'); // "YYYY-MM-DD" 形式の文字列
  const bookingTime = formData.get('bookingTime'); // "HH:MM" 形式の文字列
  const typeFromForm = formData.get('type'); // 'PERSON' または 'LUGGAGE'

  if (!bookingNumber || !email || !departureBusStop || !arrivalBusStop || !bookingDate || !bookingTime || !typeFromForm) {
    return { success: false, message: '全ての項目を入力してください。' };
  }

  if (typeFromForm !== 'PERSON' && typeFromForm !== 'LUGGAGE') {
    return { success: false, message: '予約タイプは「人」または「荷物」を選択してください。' };
  }

  try {
    const bookingDateObj = new Date(bookingDate); // YYYY-MM-DD 文字列をDateオブジェクトに

    // --- ↓↓↓ 通知メッセージ用の情報を準備 ↓↓↓ ---
    const year = bookingDateObj.getFullYear();
    const month = String(bookingDateObj.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので+1
    const day = String(bookingDateObj.getDate()).padStart(2, '0');
    const formattedDateForMessage = `${year}年${month}月${day}日`;

    const typeForMessage = typeFromForm === 'PERSON' ? '人' : '荷物';
    // --- ↑↑↑ 通知メッセージ用の情報を準備 ここまで ↑↑↑ ---

    const newBooking = await prisma.booking.create({
      data: {
        bookingNumber,
        email,
        departureBusStop,
        arrivalBusStop,
        bookingDate: bookingDateObj, // DBにはDateオブジェクトで保存
        bookingTime,
        type: typeFromForm,
      },
    });

    if (newBooking) {
      try {
        // --- ↓↓↓ 通知メッセージの作成方法を変更 ↓↓↓ ---
        const notificationMessage = `${formattedDateForMessage} ${bookingTime}に 発：${departureBusStop}、着：${arrivalBusStop}、タイプ：${typeForMessage}の予約が入りました`;
        // --- ↑↑↑ 通知メッセージの作成方法を変更 ↑↑↑ ---

        const newNotification = await prisma.notification.create({
          data: {
            userEmail: newBooking.email,
            message: notificationMessage, // ★作成したメッセージを使用
            link: `/history#booking-${newBooking.id}`, // 例: 履歴ページ内の該当予約へのリンク
            bookingId: newBooking.id,
            // isRead: false はデフォルトで設定される
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

// ... (getBookings, getUserBookings, cancelBookingAction 関数はそのまま) ...