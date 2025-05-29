// src/app/layout.js (シンプル版)
import './globals.css';
import { Inter } from 'next/font/google';
import NextAuthProvider from '@/app/providers/NextAuth'; // このパスが実際の場所と合っているか確認
import NavigationBar from '@/app/components/NavigationBar'; // NavigationBarをインポート

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'バス予約アプリ',
  description: 'Next.jsとNextAuth.jsによるバス予約アプリ',
};

export default function RootLayout({ children }) {
  return (
    // アンティーク風フォントのクラス指定を削除 (例: ebGaramond.variable)
    <html lang="ja" className={inter.variable}>
      <body className="flex flex-col min-h-screen"> {/* ナビゲーションバーを固定する場合の一般的な構成 */}
        <NextAuthProvider>
          <main className="flex-grow pb-20"> {/* メインコンテンツ。pb-20 はナビゲーションバーの高さ分の目安 */}
            {children}
          </main>
          <NavigationBar />
        </NextAuthProvider>
      </body>
    </html>
  );
}