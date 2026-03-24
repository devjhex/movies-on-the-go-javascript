/** @type {import('tailwindcss').Config} */
export const content = [
  "docs/top-rated.html",
  "docs/movie.html",
  "docs/index.html",
  "docs/movie-details.html",
  "docs/top-rated.html",
  "docs/discover.html",
  "docs/celebrities.html",
  "docs/celebrity.html",
  "docs/search.html",
  "docs/pageScripts/*.js",
  "docs/scripts/*.js",
];
export const theme = {
  extend: {
    screens: {
      'xs': '320px',
      's': '375px',
      'sm': '412px',
      'md': '760px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      bebas: ['bebas', 'bebas-fallback', 'Arial Narrow', 'Arial', 'sans-serif'],
      lato: ['lato', 'lato-fallback', 'Helvetica Neue', 'Arial', 'sans-serif'],
      lucky: ['lucky', 'lucky-fallback', 'Impact', 'Arial Black', 'sans-serif'],
      roboto: ['roboto', 'roboto-fallback', 'Arial Narrow', 'Arial', 'sans-serif'],
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      },
      fadeOut: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' }
      },
      imageHolder: {
        '0%': { 'background-color': "#000000" },
        '50%': { 'background-color': "#FFB319" },
        '100%': { 'background-color': "#000000" }
      }
    },
    animation: {
      fadeIn: 'fadeIn 1s linear forwards',
      fadeOut: 'fadeOut 1s linear forwards',
      imageHolder: 'imageHolder 2s linear infinite'
    },
    lineClamp: {
      3: '3',
    },
  },
};
export const plugins = [];

