// src/app/bookings/page.jsx
'use client';

import { useState, useEffect } from 'react'; // useEffect を追加
import BusStopInput from '@/app/components/BusStopInput';

export default function BookingsPage() {
  const [departureBusStop, setDepartureBusStop] = useState('');
  const [arrivalBusStop, setArrivalBusStop] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [passengerType, setPassengerType] = useState('person'); // 'person' (人) または 'item' (物)

  // 日付のオプションを生成する関数
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    // 今日から30日後までの日付を生成
    for (let i = 0; i < 31; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      const value = `${year}-${month}-${day}`;
      const label = `${year}年${month}月${day}日(${dayOfWeek})`;
      options.push({ value, label });
    }
    return options;
  };

  // 時間のオプションを生成する関数 (00:00 - 23:30 を30分刻み)
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = String(h).padStart(2, '0');
        const minute = String(m).padStart(2, '0');
        const value = `${hour}:${minute}`;
        options.push({ value, label: value });
      }
    }
    return options;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  // 「現在時刻」ボタンが押された時の処理
  const handleSetCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(Math.floor(now.getMinutes() / 30) * 30).padStart(2, '0'); // 最も近い30分単位に丸める

    setSelectedDate(`${year}-${month}-${day}`);
    setSelectedTime(`${hours}:${minutes}`);
  };

  // 初期ロード時に現在時刻を選択するように設定 (オプション)
  // useEffect(() => {
  //   handleSetCurrentDateTime();
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!departureBusStop || !arrivalBusStop || !selectedDate || !selectedTime) {
      alert('すべての必須項目を入力してください。');
      return;
    }

    // 実際に予約情報を送信するAPIコールなど
    alert(
      `予約内容:\n` +
      `出発: ${departureBusStop}\n` +
      `到着: ${arrivalBusStop}\n` +
      `日付: ${selectedDate}\n` +
      `時間: ${selectedTime}\n` +
      `乗車タイプ: ${passengerType === 'person' ? '人' : '物'}\n` +
      `予約を完了します。`
    );
    // フォームをリセットしたい場合は以下をコメント解除
    // setDepartureBusStop('');
    // setArrivalBusStop('');
    // setSelectedDate('');
    // setSelectedTime('');
    // setPassengerType('person');
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700 dark:text-green-300">バス予約</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* 出発バス停入力フィールド */}
        <BusStopInput
          label="出発バス停"
          value={departureBusStop}
          onChange={setDepartureBusStop}
          placeholder="例: 大津駅"
        />

        {/* 到着バス停入力フィールド */}
        <BusStopInput
          label="到着バス停"
          value={arrivalBusStop}
          onChange={setArrivalBusStop}
          placeholder="例: びわ湖ホール"
        />

        {/* 日付選択フィールド (スクロール形式) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              日付
            </label>
            <button
              type="button"
              onClick={handleSetCurrentDateTime}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-xs font-semibold"
            >
              現在時刻
            </button>
          </div>
          <select
            id="bookingDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="" disabled>日付を選択</option>
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 時間選択フィールド (スクロール形式) */}
        <div className="mb-6">
          <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            時間
          </label>
          <select
            id="bookingTime"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="" disabled>時間を選択</option>
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 乗車タイプ選択ボタン (人/物) */}
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            乗車するもの
          </span>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setPassengerType('person')}
              className={`
                flex-1 py-2 px-4 rounded-l-md text-sm font-medium transition-colors duration-200 ease-in-out
                ${passengerType === 'person'
                  ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                }
              `}
            >
              人
            </button>
            <button
              type="button"
              onClick={() => setPassengerType('item')}
              className={`
                flex-1 py-2 px-4 rounded-r-md text-sm font-medium transition-colors duration-200 ease-in-out
                ${passengerType === 'item'
                  ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                }
              `}
            >
              物
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out"
        >
          バスを検索
        </button>
      </form>
    </div>
  );
}