import { createMuiTheme } from '@material-ui/core/styles';
import { font, colors } from 'style';

export const muiTheme = createMuiTheme({
	direction: 'rtl',
	typography: {
		fontFamily: [font.assistant, 'sans-serif'].join(',')
	},
	palette: {
		red: {
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
			main: colors.orange[500],
		},
		green: {
			'text': '#00453B',
			'text2': '#007e6c',
			'whatsapp': '#25D366',
			'bg': '#DEFFEA',
		},
	},
	navigation: {
		desktop: '72px',
		mobile: '79px',
	}
});
