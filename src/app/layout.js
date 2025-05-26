import './globals.css'; // グローバルCSSをインポート

export const metadata = {
  title: 'バス予約アプリ',
  description: 'Next.js App Routerを使ったバス予約機能',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}