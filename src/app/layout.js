import './globals.css';
import { Inter } from 'next/font/google';
import NextAuthProvider from '@/providers/NextAuth'; // src/providers を参照

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'バス予約アプリ', // タイトルを分かりやすく変更
    description: 'Next.jsとNextAuth.jsによるバス予約アプリ', // 説明を分かりやすく変更
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja"> {/* langを'ja'に修正 */}
            <body className={inter.className}>
                <NextAuthProvider>{children}</NextAuthProvider>
            </body>
        </html>
    );
}