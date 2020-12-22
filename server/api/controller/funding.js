const Controller = require('./controller');
const Config = require('../lib/config');
const Http = require('http')

const paymentDefaultConfig = {
        "action":"APISign",
        "What":"SIGN",
        "KEY":Config.apiKey,
        "PassP":Config.PassP,
        "Masof":Config.masofId,
        "UTF8":"True",
        "UTF8out":"True",
        "Coin":1,
        "sendemail":"True",
        "SendHesh":"True",
        "PageLang":"HEB",
        "tmp":11,
        "Pritim":"True",
		"OnlyOnApprove":"True",
}

class FundingController extends Controller {

	paymentLink (req) {

		const { query } = req;

		let params = {
			...paymentDefaultConfig,
			Amount: query.amount
		}

		if (query.monthly){
			params.HK = "True",
			params.Info = "תרומה חודשית לעמותת מעירים",
			params.heshDesc = ["", "תרומה%20חודשית%20לעמותת%20מעירים", "1", `${params.Amount}`].join('~')
		}
		else{
			params.Info = "תרומה חד פעמית לעמותת מעירים",
			params.heshDesc = ["", "תרומה%חד פעמית%20לעמותת%20מעירים", "1", `${params.Amount}`].join('~')
		}
		
		return Http.get(`${Config.baseURL}/`, {
			params
		}).then(res=>`${config.baseURL}/?action=pay&${res.data}`)
	} 
}

module.exports = new FundingController();
