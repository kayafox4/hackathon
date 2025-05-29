// src/app/layout.js
import './globals.css';
import { Inter, EB_Garamond } from 'next/font/google';
import NextAuthProvider from '@/app/providers/NextAuth'; // パスが正しければOK
import NavigationBar from '@/app/components/NavigationBar'; // NavigationBarをインポート

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const ebGaramond = EB_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

export const metadata = {
  title: 'バス予約アプリ',
  description: 'Next.jsとNextAuth.jsによるバス予約アプリ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${inter.variable} ${ebGaramond.variable}`}>
      <body className="flex flex-col min-h-screen"> {/* bodyをflexコンテナに */}
        <NextAuthProvider>
          {/* メインコンテンツエリア */}
          <main className="flex-grow pb-16 sm:pb-20"> {/* flex-growでコンテンツを押し広げ、ナビゲーションバーの高さ分のパディングを追加 */}
            {children}
          </main>
          {/* ナビゲーションバーをNextAuthProviderの内側、mainの外側に配置 */}
          <NavigationBar />
        </NextAuthProvider>
      </body>
    </html>
  );
}