const axios = require('axios');
const Controller = require('./controller');
const Config = require('../lib/config').paymentServices;
const FundingTransaction = require('../model/funding_transaction');
const Exception = require('../model/exception');

const DEFAULT_PAYMENT_AMOUNT = 50;

let instance = axios.create({
	baseURL: Config.baseURL
});

const paymentUrlConfig = {
	"action": "APISign",
	"What": "SIGN",
	"KEY": Config.apiKey,
	"PassP": Config.PassP,
	"Masof": Config.masofId,
	"UTF8": "True",
	"UTF8out": "True",
	"Coin": 1,
	"sendemail": "True",
	"SendHesh": "True",
	"PageLang": "HEB",
	"tmp": 11,
	"Pritim": "True",
	"OnlyOnApprove": "True",
	"Sign": "True"
};

const paymentVerificationConfig = {
	"action": "APISign",
	"What": "VERIFY",
	"KEY": Config.apiKey,
	"PassP": Config.PassP,
	"Masof": Config.masofId
};

class FundingController extends Controller {
	create (req, res, next) {
		// validate fields are provided
		if (req.body.yaad_id === undefined) {
			return Promise.reject(new Exception.BadRequest('No yaad_id provided'));
		} else if (req.body.hk_id === undefined) {
			return Promise.reject(new Exception.BadRequest('No hk_id provided'));
		} else if (req.body.amount === undefined) {
			return Promise.reject(new Exception.BadRequest('No amount provided'));
		} else if (req.body.redirect_params === undefined) {
			return Promise.reject(new Exception.BadRequest('No redirect_params provided'));
		}

		// verify transaction details
		const params = {
			...paymentVerificationConfig,
			...req.body.redirect_params
		}

		return instance.get('/p/', { params }).then((res) => {
			// check if result is success
			if (res.data.trim() === 'CCode=0') {
				const fundingTransaction = new FundingTransaction({
					yaad_id: req.body.yaad_id,
					hk_id: req.body.hk_id,
					amount: req.body.amount
				});

				// save and return no data
				return fundingTransaction.save(null, {autoRefresh: false}).then(() => true);
			} else {
				return Promise.reject(new Exception.BadRequest('invalid redirect params'));
			}
		});
	}

	paymentLink (req) {
		const { query } = req;

		let params = {
			...paymentUrlConfig,
			Amount: !isNaN(query.amount)? query.amount : DEFAULT_PAYMENT_AMOUNT
		};

		if (query.monthly) {
			params.HK = "True";
			params.Info = "תרומה חודשית לעמותת מעירים";
			params.heshDesc = ["", "תרומה%20חודשית%20לעמותת%20מעירים", "1", `${params.Amount}`].join('~');
			params.Tash = 999;
		} else {
			params.Info = "תרומה חד פעמית לעמותת מעירים";
			params.heshDesc = ["", "תרומה%20חד%20פעמית%20לעמותת%20מעירים", "1", `${params.Amount}`].join('~');
		}

		return instance.get('/p3/', {
			params
		}).then(res => `${Config.baseURL}/p3/?action=pay&${res.data}`);
	}

	getFundingStats () {
		return this.model.getCurrentFundingStats()
			.then(currentAmount => {
				const statsRow = currentAmount.first();
				return {
					totalAmount: statsRow.get('total_amount') || 0,
					count: statsRow.get('count') || 0,
				};
		});
	}
}

module.exports = new FundingController(FundingTransaction);
