// src/app/layout.js
import './globals.css';
import { Inter, EB_Garamond } from 'next/font/google'; // EB_Garamond を追加
import NextAuthProvider from '@/app/providers/NextAuth';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// アンティーク風フォントの設定
const ebGaramond = EB_Garamond({
  subsets: ['latin', 'latin-ext'], // 必要なサブセット
  weight: ['400', '500', '700'],  // 使用するウェイト
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond', // CSS変数として定義
  display: 'swap',
});

export const metadata = {
  title: 'バス予約アプリ',
  description: 'Next.jsとNextAuth.jsによるバス予約アプリ',
};

export default function RootLayout({ children }) {
  return (
    // ebGaramond.variable を className に追加
    <html lang="ja" className={`${inter.variable} ${ebGaramond.variable}`}>
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}