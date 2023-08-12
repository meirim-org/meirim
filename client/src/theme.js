import { createTheme } from '@material-ui/core/styles';
import { font } from 'style';

export const muiTheme = createTheme({
	direction: 'rtl',
	typography: {
		fontFamily: [font.assistant, 'sans-serif'].join(','),
	},
	fontFamily: ['Assistant'].join(','),
	palette: {
		black: '#000000',
		white: '#ffffff',
		red: {
			main: '#ff3a68',
			alt: '#b71f29',
		},
		gray: {
			100: '#FBFBFB',
			200: '#f4f4f4',
			300: '#E4E4E4',
			400: '#d1ccd5',
			450: '#c4c4c4',
			main: '#999999',
			600: '#666666',
			800: '#333333',
			bg: '#fafafabf',
			radio: '#f1eef2',
			alt: '#665d71',
		},
		primary: {
			100: '#F0E3FD',
			200: '#CFABFA',
			300: '#AE7FF0',
			400: '#8F5DE2',
			main: '#652DD0',
			600: '#4D20B2',
			700: '#391695',
			800: '#270E78',
			bg: '#f0e3fd66',
			custom: '#652dd00a',
		},
		secondary: {
			100: '#FEF2DA',
			200: '#FDE3B6',
			300: '#F9CD90',
			400: '#F3B773',
			main: '#EB8C47',
			600: '#CA7433',
			700: '#A95623',
			800: '#883B16',
			contrastForGraphics: '#E7731E',
			active: '#E7731E0F',
		},
		green: {
			text: '#00453B',
			text2: '#007e6c',
			whatsapp: '#25D366',
			bg: '#DEFFEA',
		},
		blue: {
			main: '#1a2d66',
			facebook: '#4267B2',
		},
		orange: {
			text: '#A95623',
			bg: '#FDE3B6',
		},
	},
	navigation: {
		desktop: '72px',
		mobile: '79px',
	},
});
