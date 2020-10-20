const sinon = require('sinon');

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

exports.wait = async timeInSeconds => {
	const time = parseInt(timeInSeconds) * 1000;
	await delay(time);
};


// exports.fakeEmailVerification =  sinon.fake(function(email, options, cb) {
// 	if (email && email.toLowerCase().endsWith('@meirim.org')) {
// 		cb(null, {success: true, code: 1, banner: 'string'});
// 	} else {
// 		const domain = email.split(/[@]/).splice(-1)[0].toLowerCase();
// 		cb(new Error(`queryMx ENOTFOUND ${domain}`), {success: false, code: 5});
// 	}
// });