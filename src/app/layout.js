// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import NextAuthProvider from '@/app/providers/NextAuth'; // 実際のパスを確認してください
import NavigationBar from '@/app/components/NavigationBar'; // 実際のパスを確認してください

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'バス予約アプリ',
  description: 'Next.jsとNextAuth.jsによるバス予約アプリ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900"> {/* 全体の背景色をここで指定 */}
        <NextAuthProvider>
          <main className="flex-grow pt-4 pb-20 sm:pb-24 px-2 sm:px-4"> {/* 上下にパディング、下はナビゲーションバーの分 */}
            {children}
          </main>
          <NavigationBar />
        </NextAuthProvider>
      </body>
    </html>
  );
}