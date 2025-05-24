/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 変更点: "./src/..." から "./..." に変更
    "./app/**/*.{js,jsx,mdx}", // app ディレクトリ内のすべてのJS/JSX/MDXファイルを対象
    // もし components フォルダを app と同じ階層に作成している場合、以下も追加
    "./components/**/*.{js,jsx,mdx}",
    // もし pages ディレクトリを使っている場合、以下も追加
    "./pages/**/*.{js,jsx,mdx}",
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
