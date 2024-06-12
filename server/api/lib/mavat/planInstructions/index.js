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
		// we just want the one file, at least for now
		const filePath = path.join(fileDir, pdfs[0]);	
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
