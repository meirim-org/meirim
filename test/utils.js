
const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

exports.wait = async timeInSeconds => {
	const time = parseInt(timeInSeconds) * 1000;
	await delay(time);
};

