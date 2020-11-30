import { createMuiTheme } from '@material-ui/core/styles';

export const muiTheme = createMuiTheme({
	typography: {
		fontFamily: [
			'Assistant',
		].join(','),
		subtitle1:{
			fontSize: '18px',
			fontWeight: 'bold'
		},
		h2: {
			fontSize: '24px',
			fontWeight: '600'
		}
	},
	palette: {
		primary: {
			'main': '#652dd0',
			'200' : 'rgba(250, 250, 250, 0.85)',
			'300': 'rgba(240, 227, 253, 0.4)',
			'400': '#4d20b2',
		},
		orange: '#e7731e',
		white: '#ffffff',
		black: { '100': '#342e3e' },
		gray: { '100': '#e4e4e4' }
	},
})



