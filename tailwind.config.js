/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Neutrals
        'dark-text': {
          100: '#1f1f1f',
          50: '#1f1f1f',
          25: '#1f1f1f',
        },
        'light-text': '#737373',
        border: '#EBEAEA',
        white: {
          100: '#FFFFFF',
          50: '#476c80',
          DEFAULT: '#FFFFFF',
        },

        // Primary
        'primary-blue': {
          100: '#476c80',
          50: '#476c80',
          10: '#476c80',
        },
        'primary-green': {
          100: '#276231',
          50: '#276231',
          10: '#276231',
        },

        // Secondary
        'secondary-purple': {
          100: '#2927AE',
          50: '#2927AE',
          10: '#2927AE',
        },
        'secondary-pink': {
          100: '#ED818A',
          50: '#2927AE',
          10: '#2927AE',
        },
        'secondary-blue': {
          100: '#54BEEF',
          50: '#2927AE',
          10: '#2927AE',
        },

        // Messaging
        red: {
          100: '#9A2626',
          10: '#9A2626',
        },
        grey: {
          100: '#737373',
          10: '#737373',
        },
        orange: {
          100: '#ab590d',
          10: '#ab590d',
        },
        green: {
          100: '#276231',
          10: '#276231',
        },
      },
      boxShadow: {
        soft: '2px 2px 20px 0px rgba(31, 31, 31, 0.1)',
      },
    },
  },
  plugins: [],
};
