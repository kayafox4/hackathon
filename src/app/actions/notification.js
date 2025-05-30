// src/app/actions/notification.js
"use server";

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // NextAuthの設定をインポート
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

/**
 * 未読の通知件数を取得します。
 */
export async function getUnreadNotificationCount() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, count: 0, error: "ユーザーが認証されていません。" };
  }

  try {
    const count = await prisma.notification.count({
      where: {
        userEmail: session.user.email,
        isRead: false,
      },
    });
    return { success: true, count };
  } catch (error) {
    console.error("未読通知件数の取得エラー:", error);
    return { success: false, count: 0, error: "件数の取得に失敗しました。" };
  }
}

/**
 * 通知のリストを取得します。
 * @param {{ limit?: number, includeRead?: boolean }} options - 取得オプション
 */
export async function getNotifications(options = { limit: 7, includeRead: true }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, notifications: [], error: "ユーザーが認証されていません。" };
  }

  try {
    const whereClause = {
      userEmail: session.user.email,
    };
    if (!options.includeRead) {
      // @ts-ignore // TypeScriptではないのでこのコメントは不要かも
      whereClause.isRead = false; // 未読のみ取得する場合
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc', // 新しい順
      },
      take: options.limit, // 表示件数を制限
      // bookingId があれば、関連する予約情報も取得できる (必要なら)
      // include: { booking: true } 
    });
    return { success: true, notifications };
  } catch (error) {
    console.error("通知リストの取得エラー:", error);
    return { success: false, notifications: [], error: "通知の取得に失敗しました。" };
  }
}

/**
 * ユーザーの全ての未読通知を既読にします。
 */
export async function markAllUserNotificationsAsRead() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, error: "ユーザーが認証されていません。" };
  }

  try {
    const result = await prisma.notification.updateMany({
      where: {
        userEmail: session.user.email,
        isRead: false,
      },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    });

    // 関連するページのデータを再検証 (アカウントページなど)
    // 具体的なパスは、通知が表示されているページに合わせてください
    revalidatePath('/test'); // アカウントページが /test の場合
    // revalidatePath('/どこか別の通知表示パス');

    return { success: true, updatedCount: result.count };
  } catch (error) {
    console.error("全通知既読化エラー:", error);
    return { success: false, error: "通知の既読化に失敗しました。" };
  }
}

/**
 * 特定の通知を既読にします (今回は未使用、将来的に個別既読が必要な場合)
 * @param {string} notificationId - 既読にする通知のID
 */
export async function markNotificationAsRead(notificationId) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, error: "ユーザーが認証されていません。" };
  }
  if (!notificationId) {
    return { success: false, error: "通知IDが必要です。" };
  }

  try {
    await prisma.notification.updateMany({ // updateManyでuserEmailも条件に加える
      where: {
        id: notificationId,
        userEmail: session.user.email, // 他のユーザーの通知を間違って更新しないように
        isRead: false,
      },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    });
    revalidatePath('/test'); // アカウントページが /test の場合
    return { success: true };
  } catch (error) {
    console.error(`通知(ID: ${notificationId})の既読化エラー:`, error);
    return { success: false, error: "通知の既読化に失敗しました。" };
  }
}