'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';

// MapDisplayを動的import（SSR無効化）
const MapDisplay = dynamic(() => import('../components/MapDisplay'), { ssr: false });

export default function MapPage() {
  const mapRef = useRef(null);

  return (
    <div className="flex flex-col items-center p-3 sm:p-4 md:p-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 text-center mt-4 sm:mt-0">
        周辺マップ
      </h1>

      {/* ボタンとマップ */}
      <MapDisplay />

      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
        （地図が表示されない場合は、APIキーの設定やブラウザの位置情報の許可を確認してください。）
      </p>
    </div>
  );
}