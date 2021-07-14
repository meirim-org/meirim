const http = require('follow-redirects').http;
const Log = require('../lib/log');

const downloadChallengedFile = (url, file, options, protocol) => {
	return new Promise((resolve) => {
		Log.info(`in downloadChallangedFile. url is ${url}`);
		Log.info('protocol:', protocol);
		Log.info('options.signal', options.signal);
		options = options || {};
		protocol = protocol || http ;
		Log.info('protocol2:', protocol);

		protocol.get(url, options, (response) => {
			Log.info('protocol get');
			if (response.statusCode !== 200) {
				Log.error(`downloadChallengedFile failed with status ${response.statusCode} for url ${url}`);
				resolve(false);
			} else {
				const contentType = response.headers['content-type'] || '';
				// if content-type is text/html this isn't the file we wish to download but one
				// of the challenge stages
				Log.info(`content type is ${contentType}`);
				if (contentType.startsWith('text/html')) {
					// if we didn't get a cookie yet this is the first part of the challenge -
					// the page source contains the javascript code we need to run and challenge
					// paramters for the calculation
					if (!('set-cookie' in response.headers)) {
						Log.info(`no set cookie, response headers; ${response.headers}`);

						// download the entire response so we can solve the challenge
						let responseData = '';
						response.on('data', (chunk) => { responseData += chunk; });
						response.on('end', () => {
							if (responseData.indexOf('ChallengeId=') > -1) {
								// extract challenge params
								const challenge = parseChallenge(responseData);

								Log.info('challenge',challenge);

								// send the request again with the challenge headers
								
								Log.info(`no cookie, re send DCF with ${url}`);	
								downloadChallengedFile(url, file, {
									agent: new protocol.Agent(),
									headers: {
										'X-AA-Challenge': challenge.challenge,
										'X-AA-Challenge-ID': challenge.challengeId,
										'X-AA-Challenge-Result': challenge.result
									}
								}, protocol).then((res) => resolve(res));
							} else {
								Log.error(`url content type was html, but response contained no challenge: "${responseData.substr(0, 50)}..."`);
								resolve(false);
							}
						});
					} else {
						// if we did get a cookie we completed the challenge successfuly and
						// should use it to download the file
						Log.info(`yes cookie, re send DCF with ${url},  options: ${options}`);	
						downloadChallengedFile(url, file, {
							agent: new protocol.Agent(),
							headers: {
								'Cookie': response.headers['set-cookie']
							}
						}, protocol).then((res) => resolve(res));
					}
				} else {
					// this is the actual file, so pipe the response into the supplied file
					Log.info(`managed to get the file! ${url},  options: ${options}`);	
					response.pipe(file);
					file.on('finish', async function () {
						await file.close();
						resolve(true);
					});
				}
			}
		}).on('error', (err) => {
			Log.error(err);
			resolve(false);
		});
	});
};

const parseChallenge = (pageSrc) => {
	// parse a challenge given by mavat's web servers, forcing us to solve a math
	// challenge and send the result as a header to actually get the page.
	// copied from https://github.com/niryariv/opentaba-server/blob/ab15e51bb1ae4733954827d51961bb72796052fd/lib/helpers.py#L109
	const top = pageSrc.split('<script>')[1].split('\n');
	const challenge = top[1].split(';')[0].split('=')[1];
	const challengeId = top[2].split(';')[0].split('=')[1];
	return { challenge, challengeId, result: solveChallenge(challenge) };
};

const solveChallenge = (challenge) => {
	// solve mavat's page challenge.
	// copied from the original challenge since it is javascript code to begin with
	var var_str = '' + challenge;
	var var_arr = var_str.split('');
	var LastDig = var_arr.reverse()[0];
	var minDig = var_arr.sort()[0];
	var subvar1 = (2 * (var_arr[2])) + (var_arr[1] * 1);
	var subvar2 = (2 * var_arr[2]) + var_arr[1];
	var my_pow = Math.pow(((var_arr[0] * 1) + 2), var_arr[1]);
	var x = (challenge * 3 + subvar1) * 1;
	var y = Math.cos(Math.PI * subvar2);
	var answer = x * y;
	answer -= my_pow * 1;
	answer += (minDig * 1) - (LastDig * 1);
	answer = answer + subvar2;
	return answer;
};


module.exports = {
	downloadChallengedFile
};



