// src/app/bookings/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import BusStopInput from '@/app/components/BusStopInput';
import { useSession } from 'next-auth/react';
import { createBooking } from '../actions/booking';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // ★★★ これが非常に重要！必ずインポート ★★★
import { format as formatDateFn, addMonths, isValid as isValidDate, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';

function generateBookingNumber() {
  return `BK-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export default function BookingsPage() {
  const [departureBusStop, setDepartureBusStop] = useState('');
  const [arrivalBusStop, setArrivalBusStop] = useState('');
  const [selectedDate, setSelectedDate] = useState(undefined); 
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarContainerRef = useRef(null);

  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [passengerType, setPassengerType] = useState('person');
  const [luggageOptions, setLuggageOptions] = useState([]); // 荷物オプション
  const luggageLabels = [
    { value: 'fragile', label: 'こわれもの' },
    { value: 'perishable', label: 'なまもの' },
    { value: 'breakable', label: 'われもの' },
    { value: 'upside_down_ng', label: '逆さま厳禁' },
    { value: 'other', label: 'その他' },
  ];

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const generateHourOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) options.push({ value: String(h).padStart(2, '0'), label: String(h).padStart(2, '0') });
    return options;
  };
  const generateMinuteOptions = () => {
    const options = [];
    for (let m = 0; m < 60; m++) options.push({ value: String(m).padStart(2, '0'), label: String(m).padStart(2, '0') });
    return options;
  };
  const hourOptions = generateHourOptions();
  const minuteOptions = generateMinuteOptions();
  
  const handleDateSelect = (date) => {
    if (date) setSelectedDate(startOfDay(date));
    setShowCalendar(false);
  };

  const handleSetCurrentDateTime = () => {
    const now = new Date();
    setSelectedDate(startOfDay(now));
    setSelectedHour(formatDateFn(now, 'HH'));
    setSelectedMinute(formatDateFn(now, 'mm'));
    setShowCalendar(false);
  };

  const handleLuggageOptionChange = (value) => {
    setLuggageOptions((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });
    let formattedDate = '';
    if (selectedDate && isValidDate(selectedDate)) {
      formattedDate = formatDateFn(selectedDate, 'yyyy-MM-dd');
    }

    if (!departureBusStop || !arrivalBusStop || !formattedDate || !selectedHour || !selectedMinute) {
      setFormMessage({ type: 'error', text: 'すべての必須項目を入力してください。' });
      return;
    }
    if (passengerType === 'item' && luggageOptions.length === 0) {
      setFormMessage({ type: 'error', text: '荷物の種類を1つ以上選択してください。' });
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
    formData.append('bookingDate', formattedDate);
    formData.append('bookingTime', `${selectedHour}:${selectedMinute}`);
    formData.append('type', passengerType === 'person' ? 'PERSON' : 'LUGGAGE');
    if (passengerType === 'item') {
      formData.append('luggageOptions', JSON.stringify(luggageOptions));
    }
    try {
      const result = await createBooking(formData);
      if (result.success && result.booking) {
        setFormMessage({ type: 'success', text: `予約が完了しました！ (予約番号: ${result.booking.bookingNumber})`});
      } else {
        setFormMessage({ type: 'error', text: result.message || '予約の作成に失敗しました。' });
      }
    } catch (error) {
      console.error("予約作成エラー:", error);
      setFormMessage({ type: 'error', text: '予期せぬエラーが発生しました。' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarContainerRef.current && !calendarContainerRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const today = startOfDay(new Date());
  const threeMonthsFromToday = addMonths(today, 3);

  return (
    <div className="text-gray-800 dark:text-gray-200"> {/* min-h-screen は layout の body で対応 */}
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700 dark:text-green-400">
        バス予約
      </h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md mx-auto border border-gray-200 dark:border-gray-600">
        {formMessage.text && (
          <div className={`p-3 rounded-md text-sm mb-4 ${formMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'}`}>
            {formMessage.text}
          </div>
        )}
        <BusStopInput label="出発バス停" value={departureBusStop} onChange={setDepartureBusStop} placeholder="例: 大津駅" />
        <BusStopInput label="到着バス停" value={arrivalBusStop} onChange={setArrivalBusStop} placeholder="例: びわ湖ホール" />

        <div className="mb-4" ref={calendarContainerRef}>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="date-input-trigger" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              日付
            </label>
            <button type="button" onClick={handleSetCurrentDateTime} className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-semibold">
              今日の日付
            </button>
          </div>
          <input
            id="date-input-trigger"
            type="text"
            value={selectedDate ? formatDateFn(selectedDate, 'yyyy年MM月dd日 (eee)', { locale: ja }) : ''}
            onFocus={() => setShowCalendar(true)}
            onClick={() => setShowCalendar(prev => !prev)}
            readOnly
            placeholder="日付をタップして選択"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
          {showCalendar && (
            <div className="calendar-popover">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={ja}
                fromDate={today}
                toDate={threeMonthsFromToday}
                defaultMonth={selectedDate || today} // 初期表示月を指定 (month の代わりに defaultMonth)
              // month={selectedDate || today}      // ← この行を削除またはコメントアウト
              // onMonthChange={(month) => {}}   // ← この行を削除またはコメントアウト
                captionLayout="dropdown-buttons"
                fromYear={today.getFullYear()}
                toYear={threeMonthsFromToday.getFullYear()}
                showOutsideDays
                initialFocus={showCalendar}
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">時間</label>
          <div className="flex space-x-2">
            <select id="bookingHour" value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required>
              <option value="" disabled>時</option>
              {hourOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select>
            <select id="bookingMinute" value={selectedMinute} onChange={(e) => setSelectedMinute(e.target.value)} className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required>
              <option value="" disabled>分</option>
              {minuteOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">乗車するもの</span>
          <div className="flex rounded-md shadow-sm mb-2">
            <button
              type="button"
              onClick={() => setPassengerType('person')}
              className={`flex-1 py-2 px-4 rounded-l-md text-sm font-medium transition-colors duration-200 ease-in-out ${passengerType === 'person' ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'}`}
            >
              人
            </button>
            <button
              type="button"
              onClick={() => setPassengerType('item')}
              className={`flex-1 py-2 px-4 rounded-r-md text-sm font-medium transition-colors duration-200 ease-in-out ${passengerType === 'item' ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'}`}
            >
              荷物
            </button>
          </div>
          {/* ここに金額表示を追加 */}
          {passengerType === 'person' && (
            <div className="mb-2 text-green-700 dark:text-green-300 font-bold">500円</div>
          )}
          {passengerType === 'item' && (
            <div className="mb-2 text-green-700 dark:text-green-300 font-bold">300円</div>
          )}
          {passengerType === 'item' && (
            <div className="mb-2">
              <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">荷物の種類を選択（複数可）</span>
              <div className="flex flex-wrap gap-2">
                {luggageLabels.map(opt => (
                  <label key={opt.value} className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={luggageOptions.includes(opt.value)}
                      onChange={() => handleLuggageOptionChange(opt.value)}
                      className="accent-green-600"
                    />
                    <span className="text-xs">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? '予約処理中...' : 'バスを予約する'}
        </button>
      </form>
      {/* NavigationBar は RootLayout で描画されるため、ここでは不要 */}
    </div>
  );
}