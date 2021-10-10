/**
 * Email service.
 * Compiles emails and pushes to an email web service.
 */
const Promise = require('bluebird');
const Nodemailer = require('nodemailer');
const path = require('path');

const Juice = require('juice');
const Log = require('../lib/log');
const Config = require('../lib/config');
const Alert = require('../model/alert');

const DIGEST_DAY_INTERVAL = 7;

class DigestEmail {
	/**
	 * Generate test SMTP service account from ethereal.email
	 * Only needed if you don't have a real mail account for testing
	 */
	constructor() {
		// create reusable transporter object using the default SMTP transport
		const env = process.env.NODE_ENV === 'test' ? 'test.email' : 'email'; // hack, should be fixed
		this.config = Config.get(`${env}`);
		this.baseUrl = Config.get('general.domain');
		this.transporter = Nodemailer.createTransport(this.config.options);
		this.templates = {};
	}

	newPlanAlert (user, unsentPlan, planStaticMap) {
		const alert = new Alert({
			id: user.alert_id,
			person_id: user.person_id
		});
		const data = user;

		Object.assign(data, unsentPlan.attributes);
		if (data.data.DEPOSITING_DATE) {
			const dates = data.data.DEPOSITING_DATE.split('T');
			data.data.DEPOSITING_DATE = dates[0];
		}

		data.unsubscribeLink =
			`${this.baseUrl}alerts/unsubscribe/${alert.unsubsribeToken()}`;
		data.link = `${this.baseUrl}plan/${unsentPlan.get('id')}`;
		data.jurisdiction = unsentPlan.get('jurisdiction');
		data.isLocalAuthority = data.jurisdiction === 'מקומית';
		data.type = 'plan-alert';

		data.attachments = [
			{
				cid: 'planmap',
				filename: 'plan_map.png',
				content: planStaticMap,
				encoding: 'base64'
			}
		];

		return this.sendWithTemplate(this.templates.alert, data);
	}

	formatDate(date) {
		const d = new Date(date);
		return `${(d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())}/${(d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))}/${d.getFullYear()}`;
	}

	newAlert (person, alert) {
		const templateProperties = Object.assign({}, person, alert.toJSON());
		templateProperties.type = 'new-alert';
		const alertTemplate = this.newAlertTemplateByType(alert.attributes.type);
		return this.sendWithTemplate(alertTemplate, templateProperties);
	}

	sendWithTemplate (template, templateProperties) {
		const attachments = templateProperties.attachments
			? templateProperties.attachments
			: [];

		attachments.push({
			filename: 'logo_email.png',
			path: path.resolve('api/service/email/logo_email.png'),
			cid: 'logomeirim'
		});
		attachments.push({
			filename: 'support_us.png',
			path: path.resolve('api/service/email/support_us.png'),
			cid: 'supportus'
		});

		const subject = Mustache.render(template.title, templateProperties)
			.replace(/\r?\n|\r/g, '')
			.replace(/\s\s+/g, ' ');

		const email = {
			from: `"${this.config.from_name}" <${this.config.from_email}>`, // sender address
			to: templateProperties.email, // list of receivers
			subject, // Subject line
			html: Mustache.render(template.body, templateProperties), // html body
			attachments,
			encoding: 'utf8',
			textEncoding: 'base64'
		};

		return this.send(email);
	}

	/**
	 * send mail with defined transport object
	 * @param {*} mailOptions
	 */
	send (mailOptions) {
		return this.transporter
			.sendMail(mailOptions)
			.then(info => Log.info('Message sent: %s', info.messageId, mailOptions.to));
	}
}

module.exports = new DigestEmail();
