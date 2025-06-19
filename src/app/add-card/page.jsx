// src/app/add-card/page.jsx (新規作成)
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

// 表示するカードブランドのロゴ情報
const cardLogos = [
  { src: '/images/payment-logos/visa.svg', alt: 'Visa' },
  { src: '/images/payment-logos/mastercard.svg', alt: 'Mastercard' },
  { src: '/images/payment-logos/saisoncard.svg', alt: 'Saison Card' }, // ファイル名を仮定
  { src: '/images/payment-logos/jcb.svg', alt: 'JCB' },
  { src: '/images/payment-logos/americanexpress.svg', alt: 'American Express' },
  { src: '/images/payment-logos/dinersclub.svg', alt: 'Diners Club' },
  { src: '/images/payment-logos/discover.svg', alt: 'Discover' },
];

export default function AddCardPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const router = useRouter();

  // カード番号のフォーマット (0000 0000 0000 0000)
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, ''); // 数字以外を削除
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }
    return parts.join(' ').substring(0, 19); // 最大16桁 + 3スペース
  };

  // 有効期限のフォーマット (MM/YY)
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  // 登録ボタン押下時
  const handleRegisterCard = async (e) => {
    e.preventDefault();
    // ここでカード登録処理を行う（省略）
    // マイページに「クレジットカード」選択状態で遷移
    router.push('/test?payment=credit_card');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center">
      {/* ヘッダー */}
      <header className="w-full bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center sticky top-0 z-10">
        <Link href="/test" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mx-auto">
          クレジットカードの登録
        </h1>
        <div className="w-8"></div> {/* タイトルを中央に保つためのスペーサー */}
      </header>

      <main className="w-full max-w-md p-6 space-y-6 mt-4">
        {/* 利用可能なクレジットカードのロゴ */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">利用可能なクレジットカード</p>
          <div className="flex flex-wrap gap-2 items-center">
            {cardLogos.map(logo => (
              <div key={logo.alt} className="relative h-6 w-10"> {/* サイズ調整 */}
                <Image src={logo.src} alt={logo.alt} layout="fill" objectFit="contain" />
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleRegisterCard} className="space-y-5">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              カード番号
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formatCardNumber(cardNumber)}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              maxLength={19} // 16 digits + 3 spaces
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              required
              inputMode="numeric"
            />
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              有効期限
            </label>
            <input
              type="text"
              id="expiryDate"
              value={formatExpiryDate(expiryDate)}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              required
              inputMode="numeric"
            />
          </div>

          <div>
            <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              セキュリティコード
            </label>
            <div className="flex items-center">
              <input
                type="text" // type="password" の方が良いかも
                id="securityCode"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').substring(0, 4))}
                placeholder="3桁または4桁の番号"
                maxLength={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                required
                inputMode="numeric"
              />
              <Link href="#" onClick={(e) => e.preventDefault()} className="ml-2 text-gray-400 hover:text-gray-600">
                <QuestionMarkCircleIcon className="h-6 w-6" />
              </Link>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">カード裏面の署名欄にある3桁または4桁の番号です。</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out"
          >
            登録する
          </button>
        </form>
      </main>
    </div>
  );
}