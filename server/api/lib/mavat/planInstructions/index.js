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

	try {
		const files = await readdir(fileDir);

		const pdfs = files.filter(fileName => fileName.endsWith('.pdf'));

		if (pdfs.length > 0) {
			const pdfFileName = pdfs[0];
			let filePath = path.join(fileDir, pdfFileName);
			let fileSizeInMB = fs.statSync(filePath).size / (1024 * 1024);


			// the pdf extension that we are using to read table 3.2 is very problematic in memory usage.
			// we know that the end of plans can contain heavy drawings.
			// if the file is larger than 3 MB, the plan contains these drawings.
			// We remove those drawings by looking at the pages size.
			// Pages that contains text have a unique size of around 595 on 842 (or filpped)
			// If the page is not at that size, it contains a drawing
			if (fileSizeInMB > 3) {

				const instream = new hummus.PDFRStreamForFile(filePath);
				const pdfReader = hummus.createReader(instream);
				const pageCount = pdfReader.getPagesCount();

				let lastFinePage = 0;
				for (let i = 0; i < pageCount; i++) {
					const boxForPage = pdfReader.parsePage(i).getMediaBox();

					if ((Math.abs(boxForPage[2] - 595) < 3 && Math.abs(boxForPage[3] - 842) < 3) ||
						(Math.abs(boxForPage[3] - 595) < 3 && Math.abs(boxForPage[2] - 842) < 3)) {  // it can be flipped (table 5 page for example)
						continue;
					}

					// if we got here, this is a page that is not fine
					// it's not i - 1 because Hummus Recipe page index is starting at 1 (and this is starting at 0)
					lastFinePage = i;
					break;
				}

				instream.close();

				if (lastFinePage !== 0) {

					// everything but the last page
					const pagesToAdd = [...Array(lastFinePage).keys()];

					const strippedPdfPath = path.join(fileDir, 'strippedTemp.pdf');
					const pdfDoc = new HummusRecipe('new', strippedPdfPath);
					pdfDoc
						.appendPage(filePath, pagesToAdd)
						.endPDF();

					filePath = strippedPdfPath;
				}
			}

			const data = await extractPdfData(filePath);
			return data;
		}

	}
	
	catch(e) {
		log.error('processPlanInstructionsFile error:\n' + e);
	}
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
