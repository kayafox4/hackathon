// src/app/map/page.jsx
import MapDisplay from '@/app/components/MapDisplay'; // 作成したMapDisplayコンポーネントをインポート

export default function MapPage() {
  return (
    // layout.js の main に padding があれば、ここの pt は調整または削除
    <div className="flex flex-col items-center p-3 sm:p-4 md:p-6 space-y-6"> 
      <h1 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 text-center mt-4 sm:mt-0">
        周辺マップ
      </h1>
      
      <div className="w-full max-w-5xl mx-auto"> {/* マップの表示エリアの幅を制御 */}
        <MapDisplay />
      </div>

      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
        （地図が表示されない場合は、APIキーの設定やブラウザの位置情報の許可を確認してくださいにゃん。）
      </p>
    </div>
  );
}