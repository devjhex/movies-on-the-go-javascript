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
  "docs/pageScripts/index.js",
  "docs/pageScripts/movie-details.js",
  "docs/pageScripts/top-rated.js",
  "docs/pageScripts/discover.js",
  "docs/pageScripts/celebrities.js",
  "docs/pageScripts/celebrity.js",
  "docs/pageScripts/search.js",
  "docs/scripts/preview.js",
  "docs/shared.html",
  "docs/dist/bundle.js"
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
      bebas: 'bebas',
      lato: 'lato',
      lucky: 'lucky',
      roboto: 'roboto',
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

