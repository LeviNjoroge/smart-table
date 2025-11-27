/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'primary-purple': '#a855f7',
                'secondary-teal': '#14b8a6',
            },
            fontFamily: {
                sans: ['Geist Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
