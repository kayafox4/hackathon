/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,mdx}', // appディレクトリ内のすべてのJS/JSX/MDXファイルを対象
    './pages/**/*.{js,jsx,mdx}', // pagesディレクトリ内のすべてのJS/JSX/MDXファイルを対象（もし使用しているなら）
    './components/**/*.{js,jsx,mdx}', // componentsディレクトリ内のすべてのJS/JSX/MDXファイルを対象（もし使用しているなら）
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}