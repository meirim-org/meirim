const aws = require('aws-sdk');
const Config = require('../lib/config');
const Log = require('../lib/log');

const s3 = new aws.S3({
    accessKeyId: Config.get('aws.accessKeyId'),
    secretAccessKey: Config.get('aws.secretAccessKey')
});

async function uploadToS3(keyName, bucketName, data) {
	const objectParams = { Bucket: bucketName, Key: keyName, Body: JSON.stringify(data)};
    try {
        const res = await s3.upload(objectParams).promise();
        Log.info(`Successfully Uploaded to ${bucketName}/${keyName}. Result: ${JSON.stringify(res)}`);
    } catch (err) {
        Log.error(err);
    }
}

module.exports = {
    uploadToS3
}