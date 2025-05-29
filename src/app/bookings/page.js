// src/app/bookings/page.jsx
'use client';

import { useState } from 'react';
import BusStopInput from '@/app/components/BusStopInput'; // BusStopInput コンポーネントをインポート

export default function BookingsPage() {
  const [departureBusStop, setDepartureBusStop] = useState('');
  const [arrivalBusStop, setArrivalBusStop] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [passengerType, setPassengerType] = useState('person'); // 'person' (人) または 'item' (物)

  const handleSubmit = (e) => {
    e.preventDefault();
    // 予約処理のロジックをここに記述
    console.log('出発バス停:', departureBusStop);
    console.log('到着バス停:', arrivalBusStop);
    console.log('日付:', selectedDate);
    console.log('時間:', selectedTime);
    console.log('乗車タイプ:', passengerType === 'person' ? '人' : '物');

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
      `予約を完了しました！`
    );
    // フォームをリセットしたい場合は以下をコメント解除
    // setDepartureBusStop('');
    // setArrivalBusStop('');
    // setSelectedDate('');
    // setSelectedTime('');
    // setPassengerType('person');
  };

  // 今日の日付を取得して、カレンダーの最小値に設定
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

        {/* 日時入力フィールド */}
        <div className="mb-4">
          <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            日付
          </label>
          <input
            id="bookingDate"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getTodayDate()} // 今日の日付より前の日付を選択できないようにする
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            時間
          </label>
          <input
            id="bookingTime"
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
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