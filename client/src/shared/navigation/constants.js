import api from 'services/api'

export const userLoggedInMenuItems = [
	{
		'text': 'התנתק',
		'onClick': async () => {
			const response = await api.post('/sign/out')
			console.log('🚀 ~ file: constants.js ~ line 8 ~ \'onClick\': ~ response', response)
		}
	},
]