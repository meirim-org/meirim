/**
 * Email service.
 * Compiles emails and pushes to an email web service.
 */
const Promise = require('bluebird');
const Nodemailer = require('nodemailer');
const Mustache = require('mustache');
const dir = require('node-dir');
const path = require('path');

const Juice = require('juice');
const Log = require('../lib/log');
const Config = require('../lib/config');
const Alert = require('../model/alert');

class Email {
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

	/**
	 * Init the class and load the template files.
	 */
	init () {
		const templateDir = `${__dirname}/email/`;
		const templates = {};
		const contents = [];
		let mapper = [];
		return new Promise((resolve, reject) => {
			dir.readFiles(
				templateDir,
				{
					match: /.mustache$/,
					shortName: true
				},
				(err, content, next) => {
					if (err) {
						reject(err);
					}

					contents.push(content);
					next();
				},
				(err, files) => {
					if (err) {
						reject(err);
					}

					mapper = files;
					resolve();
				}
			);
		}).then(() => {
			mapper.map((file, index) => {
				const key = file
					.split('.')
					.shift();
				templates[key] = contents[index];
			});

			for (const key in templates) {
				const title = templates[key].match(
					/<title[^>]*>((.|[\n\r])*)<\/title>/im
				)[1];
				const body = templates[key].match(
					/<body[^>]*>((.|[\n\r])*)<\/body>/im
				)[1];
				const html = Mustache.render(templates.wrapper, {
					body
				});

				this.templates[key] = {
					title,
					body: Juice(html)
				};
			}
		});
	}

	newSignUp (person) {
		const token = person.getActivationToken();
		const templateProperties = {
			url: `${this.baseUrl}activate/?token=${token}`,
			email: person.get('email'),
			type: 'signup'
		};
		// setup email data with unicode symbols
		return this.sendWithTemplate(this.templates.newSignUp, templateProperties);
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

	planDepositAlert (user, unsentPlan) {
		const data = user;

		Object.assign(data, unsentPlan.attributes);
		if (data.data.DEPOSITING_DATE) {
			const dates = data.data.DEPOSITING_DATE.split('T');
			data.data.DEPOSITING_DATE = dates[0];
		}

		data.link = `${this.baseUrl}plan/${unsentPlan.get('id')}`;
		data.jurisdiction = unsentPlan.get('jurisdiction');
		data.type = 'plan-alert';

		return this.sendWithTemplate(this.templates.planDeposit, data);
	}

	formatDate(date) {
		const d = new Date(date);
		return `${(d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())}/${(d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))}/${d.getFullYear()}`;
	}

	treeAlert (user, unsentTree, treeStaticMap) {
		const alert = new Alert({
			id: user.alert_id,
			person_id: user.person_id
		});
		const data = user;

		Object.assign(data, unsentTree.attributes);
		
		data.unsubscribeLink = `${this.baseUrl}alerts/unsubscribe/${alert.unsubsribeToken()}`;
		data.link = `${this.baseUrl}tree/${unsentTree.get('id')}`;
		data.place_text = data.place? `רשיון כריתה חדש ב${data.place}` : 'רשיון כריתה חדש באזורך';
		data.address = data.street ? (data.street_number? `${data.street} ${data.street_number}`: `${data.street}`) : 'לא צוינה כתובת';
		data.total_trees_text = (data.total_trees === 1)? 'עץ אחד': `${data.total_trees} עצים`;
		data.reason_short_text = data.reason_short? data.reason_short : 'לא צוינה סיבה';
		data.reason_detailed_text = data.reason_detailed? data.reason_detailed : 'לא צוין פירוט הסיבה';
		data.start_date_text = this.formatDate(data.start_date);
		data.hasMap = Boolean(treeStaticMap);
		data.type = 'tree-alert';

		if (treeStaticMap) {
			data.attachments = [
				{
					cid: 'planmap',
					filename: 'plan_map.png',
					content: treeStaticMap,
					encoding: 'base64'
				}
			];
		}

		return this.sendWithTemplate(this.templates.treeAlert, data);
	}

	// digestPlanAlert (user, plans = []) {
		
	// }

	newAlertTemplateByType(type){
		let alertTemplate = this.templates.newAlert;
		if (type === 'tree'){
			alertTemplate = this.templates.newTreeAlert;
		}
		return alertTemplate;
	}

	newAlert (person, alert) {
		const templateProperties = Object.assign({}, person, alert.toJSON());
		templateProperties.type = 'new-alert';
		const alertTemplate = this.newAlertTemplateByType(alert.attributes.type);
		return this.sendWithTemplate(alertTemplate, templateProperties);
	}

	resetPasswordToken (person) {
		const templateProperties = {
			email: person.get('email'),
			url: `${Config.get(
				'general.domain'
			)}forgot/?token=${person.resetPasswordToken()}`,
			type: 'reset-password'
		};
		return this.sendWithTemplate(
			this.templates.resetPasswordToken,
			templateProperties
		);
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

module.exports = new Email();
