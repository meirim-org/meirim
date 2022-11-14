const scrapingbee = require('scrapingbee'); 
const config = require('./config');

async function getResponse(url, isFile) {

	const paramsToSend = {
		'country_code': 'il',
		'premium_proxy': 'true',
		'wait': 5000
	};

	if (isFile) {
		paramsToSend.render_js = 'false';
	}

	try {
		let client = new scrapingbee.ScrapingBeeClient(config.get('proxy.apiKey')); 
		let response = await client.get({
			url: url,
			params: paramsToSend,
			headers: {
			}
		});
		return response;
	}
	catch (err) {
		console.error('error in proxy!');
		console.error(err.response.data.toString('utf-8'));
		console.error(err);
	}
}

async function get(url) {

	const response =  await getResponse(url, false);
	if (response) {
		return response.data;
	}
}

async function getFile(url, file) {
	const response =  await getResponse(url, true);
	if (response) {
		file.write(response.data);
		file.on('finish', async function () {
			await file.close();
			Log.info(`downloaded ${url} to ${file.path}`);
		});
		return true;
	}
	return false;
}
module.exports = {
	get,
	getFile,
};