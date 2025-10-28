/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineClamp: {
        2: '2',
      },
      colors: {
        // French aesthetic color palette
        background: {
          DEFAULT: '#F9F6F4',
          dark: '#1A1614',
        },
        foreground: {
          DEFAULT: '#2C2417',
          dark: '#F9F6F4',
        },
        primary: {
          DEFAULT: '#D4B5A0',
          dark: '#8B6F5E',
        },
        secondary: {
          DEFAULT: '#E8D5C4',
          dark: '#6B5749',
        },
        accent: {
          DEFAULT: '#C9B5A8',
          dark: '#5A4A3E',
        },
        muted: {
          DEFAULT: '#EDE5DC',
          dark: '#3A332D',
        },
        border: {
          DEFAULT: '#D4C4B3',
          dark: '#5A5248',
        },
        input: {
          DEFAULT: '#E8DDD3',
          dark: '#4A4238',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#2A2520',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          dark: '#2A2520',
        },
        destructive: {
          DEFAULT: '#B8867D',
          dark: '#A67269',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

