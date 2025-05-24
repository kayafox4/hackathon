/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 変更点: "./src/..." から "./..." に変更
    "./app/**/*.{js,jsx,mdx}", // app ディレクトリ内のすべてのJS/JSX/MDXファイルを対象
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
