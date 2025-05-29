// src/app/bookings/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import BusStopInput from '@/app/components/BusStopInput'; // バス停入力コンポーネント
import { useSession } from 'next-auth/react'; // ユーザーセッション取得
import { createBooking } from '../actions/booking'; // 予約作成サーバーアクション

// react-day-picker と date-fns をインポート
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // react-day-picker の基本スタイル
import { format as formatDateFn, addMonths, isValid as isValidDate, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale'; // 日本語ロケール

// 予約番号を簡易的に生成する関数
function generateBookingNumber() {
  return `BK-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export default function BookingsPage() {
  const [departureBusStop, setDepartureBusStop] = useState('');
  const [arrivalBusStop, setArrivalBusStop] = useState('');
  
  // selectedDate は Date オブジェクトまたは undefined で管理
  const [selectedDate, setSelectedDate] = useState(undefined); 
  const [showCalendar, setShowCalendar] = useState(false); // カレンダーの表示/非表示
  const dateInputRef = useRef(null); // 日付入力欄の参照 (未使用であれば削除可)
  const calendarContainerRef = useRef(null); // カレンダーとそのトリガーを含むコンテナの参照

  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [passengerType, setPassengerType] = useState('person'); // 初期値 'person'

  const { data: session } = useSession(); // NextAuthのセッション情報
  const [isLoading, setIsLoading] = useState(false); // フォーム送信中のローディング状態
  const [formMessage, setFormMessage] = useState({ type: '', text: '' }); // フォームのメッセージ (成功/エラー)

  // 時間の選択肢を生成 (00-23)
  const generateHourOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      const hour = String(h).padStart(2, '0');
      options.push({ value: hour, label: hour });
    }
    return options;
  };

  // 分の選択肢を生成 (00-59)
  const generateMinuteOptions = () => {
    const options = [];
    for (let m = 0; m < 60; m++) {
      const minute = String(m).padStart(2, '0');
      options.push({ value: minute, label: minute });
    }
    return options;
  };

  const hourOptions = generateHourOptions();
  const minuteOptions = generateMinuteOptions();

  // カレンダーで日付が選択されたときの処理
  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(startOfDay(date)); // 時刻部分をリセットして日付のみを確実に保持
    }
    setShowCalendar(false); // 日付を選択したらカレンダーを閉じる
  };

  // 「今日の日付」または「現在時刻」ボタンが押されたときの処理
  const handleSetCurrentDateTime = () => {
    const now = new Date();
    setSelectedDate(startOfDay(now)); // 今日の日付をDateオブジェクトで設定
    setSelectedHour(formatDateFn(now, 'HH')); // 現在の時
    setSelectedMinute(formatDateFn(now, 'mm')); // 現在の分
    setShowCalendar(false); // カレンダーを閉じる
  };

  // フォーム送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' }); // 古いメッセージをクリア

    let formattedDate = '';
    if (selectedDate && isValidDate(selectedDate)) {
      formattedDate = formatDateFn(selectedDate, 'yyyy-MM-dd'); // YYYY-MM-DD形式の文字列に
    }

    // 入力チェック
    if (!departureBusStop || !arrivalBusStop || !formattedDate || !selectedHour || !selectedMinute) {
      setFormMessage({ type: 'error', text: 'すべての必須項目を入力してください。' });
      return;
    }
    if (!session?.user?.email) {
      setFormMessage({ type: 'error', text: 'ログインしていません。ログインしてください。' });
      return;
    }

    setIsLoading(true); // ローディング開始
    const formData = new FormData();
    formData.append('bookingNumber', generateBookingNumber());
    formData.append('email', session.user.email);
    formData.append('departureBusStop', departureBusStop);
    formData.append('arrivalBusStop', arrivalBusStop);
    formData.append('bookingDate', formattedDate); // フォーマット済みの日付文字列
    formData.append('bookingTime', `${selectedHour}:${selectedMinute}`);
    formData.append('type', passengerType === 'person' ? 'PERSON' : 'LUGGAGE'); // Prisma Enumに合わせる

    try {
      const result = await createBooking(formData); // サーバーアクション呼び出し
      if (result.success && result.booking) {
        setFormMessage({
          type: 'success',
          text: `予約が完了しました！ (予約番号: ${result.booking.bookingNumber})`,
        });
        // フォームリセット (必要であればコメントを外す)
        // setDepartureBusStop(''); 
        // setArrivalBusStop(''); 
        // setSelectedDate(undefined);
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
      setIsLoading(false); // ローディング終了
    }
  };

  // カレンダーの外側をクリックしたときにカレンダーを閉じる処理
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarContainerRef.current && !calendarContainerRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    // カレンダーが表示されている時だけイベントリスナーを追加
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    // クリーンアップ関数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]); // showCalendar の状態が変わるたびに実行

  // カレンダーの日付範囲設定
  const today = startOfDay(new Date()); // 今日の日付 (時刻情報なし)
  const threeMonthsFromToday = addMonths(today, 3);

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700 dark:text-green-400" 
          style={process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.getComputedStyle(document.documentElement).getPropertyValue('--font-eb-garamond').trim() !== '' ? { fontFamily: 'var(--font-eb-garamond), serif' } : {}}
      >
        バス予約
      </h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700">
        {/* 予約結果メッセージ表示 */}
        {formMessage.text && (
          <div className={`p-3 rounded-md text-sm mb-4 ${
            formMessage.type === 'success' 
            ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100' 
            : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'
          }`}>
            {formMessage.text}
          </div>
        )}

        {/* 出発バス停 */}
        <BusStopInput 
          label="出発バス停" 
          value={departureBusStop} 
          onChange={setDepartureBusStop} 
          placeholder="例: 大津駅" 
        />

        {/* 到着バス停 */}
        <BusStopInput 
          label="到着バス停" 
          value={arrivalBusStop} 
          onChange={setArrivalBusStop} 
          placeholder="例: びわ湖ホール" 
        />

        {/* 日付選択 (カレンダーポップアップ) */}
        <div className="mb-4" ref={calendarContainerRef}>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="date-input-trigger" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              日付
            </label>
            <button 
              type="button" 
              onClick={handleSetCurrentDateTime} 
              className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-semibold"
            >
              今日の日付
            </button>
          </div>
          <input
            id="date-input-trigger"
            ref={dateInputRef} // dateInputRefを割り当て
            type="text"
            value={selectedDate ? formatDateFn(selectedDate, 'yyyy年MM月dd日 (eee)', { locale: ja }) : ''}
            onFocus={() => setShowCalendar(true)} // フォーカスでカレンダー表示
            onClick={() => setShowCalendar(prev => !prev)} // クリックでカレンダー表示/非表示トグル
            readOnly // 直接入力を防ぐ
            placeholder="日付をタップして選択"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
          {showCalendar && (
            <div className="calendar-popover"> {/* globals.cssでスタイル定義 */}
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={ja}
                fromDate={today}
                toDate={threeMonthsFromToday}
                month={selectedDate || today} // カレンダーの初期表示月
                onMonthChange={(month) => { /* 必要なら月の変更をハンドル */ }}
                captionLayout="dropdown-buttons" // 年月をドロップダウンでナビゲート
                fromYear={today.getFullYear()}
                toYear={threeMonthsFromToday.getFullYear()}
                showOutsideDays // 当月以外の日も表示
                initialFocus={showCalendar} // カレンダー表示時にフォーカス
                // modifiersClassNames や classNames は globals.css での指定を優先するため削除
              />
            </div>
          )}
        </div>

        {/* 時間と分選択 (標準ドロップダウン) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">時間</label>
          <div className="flex space-x-2">
            <select 
              id="bookingHour" 
              value={selectedHour} 
              onChange={(e) => setSelectedHour(e.target.value)} 
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
              required
            >
              <option value="" disabled>時</option>
              {hourOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select>
            <select 
              id="bookingMinute" 
              value={selectedMinute} 
              onChange={(e) => setSelectedMinute(e.target.value)} 
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
              required
            >
              <option value="" disabled>分</option>
              {minuteOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select>
          </div>
        </div>

        {/* 乗車タイプ選択ボタン */}
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            乗車するもの
          </span>
          <div className="flex rounded-md shadow-sm">
            <button 
              type="button" 
              onClick={() => setPassengerType('person')} 
              className={`flex-1 py-2 px-4 rounded-l-md text-sm font-medium transition-colors duration-200 ease-in-out ${
                passengerType === 'person' 
                ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
              }`}
            >
              人
            </button>
            <button 
              type="button" 
              onClick={() => setPassengerType('item')} 
              className={`flex-1 py-2 px-4 rounded-r-md text-sm font-medium transition-colors duration-200 ease-in-out ${
                passengerType === 'item' 
                ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
              }`}
            >
              物
            </button>
          </div>
        </div>

        {/* 送信ボタン */}
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '予約処理中...' : 'バスを予約する'}
        </button>
      </form>
    </div>
  );
}