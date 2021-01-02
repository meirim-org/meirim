import api from 'services/api';

export const userLoggedInMenuItems = [
	{
		'text': 'התנתק',
		'onClick': () =>  api.post('/sign/out')
		
	},
];