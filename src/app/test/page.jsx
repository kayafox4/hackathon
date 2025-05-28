// src/app/test/page.jsx

import NavigationBar from '../components/NavigationBar'; // ナビゲーションバーをインポート

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow flex flex-col items-center justify-center p-24">
                <h1>テストページ</h1>
                <p>このページはテスト用です。</p>
                <p>Next.jsとNextAuth.jsの統合を確認するためのページです。</p>
                <p>ログイン状態を確認してください。</p>
            </main>
            <NavigationBar />
        </div>
    );
}