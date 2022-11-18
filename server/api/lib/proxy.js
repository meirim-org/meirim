const scrapingbee = require('scrapingbee'); 
const config = require('./config');

async function get(url) {

	try {
		let client = new scrapingbee.ScrapingBeeClient(config.get('proxy.apiKey')); 
		let response = await client.get({
			url: url,
			params: {
				'country_code': 'il',
				'premium_proxy': 'true',
				'wait': 5000,
			},
			headers: {
			}
		});
		return response.data;
	}
	catch (err) {
		console.error('error in proxy!');
		console.error(err);
	}
}
module.exports = {
	get,
};