const HummusRecipe = require('hummus-recipe');
const hummus = require('hummus');

const fs = require('fs');
const util = require('util');
const path = require('path');
const log = require('../../log');

const { extractPdfData } = require('./parser/');

const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);

const processPlanInstructionsFile = async (fileDir) => {
	const files = await readdir(fileDir);

	const pdfs = files.filter(fileName => fileName.endsWith('.pdf'));

	if (pdfs.length > 0) {
		const pdfFileName = pdfs[0];
		let filePath = path.join(fileDir, pdfFileName);
		let fileSizeInMB = fs.statSync(filePath).size / (1024 * 1024);

		let numberOfIter = 0;

		// the pdf extension that we are using to read table 3.2 is very problematic in memory usage.
		// we know that the end of plans can contain heavy drawings.
		// if the file is larger than 3 MB, the plan contains these drawings and we remove each page at a time
		// until we got a decent file size.
		while (fileSizeInMB > 3) {

			const instream  = new hummus.PDFRStreamForFile(filePath);
			const pdfReader = hummus.createReader(instream);
			const pageCount = pdfReader.getPagesCount();
			instream.close();

			const pagesToAdd = [];
			// everything but the last page
			for (let i = 1; i < pageCount; i++) {
				pagesToAdd.push(i);
			}

			const pathOfNewPdf = path.join(fileDir, `anotherTemp${numberOfIter}.pdf`);
			const pdfDoc = new HummusRecipe('new', pathOfNewPdf);
			pdfDoc
				.appendPage(filePath, pagesToAdd)
				.endPDF();

			filePath = pathOfNewPdf;
			fileSizeInMB = fs.statSync(filePath).size / (1024 * 1024);

			numberOfIter++;

		}

		const data = await extractPdfData(filePath);
		return data;
	}

	return undefined;
};

const clearOldPlanFiles = async (fileDir) => {
	let files;

	try {
		files = await readdir(fileDir);
	} catch (e) {
		// the directory is not there
		if (e.code === 'ENOENT') {
			try {
				// try to create the directory
				await mkdir(fileDir);
				// if we created it, it's empty and we don't need to clean it
				return;
			} catch (e) {
				log.error('error getting files');
			}
		}
	}

	for (let i = 0; i < files.length; i++) {
		try {
			await unlink(path.join(fileDir, files[i]));
			log.info(`trying to delete file ${files[i]}`);
		} catch (e) {
			log.error('error deleting a file');
		}
	}
};

module.exports = {
	processPlanInstructionsFile,
	clearOldPlanFiles
};
