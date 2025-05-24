import { createBooking } from "./actions/booking";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">バス予約フォーム</h1>
      <form action={createBooking} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="bookingNumber" className="block text-gray-700 text-sm font-bold mb-2">
            予約番号:
          </label>
          <input
            type="text"
            id="bookingNumber"
            name="bookingNumber"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: B001"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            予約者メールアドレス:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="your@example.com"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="departureBusStop" className="block text-gray-700 text-sm font-bold mb-2">
            出発バス停:
          </label>
          <input
            type="text"
            id="departureBusStop"
            name="departureBusStop"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: 東京駅"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="arrivalBusStop" className="block text-gray-700 text-sm font-bold mb-2">
            到着バス停:
          </label>
          <input
            type="text"
            id="arrivalBusStop"
            name="arrivalBusStop"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: 大阪駅"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bookingDate" className="block text-gray-700 text-sm font-bold mb-2">
            予約日:
          </label>
          <input
            type="date"
            id="bookingDate"
            name="bookingDate"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="bookingTime" className="block text-gray-700 text-sm font-bold mb-2">
            予約時間:
          </label>
          <input
            type="time" // timeタイプに変更
            id="bookingTime"
            name="bookingTime"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
            予約タイプ:
          </label>
          <select
            id="type"
            name="type"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">選択してください</option>
            <option value="PERSON">人</option>
            <option value="LUGGAGE">荷物</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          予約する
        </button>
      </form>
    </main>
  );
}