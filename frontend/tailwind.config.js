/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Background & colors
    'bg-blue-200', 'bg-green-400', 'bg-purple-300', 'bg-red-50', 'bg-blue-50', 'bg-green-50',
    'text-blue-800', 'text-blue-600', 'text-blue-500', 'text-red-500', 'text-red-600', 'text-red-800',

    // Gradient classes
    'from-indigo-500', 'via-purple-500', 'to-pink-500', 'from-blue-500',
    'to-purple-500', 'to-indigo-600', 'bg-gradient-to-r', 'bg-white', 'bg-opacity-95',

    // Spacing & layout
    'p-2', 'p-3', 'p-4', 'p-6', 'p-8', 'px-4', 'py-2', 'py-3', 'pl-3', 'pl-10', 'pr-3',
    'm-2', 'm-4', 'mb-1', 'mb-2', 'mb-4', 'mb-6', 'mt-1', 'mt-2', 'mt-4', 'mt-6', 'mt-8', 'mr-2', 'mr-4', 'ml-2', 'ml-4',
    'inset-0', 'inset-y-0', 'left-0', 'left-2', 'left-4', 'right-2', 'right-4', 'top-4', 'top-24',

    // Sizing
    'h-4', 'h-16', 'w-4', 'w-16', 'w-full', 'max-w-md', 'min-h-screen',

    // Flexbox & positioning
    'flex', 'flex-1', 'flex-col', 'flex-shrink-0', 'items-center', 'justify-center', 'justify-between',
    'absolute', 'relative', 'fixed', 'z-10', 'z-50', 'overflow-hidden',

    // Border & shadow
    'rounded-lg', 'rounded-xl', 'rounded-full', 'border', 'border-t',
    'border-gray-200', 'border-gray-300', 'border-blue-500', 'border-red-500',
    'shadow-lg', 'shadow-2xl', 'shadow-md', 'backdrop-blur-lg',

    // Text styling
    'text-center', 'text-sm', 'text-2xl', 'font-bold', 'font-medium',
    'text-white', 'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800',
    'underline',

    // Interactive states
    'hover:text-gray-700', 'hover:text-red-500', 'hover:text-blue-500', 'hover:text-blue-800',
    'hover:shadow-lg', 'hover:underline', 'hover:scale-[1.02]', 'active:scale-[0.98]',
    'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-200', 'focus:ring-blue-500',
    'focus:ring-red-200', 'focus:ring-opacity-50', 'focus:border-blue-500',

    // Animation
    'transition-all', 'transition-colors', 'duration-200', 'animate-spin',
    'animate-pulse-slow', 'animate-float', 'animate-confetti-fall', 'animate-shake',

    // Cursor
    'cursor-pointer'
  ],
  theme: {
    extend: {
      animation: {
        'slide-in': 'slide-in 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s infinite',
        'confetti-fall': 'confetti-fall 4s linear forwards',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '0% 0' },
        },
        'fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)' },
        }
      },
      colors: {
        'custom-blue': '#0074D9',
      },
      transitionProperty: {
        'all': 'all',
      },
      transitionDuration: {
        '200': '200ms',
      }
    },
  },
  plugins: [
    require('flowbite-typography'),
  ],
};