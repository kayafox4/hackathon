// src/app/components/MapDisplay.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const MapDisplay = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [mapError, setMapError] = useState(null);

  // デフォルトのセンター (例: 大津市役所)
  const defaultCenter = {
    lat: 35.0130, // 大津市役所の緯度
    lng: 135.8625 // 大津市役所の経度
  };

  const mapContainerStyle = {
    width: '100%',
    height: '70vh', // 地図の高さ (画面の高さの70%)
    minHeight: '400px', // 最低でも400pxの高さ
    borderRadius: '0.5rem', // 角丸
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // 影
  };

  // ユーザーの現在位置を取得する関数
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMapError(null); // エラーメッセージをクリア
        },
        (error) => {
          console.warn("位置情報の取得エラー:", error.message);
          setMapError(`位置情報を取得できませんでした (エラーコード: ${error.code})。\nデフォルトの地点（大津市役所付近）を表示します。`);
          setCurrentPosition(defaultCenter); // エラー時はデフォルト地点に設定
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // 取得オプション
      );
    } else {
      setMapError("お使いのブラウザは位置情報機能に対応していません。\nデフォルトの地点（大津市役所付近）を表示します。");
      setCurrentPosition(defaultCenter); // 対応していない場合もデフォルト地点に設定
    }
  }, [defaultCenter]); // defaultCenter が変わらない限り再生成しない

  // コンポーネントが読み込まれたときに一度だけ現在位置を取得
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const apiKey = process.env.NEXT_PUBLIC_Maps_API_KEY;

  if (!apiKey) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">
        Google Maps APIキーが設定されていません。環境変数を確認してください。
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={['places']} // placesライブラリも読み込んでおくと、将来的に場所検索などで便利です
    >
      {mapError && (
        <p className="text-orange-600 bg-orange-100 p-3 rounded-md text-center mb-3 text-sm whitespace-pre-line">
          {mapError}
        </p>
      )}
      {currentPosition ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentPosition}
          zoom={15} // ズームレベル
          options={{ // 地図のオプション設定
            streetViewControl: false, // ストリートビューのコントロールを非表示 (任意)
            mapTypeControl: false,    // マップタイプ (航空写真など) のコントロールを非表示 (任意)
            fullscreenControl: true,  // フルスクリーンボタンを表示 (任意)
            zoomControl: true,        // ズームコントロールを表示 (任意)
          }}
        >
          {/* 現在地 (またはデフォルト地点) にマーカーを立てる */}
          <MarkerF 
            position={currentPosition} 
            title={mapError && mapError.includes("デフォルト地点") ? "大津市役所付近" : "あなたの現在地 (またはその周辺)"} 
          />
          {/* 例: 他のマーカーを追加する場合 */}
          {/* <MarkerF position={{ lat: 35.0030, lng: 135.8600 }} title="浜大津" /> */}
        </GoogleMap>
      ) : (
        <div className="flex items-center justify-center text-lg text-gray-600 dark:text-gray-400" style={mapContainerStyle}>
          地図を読み込み中か、位置情報を取得中です...
        </div>
      )}
    </LoadScript>
  );
};

export default MapDisplay;