/**
 * Dynamic Template Email service.
 * Compiles emails and pushes to an email web service.
 */
const Promise = require('bluebird');
const Nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
 
const Juice = require('juice');
const Log = require('../lib/log');
const Config = require('../lib/config');
const Alert = require('../model/alert');
 
class DynamicTemplateEmail {
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
		 this.dynamicTemplates = {
			 DigestPlanAlert: 'd-db0b55ab042e4ba9878715acd35c1d6c'
		 };
 
		 sgMail.setApiKey('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');
	 }

	 digestPlanAlert (recipient, emailPlanParams, emailAlertParams) {
		 const email = {
			 from: `"${this.config.from_name}" <${this.config.from_email}>`, // sender address
			 to: recipient,
			unsubscribeLink: `${this.baseUrl}${emailAlertParams.unsubscribeLink}`,
			 personalizations:[
				 {
					 'to':[{
						 'email': recipient
					 }
					 ],
					'dynamic_template_data': {
						 ...emailPlanParams,
						 ...emailAlertParams
					 }
				 }
			  ],
			  attachments: [
				{
					cid: 'planmap',
					content_id: 'planmap',
					filename: 'plan_map.png',
					content: emailPlanParams.firstPlan.map,
					encoding: 'base64',
					disposition: 'inline',
				},
				{
					cid: 'secondplanmap',
					content_id: 'secondplanmap',
					filename: 'second_plan_map.png',
					content: emailPlanParams.secondPlan.map,
					encoding: 'base64',
					disposition: 'inline',
				}
			],
			 template_id : this.dynamicTemplates.DigestPlanAlert,
		 };
		  return sgMail
			 .send(email)
			 .then((res) => {
		   console.log('Email sent');
			 })
			 .catch((error) => {
		   console.error(error);
			 });
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
 
module.exports = new DynamicTemplateEmail();
 