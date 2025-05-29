// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// authOptionsをエクスポート可能にする
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  // 必要に応じて他の NextAuth の設定 (callbacks など) をここに追加
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };