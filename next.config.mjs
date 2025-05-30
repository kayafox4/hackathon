// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // (これは元々あるかもしれません)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Googleのユーザー画像の一般的なホスト名
        // port: '', // 通常は不要
        // pathname: '/a/**', // 必要であればもっと具体的に指定
      },
      // 他にも外部ドメインの画像を使う場合はここに追加
    ],
  },
};

export default nextConfig;