const assert = require('chai').assert;
const nock = require('nock');
const fs = require('fs');
const crypto = require('crypto');

const { createTempFile } = require('../../utils');

const { downloadChallengedFile } = require('../../../api/lib/mavat').testOnly;

describe('Challenged file download', function() {
	beforeEach(async function() {
		// make sure nock is active
		if (!nock.isActive())
			nock.activate();
	});

	afterEach(async function() {
		// restore unmocked networking
		nock.restore();
	});

	it('should handle errors properly', async function() {
		// mock mavat unchallenged pdf file
		const mavatScope = nock('http://mavat.moin.gov.il')
			.get('/MavatPS/Forms/Attachment.aspx')
			.query({
				edid: 1,
				edn: 'FAKEEDN',
				opener: 'AttachmentError.aspx'
			})
			// reply with a not-found error
			.reply(404, 'page not found');

		// create a temporary file for the result to be written to
		const resFile = await createTempFile(`${crypto.randomBytes(8).toString('hex')}.pdf`);

		// try to download the file
		const resSuccess = await downloadChallengedFile(
			'http://mavat.moin.gov.il/MavatPS/Forms/Attachment.aspx?edid=1&edn=FAKEEDN&opener=AttachmentError.aspx',
			resFile, {}
		);

		// make sure all mocked urls were accessed
		mavatScope.done();

		// make sure the result was not successful and that nothing was written to the file
		assert.equal(resSuccess, false, 'download should not be successful');
		assert.equal(fs.readFileSync(resFile.path), '', 'file contents should be empty');

		// delete the temporary file
		fs.unlinkSync(resFile.path);
	});

	it('should handle non-challenged html pages', async function() {
		// mock mavat unchallenged pdf file
		const mavatScope = nock('http://mavat.moin.gov.il')
			.get('/MavatPS/Forms/Attachment.aspx')
			.query({
				edid: 1,
				edn: 'FAKEEDN',
				opener: 'AttachmentError.aspx'
			})
			// reply with a not-found error
			.reply(
				200,
				'<html><body>no challenge here</body></html>',
				{ 'Content-Type': 'text/html' }
			);

		// create a temporary file for the result to be written to
		const resFile = await createTempFile(`${crypto.randomBytes(8).toString('hex')}.pdf`);

		// try to download the (un)challenged file
		const resSuccess = await downloadChallengedFile(
			'http://mavat.moin.gov.il/MavatPS/Forms/Attachment.aspx?edid=1&edn=FAKEEDN&opener=AttachmentError.aspx',
			resFile, {}
		);

		// make sure all mocked urls were accessed
		mavatScope.done();

		// make sure the result was not successful and that nothing was written to the file
		assert.equal(resSuccess, false, 'download should not be successful');
		assert.equal(fs.readFileSync(resFile.path), '', 'file contents should be empty');

		// delete the temporary file
		fs.unlinkSync(resFile.path);
	});

	it('should fetch unchallenged file', async function() {
		// mock mavat unchallenged pdf file
		const mavatScope = nock('http://mavat.moin.gov.il')
			.get('/MavatPS/Forms/Attachment.aspx')
			.query({
				edid: 1,
				edn: 'FAKEEDN',
				opener: 'AttachmentError.aspx'
			})
			// reply with a fake file with pdf content-type
			.reply(200, 'fake-file-contents', { 'Content-Type': 'application/pdf' });

		// create a temporary file for the result to be written to
		const resFile = await createTempFile(`${crypto.randomBytes(8).toString('hex')}.pdf`);

		// try to download the (un)challenged file
		const resSuccess = await downloadChallengedFile(
			'http://mavat.moin.gov.il/MavatPS/Forms/Attachment.aspx?edid=1&edn=FAKEEDN&opener=AttachmentError.aspx',
			resFile, {}
		);

		// make sure all mocked urls were accessed
		mavatScope.done();

		// make sure the result was successful and the file contains the correct data
		assert.equal(resSuccess, true, 'download should be successful');
		assert.equal(fs.readFileSync(resFile.path), 'fake-file-contents', 'file contents should be correct');

		// delete the temporary file
		fs.unlinkSync(resFile.path);
	});

	it('should fetch challenged file', async function() {
		// mock mavat unchallenged pdf file
		const mavatScope = nock('http://mavat.moin.gov.il')
			.get('/MavatPS/Forms/Attachment.aspx')
			.query({
				edid: 1,
				edn: 'FAKEEDN',
				opener: 'AttachmentError.aspx'
			})
			// reply with challenge page
			.replyWithFile(
				200,
				`${__dirname}/files/challenge.html`,
				{ 'Content-Type': 'text/html' }
			)
			.get('/MavatPS/Forms/Attachment.aspx')
			.query({
				edid: 1,
				edn: 'FAKEEDN',
				opener: 'AttachmentError.aspx'
			})
			.matchHeader('X-AA-Challenge', '691443')
			.matchHeader('X-AA-Challenge-ID', '85836233')
			.matchHeader('X-AA-Challenge-Result', '-207436983')
			.matchHeader('Cookie', ['BotMitigationCookie_11098923367694517286=\"323000001682496739UTkNrfYpDVmhIvINfzH1TyqGB+4=\"; path=/'])
			// reply with challenge-success cookie
			.reply(200, '', {
				'Content-Type': 'text/html',
				'Set-Cookie': 'BotMitigationCookie_8542922468160446851="101523001608416663q2PEpM3J8h035u5gkG6n0XjGh+4="; path=/',
				'X-AA-Cookie-Value': 'BotMitigationCookie_8542922468160446851="101523001608416663q2PEpM3J8h035u5gkG6n0XjGh+4="'
			})
			.get('/MavatPS/Forms/Attachment.aspx')
			.query({
				edid: 1,
				edn: 'FAKEEDN',
				opener: 'AttachmentError.aspx'
			})
			.matchHeader('Cookie', 'BotMitigationCookie_8542922468160446851="101523001608416663q2PEpM3J8h035u5gkG6n0XjGh+4="; path=/')
			// reply with redirect to https
			.reply(302, undefined, { 'Location': 'https://mavat.moin.gov.il/MavatPS/Forms/Attachment.aspx?edid=1&edn=FAKEEDN&opener=AttachmentError.aspx' });

		const sslMavatScope = nock('https://mavat.moin.gov.il')
			.get('/MavatPS/Forms/Attachment.aspx')
			.query({
				edid: 1,
				edn: 'FAKEEDN',
				opener: 'AttachmentError.aspx'
			})
			.matchHeader('Cookie', 'BotMitigationCookie_8542922468160446851="101523001608416663q2PEpM3J8h035u5gkG6n0XjGh+4="; path=/')
			// reply with a fake file with pdf content-type
			.reply(200, 'fake-file-contents', { 'Content-Type': 'application/pdf' });

		// create a temporary file for the result to be written to
		const resFile = await createTempFile(`${crypto.randomBytes(8).toString('hex')}.pdf`);

		// try to download the challenged file
		const resSuccess = await downloadChallengedFile(
			'http://mavat.moin.gov.il/MavatPS/Forms/Attachment.aspx?edid=1&edn=FAKEEDN&opener=AttachmentError.aspx',
			resFile, {}
		);

		// make sure all mocked urls were accessed
		mavatScope.done();
		sslMavatScope.done();

		// make sure the result was successful and the file contains the correct data
		assert.equal(resSuccess, true, 'download should be successful');
		assert.equal(fs.readFileSync(resFile.path), 'fake-file-contents', 'file contents should be correct');

		// delete the temporary file
		fs.unlinkSync(resFile.path);
	});
});
