import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#D4AF37', // Gold
                secondary: '#2C3E50', // Dark Charcoal
                accent: '#E8F5E9', // Soft Sage
                'deep-green': '#1B4D3E',
                'cream': '#F5F5DC',
            },
            fontFamily: {
                sans: ['var(--font-outfit)'],
            },
        },
    },
    plugins: [],
}
export default config
