/** @type {import('tailwindcss').Config} */
module.exports = {
  // Важно: проверь, чтобы здесь были пути ко всем твоим папкам
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  // Ставим true, чтобы Тейлвинд имел приоритет над остатками Бутстрапа
  important: true,
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
