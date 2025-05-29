// src/app/bookings/page.js
'use client';

import { useState } from 'react'; // useEffectは現在未使用なので削除も可
import BusStopInput from '@/app/components/BusStopInput';
// --- サーバーアクションとセッションのために追加 ---
import { useSession } from 'next-auth/react';
import { createBooking } from '../actions/booking'; // 実際の予約処理のため

// --- 予約番号生成関数 (以前の提案より) ---
function generateBookingNumber() {
  return `BK-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export default function BookingsPage() {
  const [departureBusStop, setDepartureBusStop] = useState('');
  const [arrivalBusStop, setArrivalBusStop] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [passengerType, setPassengerType] = useState('person');

  // --- サーバーアクション連携のためのstate ---
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // 日付のオプションを生成する関数 (今日から3ヶ月後まで)
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時刻をリセットして日付のみで比較

    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(today.getMonth() + 3);

    let currentDate = new Date(today);
    let count = 0; // 念のため無限ループを防ぐカウンター
    while (currentDate.getTime() <= threeMonthsLater.getTime() && count < 93) { // 約3ヶ月分
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][currentDate.getDay()];
      const value = `${year}-${month}-${day}`;
      const label = `${year}年${month}月${day}日(${dayOfWeek})`;
      options.push({ value, label });

      currentDate.setDate(currentDate.getDate() + 1);
      count++;
    }
    return options;
  };

  // 時間のオプションを生成する関数 (0-23)
  const generateHourOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      const hour = String(h).padStart(2, '0');
      options.push({ value: hour, label: hour });
    }
    return options;
  };

  // 分のオプションを生成する関数 (0-59)
  const generateMinuteOptions = () => {
    const options = [];
    for (let m = 0; m < 60; m++) {
      const minute = String(m).padStart(2, '0');
      options.push({ value: minute, label: minute });
    }
    return options;
  };

  const dateOptions = generateDateOptions();
  const hourOptions = generateHourOptions();
  const minuteOptions = generateMinuteOptions();

  const handleSetCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    setSelectedDate(`${year}-${month}-${day}`);
    setSelectedHour(hours);
    setSelectedMinute(minutes);
  };

  // --- handleSubmitをサーバーアクション呼び出しに変更 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });

    if (!departureBusStop || !arrivalBusStop || !selectedDate || !selectedHour || !selectedMinute) {
      setFormMessage({ type: 'error', text: 'すべての必須項目を入力してください。' });
      return;
    }

    if (!session?.user?.email) {
      setFormMessage({ type: 'error', text: 'ログインしていません。ログインしてください。' });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('bookingNumber', generateBookingNumber());
    formData.append('email', session.user.email);
    formData.append('departureBusStop', departureBusStop);
    formData.append('arrivalBusStop', arrivalBusStop);
    formData.append('bookingDate', selectedDate);
    formData.append('bookingTime', `${selectedHour}:${selectedMinute}`);
    formData.append('type', passengerType === 'person' ? 'PERSON' : 'LUGGAGE');

    try {
      const result = await createBooking(formData);
      if (result.success && result.booking) {
        setFormMessage({
          type: 'success',
          text: `予約が完了しました！ (予約番号: ${result.booking.bookingNumber})`,
        });
        // 必要に応じてフォームをリセット
        // setDepartureBusStop('');
        // setArrivalBusStop('');
        // setSelectedDate('');
        // setSelectedHour('');
        // setSelectedMinute('');
        // setPassengerType('person');
      } else {
        setFormMessage({ type: 'error', text: result.message || '予約の作成に失敗しました。' });
      }
    } catch (error) {
      console.error("予約作成中に予期せぬエラー:", error);
      setFormMessage({ type: 'error', text: '予期せぬエラーが発生しました。もう一度お試しください。' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700 dark:text-green-300">バス予約</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* --- 結果メッセージ表示 --- */}
        {formMessage.text && (
          <div
            className={`p-3 rounded-md text-sm mb-4 ${
              formMessage.type === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
                : 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'
            }`}
          >
            {formMessage.text}
          </div>
        )}

        <BusStopInput
          label="出発バス停"
          value={departureBusStop}
          onChange={setDepartureBusStop}
          placeholder="例: 大津駅"
        />
        <BusStopInput
          label="到着バス停"
          value={arrivalBusStop}
          onChange={setArrivalBusStop}
          placeholder="例: びわ湖ホール"
        />

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
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-60"
            size={10} // スクロール表示
            required // 必須項目
          >
            <option value="" disabled>日付を選択</option>
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            時間
          </label>
          <div className="flex space-x-2">
            <select
              id="bookingHour"
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-60"
              size={10} // スクロール表示
              required // 必須項目
            >
              <option value="" disabled>時</option>
              {hourOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              id="bookingMinute"
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-60"
              size={10} // スクロール表示
              required // 必須項目
            >
              <option value="" disabled>分</option>
              {minuteOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
          disabled={isLoading} // ローディング中は無効化
          className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '予約処理中...' : 'バスを予約する'} {/* ボタンテキスト変更とローディング表示 */}
        </button>
      </form>
    </div>
  );
}