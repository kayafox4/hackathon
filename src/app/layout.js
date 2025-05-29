// src/app/layout.jsx
import './globals.css';
import NavigationBar from './components/NavigationBar';
// ここを修正: ファイル拡張子 .jsx を追加
import NextAuthProvider from './providers/NextAuth.jsx'; // 👈 ここを .jsx に変更

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <NextAuthProvider>
          <main className="min-h-screen pb-20">
            {children}
          </main>
          <NavigationBar />
        </NextAuthProvider>
      </body>
    </html>
  );
}