/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],

	theme: {
		extend: {
			fontFamily: {
				albulaLight: ['AlbulaLight', 'sans-serif'],
				albulaRegular: ['AlbulaRegular', 'sans-serif'],
				albulaMedium: ['AlbulaMedium', 'sans-serif'],
				albulaSemiBold: ['AlbulaSemiBold', 'sans-serif'],
				albulaBold: ['AlbulaBold', 'sans-serif'],
				albulaExtraBold: ['AlbulaExtraBold', 'sans-serif'],
				albulaHeavy: ['AlbulaHeavy', 'sans-serif'],
			},
		},
	},
	
	plugins: [],
}