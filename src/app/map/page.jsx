import React from 'react';

export default function MapPage() {
  return (
    <div className="flex flex-col items-center p-3 sm:p-4 md:p-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 text-center mt-4 sm:mt-0">
        周辺マップ
      </h1>

      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition"
  
      >
        近くのバス停を検索
      </button>

      <div className="w-full max-w-2xl h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 mt-4">
        {/* ダミー地図エリア */}
        <span>地図がここに表示されます</span>
      </div>

      <div className="w-full max-w-2xl mt-6">
        <h2 className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-200">周辺のバス停（例）</h2>
        <ul className="space-y-2">
          <li className="bg-white dark:bg-gray-800 rounded p-3 shadow border border-gray-200 dark:border-gray-700">
            滋賀病院前バス停
          </li>
          <li className="bg-white dark:bg-gray-800 rounded p-3 shadow border border-gray-200 dark:border-gray-700">
            瀬田駅バス停
          </li>
          <li className="bg-white dark:bg-gray-800 rounded p-3 shadow border border-gray-200 dark:border-gray-700">
            龍谷大学前バス停
          </li>
        </ul>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
        （地図が表示されない場合は、APIキーの設定やブラウザの位置情報の許可を確認してください。）
      </p>
    </div>
  );
}