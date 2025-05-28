// src/app/history/page.jsx

import NavigationBar from '../components/NavigationBar'; // ナビゲーションバーをインポート

export default function HistoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">履歴確認ページ</h1>
        <p>ここに予約履歴を表示します。</p>
        {/* TODO: 予約履歴を表示するロジックをここに追加 */}
      </main>
      <NavigationBar />
    </div>
  );
}