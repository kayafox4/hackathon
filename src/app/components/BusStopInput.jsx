// src/app/components/BusStopInput.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import busStops from '@/lib/busStops'; // バス停リストをインポート

export default function BusStopInput({ label, value, onChange, placeholder = '' }) {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setInputValue(value || ''); // 親コンポーネントからの値変更を同期
  }, [value]);

  // 入力値が変更されたときの処理
  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue); // 親コンポーネントに値を伝える

    if (newValue.length > 0) {
      const filteredSuggestions = busStops.filter(stop =>
        stop.includes(newValue) // 入力された単語を含むバス停をフィルタリング
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 予測変換リストから選択されたときの処理
  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion); // 親コンポーネントに選択された値を伝える
    setSuggestions([]); // 予測変換リストを非表示にする
    setShowSuggestions(false);
  };

  // 入力フィールド以外をクリックしたら予測変換リストを非表示にする
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full mb-4">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={label}
        type="text"
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => { // フォーカスが当たった時もサジェストを表示する
            if (inputValue.length > 0) {
                const filteredSuggestions = busStops.filter(stop =>
                    stop.includes(inputValue)
                );
                setSuggestions(filteredSuggestions);
                setShowSuggestions(true);
            }
        }}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        autoComplete="off" // ブラウザのオートコンプリートを無効化
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="p-2 cursor-pointer hover:bg-green-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}