/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 変更点: './app/**' から './src/app/**' に変更
    './src/app/**/*.{js,jsx,mdx}', // src/app ディレクトリ内のすべての .js, .jsx, .mdx ファイルを対象
    './src/pages/**/*.{js,jsx,mdx}', // src/pages も含める場合（もしあれば）
    './src/components/**/*.{js,jsx,mdx}', // src/components も含める場合（もしあれば）
  ],
  theme: {
    extend: {
      // 以前の設定もここに残します
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
