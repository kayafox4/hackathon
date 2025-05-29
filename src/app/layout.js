// src/app/layout.jsx
import './globals.css';
import NavigationBar from './components/NavigationBar'; // NavigationBarをインポート
import NextAuthProvider from './providers/NextAuth'; // AuthProviderをインポート (もしあれば)

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {/* NextAuth.jsを使用している場合、AuthProviderで全体を囲む必要があります */}
        <NextAuthProvider>
          {/* メインコンテンツ */}
          <main className="min-h-screen pb-20"> {/* ナビゲーションバーの高さ分だけ下部にパディング */}
            {children}
          </main>
          {/* ナビゲーションバーを最下部に固定表示 */}
          <NavigationBar />
        </NextAuthProvider>
      </body>
    </html>
  );
}