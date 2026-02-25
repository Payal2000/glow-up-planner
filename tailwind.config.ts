import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			petal: {
  				DEFAULT: '#e8a0b4',
  				light: '#f5d5de',
  				pale: '#fdf0f4',
  				deep: '#c77d94'
  			},
  			blush: '#f9e4eb',
  			cream: '#fefaf8',
  			'warm-white': '#fffbf9',
  			latte: {
  				DEFAULT: '#f0e0d4',
  				light: '#f8f0ea'
  			},
  			mocha: {
  				DEFAULT: '#b08b6e',
  				light: '#d4b89c'
  			},
  			ink: {
  				dark: '#3d2b2b',
  				mid: '#6b4f4f',
  				soft: '#9c7e7e',
  				faint: '#c4a8a8'
  			},
  			sage: {
  				DEFAULT: '#b8c9a3',
  				light: '#e3ecd8'
  			},
  			lavender: {
  				DEFAULT: '#c9b8e8',
  				light: '#ede5f7'
  			},
  			peach: {
  				DEFAULT: '#f5c4a1',
  				light: '#fce8d5'
  			},
  			mist: {
  				DEFAULT: '#a8c8e0',
  				light: '#daeaf5'
  			},
  			gold: {
  				DEFAULT: '#e0c88a',
  				light: '#f5ecd0'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			playfair: [
  				'var(--font-playfair)',
  				'Georgia',
  				'serif'
  			],
  			cormorant: [
  				'var(--font-cormorant)',
  				'Georgia',
  				'serif'
  			],
  			dm: [
  				'var(--font-dm)',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
  			soft: '0 2px 20px rgba(200,160,170,0.12)',
  			card: '0 4px 30px rgba(200,160,170,0.15)',
  			hover: '0 8px 40px rgba(200,160,170,0.22)'
  		}
  	}
  },
  plugins: [],
}

export default config
