import { createMuiTheme } from '@material-ui/core/styles';

export const muiTheme = createMuiTheme({
	fontFamily: [
		'Assistant',
	].join(','),
	palette: {
		black: '#000000',
		white: '#ffffff',
		gray: {
		    '100': '#FBFBFB',
		    '300': '#E4E4E4',
		    'main': '#999999',
		    '600': '#666666',
		    '800': '#333333',
			'bg': '#fafafabf'
		},
		primary: {
			'100' : '#F0E3FD',
			'200' : '#CFABFA',
			'300': '#AE7FF0',
			'400': '#8F5DE2',
			'main': '#652DD0',
			'600': '#4D20B2',
			'700': '#391695',
			'800': '#270E78',
			'bg': '#f0e3fd66'
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
			'contrastForGraphics': '#E7731E'
		},
		green: {
			'text' : '#00453B',
			'bg' : '#DEFFEA',
		},
	},
})



