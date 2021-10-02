import { createMuiTheme } from '@material-ui/core/styles';
import { font, colors } from 'style';

export const muiTheme = createMuiTheme({
	direction: 'rtl',
	typography: {
		fontFamily: [font.assistant, 'sans-serif'].join(',')
	},
	palette: {
		red: {
		    'main': '#ff3a68',
		    'alt': '#b71f29',
		},
		gray: {
		    '200': '#f4f4f4',
		    '400': '#d1ccd5',
		    '450': '#c4c4c4',
			'bg': '#fafafabf',
			'radio': '#f1eef2',
			'alt': '#665d71'
		},
		primary: {
			main: colors.purple[500],
		},
		secondary: {
			'100' : '#FEF2DA',
			'200' : '#FDE3B6',
			'300': '#F9CD90',
			'400': '#F3B773',
			'main': '#EB8C47',
			'600': '#CA7433',
			'700': '#A95623',
			'800': '#883B16',
			'contrastForGraphics': '#E7731E',
			'active': '#E7731E0F'
		},
		green: {
			'text' : '#00453B',
			'text2': '#007e6c',
			'whatsapp': '#25D366',
			'bg' : '#DEFFEA',
		},
		orange: {
			'text' : '#A95623',
			'bg' : '#FDE3B6',
		},
	},
	navigation: {
	    desktop: '72px',
	    mobile: '79px',
	}
});



