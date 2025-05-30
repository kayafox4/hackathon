// src/app/map/page.jsx (新規作成)

// NavigationBar は src/app/layout.js で読み込まれているので、ここでは不要です。

export default function MapPage() {
  return (
    <div className="flex flex-col items-center justify-center p-6 pt-10 md:p-24 text-center"> {/* ptでヘッダーとのスペース調整 */}
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
        マップページ
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        ここはマップを表示するためのページです！🗺️
      </p>
      <p className="text-md text-gray-600 dark:text-gray-400 mt-4">
        （ここにインタラクティブなマップが表示される予定です）
      </p>
      {/* ここにマップ表示ライブラリ（Google Maps API, Leaflet, Mapboxなど）を
        使ったコンポーネントを配置することになります。
      */}
    </div>
  );
}