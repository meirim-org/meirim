const stream = require('stream');
const axios = require('axios');
const Log = require('../lib/log');
const { promisify } = require('util');

const finished = promisify(stream.finished);

const downloadChallengedFile = async (url, file, options) => {
	try {	
		options.responseType = 'stream';
		const response = await axios.get(url, options);
		if (response.status !== 200) {
			Log.error(`downloadChallengedFile failed with status ${response.status} for url ${url}`);
			return Promise.resolve(false);
		}
		const contentType = response.headers['content-type'] || '';
		// if content-type is text/html this isn't the file we wish to download but one
		// of the challenge stages
		if (contentType.startsWith('text/html')) {
			if ('set-cookie' in response.headers) {
				options.headers = options.headers || {};
				options.headers['Cookie'] = response.headers['set-cookie'];				
			} else {
				// download the entire response so we can solve the challenge
				let responseData = await fromStreamToString(response.data);
				if (responseData.indexOf('ChallengeId=') > -1) {
					// extract challenge params
					const challenge = parseChallenge(responseData);
					Log.info(`parsed challenge for url ${url}. ${challenge.challenge} = ${challenge.result}`);
					// send the request again with the challenge headers
					options.headers = options.headers || {};
					options.headers['Cookie'] = ['BotMitigationCookie_11098923367694517286=\"323000001682496739UTkNrfYpDVmhIvINfzH1TyqGB+4=\"; path=/'];
					options.headers['X-AA-Challenge'] = challenge.challenge;
					options.headers['X-AA-Challenge-ID'] = challenge.challengeId;
					options.headers['X-AA-Challenge-Result'] = challenge.result;
				} else {
					Log.error(`url content type was html, but response contained no challenge: "${responseData.substr(0, 50)}..."`);
					return Promise.resolve(false);
				}
			}
			return downloadChallengedFile(url, file, options);			
		} else {
			await response.data.pipe(file);
			await finished(file);
			return Promise.resolve(true);
		}
	} catch (err) {
		Log.error('Failed to download file', err);
		return Promise.resolve(false);
	}
};

function fromStreamToString (stream) {
	const chunks = [];
	
	return new Promise((res, rej) => {
	  // when we receive a new chunk, push it to chunks array
	  stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
	  
	  // when we get the 'end' event, call the resolve promise function with the output
	  // of turning the chunks into a string:
	  stream.on('end', () => res(Buffer.concat(chunks).toString('utf8')));
	  
	  // on stream error call the promise reject function:
	  stream.on('error', (err) => rej(err));
	})
  }

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



