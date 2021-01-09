const fs = require('fs');
const path = require('path');
const os = require('os');

const sinon = require('sinon');

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

exports.wait = async timeInSeconds => {
	const time = parseInt(timeInSeconds) * 1000;
	await delay(time);
};

exports.fakeEmailVerification = sinon.fake(function(email, options, cb) {
	if (email && email.toLowerCase().endsWith('@meirim.org')) {
		cb(null, {success: true, code: 1, banner: 'string'});
	} else {
		const domain = email.split(/[@]/).splice(-1)[0].toLowerCase();
		cb(new Error(`queryMx ENOTFOUND ${domain}`), {success: false, code: 5});
	}
});

exports.createTempFile = fileName => {
	return new Promise((resolve) => {
		const fileStream = fs.createWriteStream(path.join(os.tmpdir(), fileName));

		// wait for stream to emit the open event as the file is not yet created until then
		fileStream.on('open', () => {
			resolve(fileStream);
		});
	});
};
