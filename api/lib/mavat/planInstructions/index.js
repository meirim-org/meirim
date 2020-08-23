const fs = require('fs');
const util = require('util');
const path = require('path');

const { extractPdfData } = require('./parser/');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

const processPlanInstructionsFile = async (fileDir) => {
    let files;
    let currentTry = 0;

    files = await readdir(fileDir);

    while ((!files || !files.length)  && currentTry < 3){
        // naive way to poll on file download
        await sleep(2000);
        files = await readdir(fileDir);
        currentTry++;
    }

    if (files.length > 0){
        // we just want the one file, at least for now
        const filePath = path.join(fileDir, files[0]);
        const data = await extractPdfData(filePath);
        return data;
    }
};

const clearOldPlanFiles = async (fileDir) => {
    let files;

    try {
        files = await readdir(fileDir);
    } catch (e){
        console.log('error getting files');
    }

    for (let i = 0; i < files.length; i++) {
        try {
            await unlink(path.join(fileDir, files[i]));
            console.log(`trying to delete file ${files[i]}`);
        } catch (e){
            console.log('error deleting a file');
        }
    }
};

module.exports = {
    processPlanInstructionsFile,
    clearOldPlanFiles
};