const { expect } = require("chai");
const { PdfReader, TableParser } = require("pdfreader");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const extractValueAfter = (lines, token) => {
  const idx = lines.map(chars => chars.join('')).findIndex(line => line.startsWith(token.split('').reverse().join('')));
  if (idx < 0) {
    return undefined;
  }
  return lines[idx + 1];
}

const parsePdf = async (buffer) => {
  return new Promise((resolve, reject) => {
    const rows = {}; // indexed by y-position
    const table = new TableParser();
    const nbCols = 4;
    const cellPadding = 20; // each cell is padded to fit 40 characters

    const padColumns = (array, nb) =>
      Array.apply(null, { length: nb }).map((val, i) => array[i] || []);
    // .. because map() skips undefined elements

    const mergeCells = (cells) =>
      (cells || [])
        .map((cell) => cell.text)
        .join("") // merge cells
        .substr(0, cellPadding)
        .padEnd(cellPadding, " "); // padding

    const renderMatrix = (matrix) =>
      (matrix || [])
        .map((row, y) => padColumns(row, nbCols).map(mergeCells).join(" | "))
        .join("\n");
    const xs = [];

    new PdfReader().parseBuffer(buffer, (err, item) => {

      if (err) {
        reject(err)
      } else if (!item) {
        resolve(Object.values(rows));
      } else if (item.text) {
        xs.push(item.x);
        table.processItem(item, Math.round(item.x / 8));

        (rows[item.y] = rows[item.y] || []).push(item.text);
      }
    })
  });
}

const extractPetition = (lines) => {
  const fromToDates = extractValueAfter(lines, 'מתאריך') || [undefined, undefined];
  return {
    licenseNumber: extractValueAfter(lines, 'מספררשיון')?.join('-'),
    originalRequestNumber: extractValueAfter(lines, 'מספרבקשהמקורית')?.join('-'),
    licenseDate: extractValueAfter(lines, 'תאריךרישיון')?.join(''),
    fromDate: fromToDates[0],
    toDate: fromToDates[1],
    licensee: extractValueAfter(lines, 'בעלהרשיון')?.[0],
    street: extractValueAfter(lines, 'רחוב'),
    houseNumber: extractValueAfter(lines, 'מס')?.[0],
    gush: extractValueAfter(lines, 'גוש'),
    helka: extractValueAfter(lines, 'חלקה')?.[0],
  };
}

const downloadAndParse = async (name) => {
  const url = `https://www.tel-aviv.gov.il/Residents/Environment/Trees/${encodeURIComponent(name)}`;
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    }
  });
  if (!res.data) {
    throw new Error(`failed to read PDF ${url}`);
  }

  const lines = await parsePdf(res.data);
  return extractPetition(lines);
}

const extractFellingLicenseFileName = ({ Fields }) => Fields.find(({ InternalName }) => InternalName === 'LinkFilename').Value;

const fetchFellingLicensesForTelAviv = () => {
  const request = {
    "dataSource": {
      "ListId": "1ce9b8f8-5b5a-4b1e-b64e-1e395e294f90",
      "SiteId": "24aa409e-01ed-482e-b0ed-1956972addb1",
      "ViewId": "10011b3a-8fab-4c3a-8dbc-56bec8894d83",
      "WebId": "d14581a0-c790-4272-9c8d-7a1f3956c176"
    },
  };
  return axios.post("https://www.tel-aviv.gov.il/_vti_bin/TlvSP2013PublicSite/TlvList.svc/GetTables", request, {
    "headers": {
      "accept": "application/json; odata=verbose",
      "content-type": "application/json;charset=UTF-8",
      "cache-control": "no-cache",
      "pragma": "no-cache",
    },
  });
}

describe('the tree felling permit extractor', () => {

  it('parses PDF', async () => {

    const fixture = fs.readFileSync(path.resolve(__dirname, 'files', 'tel-aviv-felling-license-sample.pdf'));
    expect(fixture).not.to.be.undefined;
    const lines = await parsePdf(fixture);

    const petition = extractPetition(lines);
    expect(petition).to.haveOwnProperty('licenseNumber', '5572-03');
    expect(petition).to.haveOwnProperty('originalRequestNumber', '5540-03');
    expect(petition).to.haveOwnProperty('licenseDate', '21/11/2022');
    expect(petition).to.haveOwnProperty('fromDate', '05/12/2022');
    expect(petition).to.haveOwnProperty('toDate', '05/04/2023');
    // expect(petition).to.haveOwnProperty('street', 'הטייסים'); currently undefined TODO fix
    expect(petition).to.haveOwnProperty('houseNumber', '124');
    // expect(petition).to.haveOwnProperty('gush', '6141'); currently undefined TODO fix
    expect(petition).to.haveOwnProperty('helka', '136,22');
  })
})

describe('the tree felling list crawler', () => {
  it('fetches live list and parses data to expected success rate', async () => {
    const res = await fetchFellingLicensesForTelAviv();

    const fellingLicenseFileNames = res.data.items.map(extractFellingLicenseFileName);

    expect(fellingLicenseFileNames.length).to.be.greaterThan(0);

    const pdfs = await Promise.all(fellingLicenseFileNames.map(downloadAndParse));

    const parsedLicenses = pdfs.filter(({ licenseNumber }) => !!licenseNumber);

    console.log(`read ${pdfs.length} petitions and managed to parse ${parsedLicenses.length}`);
    expect(parsedLicenses.length).to.be.greaterThan(pdfs.length * 0.8);
  })
})
