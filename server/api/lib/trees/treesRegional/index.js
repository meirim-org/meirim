const Log = require('../../log');
const fs = require('fs');
const xlsx = require('xlsx');
const fetch = require('node-fetch');
const moment = require('moment');

const TreePermit = require('../../../model/tree_permit');
const tpc = require('../../../model/tree_permit_constants');
const database = require('../../../service/database');

// Pending cutting are marked with class "ms-rteTableEvenCol-default"
// and the files are named "Befor-<region>.xls" (typo in origin)

// const REGIONAL_TREES_URL = 'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Pages/default.aspx';
const REGIONAL_TREES_URL_WESTERN_GALIL_UPPER_GALIL_GOLAN = 'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_galil_golan.XLS';

// const path = '/Users/galia/Downloads/trees/galil-golan-' + moment().format('YYYY-MM-DD-hh-mm-ss') + '.xls';
const path = '/Users/galia/Downloads/trees/galil-golan-7.xls';
console.log(path);
async function DownloadTreesXLSFile(url, path) {

	try {

		console.log('Fetching trees file... ' + `${url}`);

		const res = await fetch(url);		
		const dest = fs.createWriteStream(path);
		dest.on('open', () => {
			res.body.pipe(dest);
		});
		
		console.log('Sucessfully Download trees file:' 
		+ `${url}`
		+'\nFile Could be found here: ' 
		+ `${path}`);
	}
	catch (err) {
		console.log(err);
	}
	console.log('Done!');
}

const getTreesApproved = () => {
	// Pending cutting are marked with class "ms-rteTableOddCol-default"
	// and the files are named "After-<region>.xls" 

	//compare to existing tree list

	console.log('hi!');
};

async function saveNewTreePermits(tree_permits) {
	
	// tree permits are published for objecctions for a period of 2 weeks. taking a 12 months
	// buffer should be enough for human to remove those lines from the excel sheet.
	//We're reading a the rows as a bulk and match them at compute time for performance.

	//compare to existing tree list in db by region
	//save only the new ones

	// all tree permits in a chunk should be from the same regional office
	const regional_office = tree_permits[0].attributes[tpc.REGIONAL_OFFICE];
	// this is the only timestamp format knex correcrtly work with 
	const time_ago = moment().subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ssZ'); 
	const existing_permits_compact = new Set();
	await database.Knex(tpc.TREE_PERMIT_TABLE).where( 'updated_at', '>' ,time_ago.toString())
		.andWhere(tpc.REGIONAL_OFFICE, regional_office)
		.then(rows => {
			for (let row of rows) {
				const key_as_string = 
				[
					row[tpc.PERMIT_NUMBER],
					row[tpc.TREE_NAME],
					row[tpc.NUMBER_OF_TREES],
					row[tpc.END_DATE]
				].join('_');
				existing_permits_compact.add(key_as_string	);
			}
		})
		.catch(function(error) { console.error(error); });

	const new_tree_permits = tree_permits.map(tp => {
		//if tp is not in the hash map of the existing one - add to the new ones
		const compact_tp = 
		[
			tp.attributes[tpc.PERMIT_NUMBER],
			tp.attributes[tpc.TREE_NAME],
			tp.attributes[tpc.NUMBER_OF_TREES],
			tp.attributes[tpc.END_DATE]
		].join('_');

		if (existing_permits_compact.has(compact_tp)) {
			console.log('Already has ' + compact_tp);
		}
		else {
			console.log('A new one! queued for saving ' + compact_tp);
			return tp; //original one, not compact
		}
	}).filter(Boolean) ; // remove undefined values

	//save only the new ones
	try {
		new_tree_permits.map(tp => {
			console.log('saving ....');
			tp.save();
		});
	}
	catch (err){
		console.log(err);
	}

	return new_tree_permits;
}

const parseTreesXLS = (filename) => {
	
	const workbook = xlsx.readFile(filename);
	const sheet = workbook.Sheets['Data2ToExcel_BeforDate'];
	const trees_csv = xlsx.utils.sheet_to_csv(sheet, {FS: '|'});

	const rows = trees_csv.split('\n');
	// slice 1 - ignore the header and the empty line at the end, caused by the conversion to csv
	const tree_permits =rows.slice(1,-1).map((row) => {
//		console.log(row);
		row= row.split('|');

		return new TreePermit(
			{
				[tpc.REGIONAL_OFFICE]: row[0],
				[tpc.PERMIT_NUMBER]: row[1],
				[tpc.ACTION]: row[2], // cutting , copying
				[tpc.PERMIT_ISSUE_DATE]: row[3],
				[tpc.PERSON_REQUEST_NAME]: row[4],
				[tpc.START_DATE]: row[12],
				[tpc.END_DATE]: row[13],
				[tpc.LAST_DATE_TO_OBJECTION]: row[14],
				[tpc.APPROVER_NAME]: row[15],
				[tpc.APPROVER_TITLE]: row[16],

				// Location
				[tpc.PLACE]: row[7],
				[tpc.STREET]: row[8],
				[tpc.STREET_NUMBER]: row[9],
				[tpc.GUSH]: row[10],
				[tpc.HELKA]: row[11],
				
				// Trees details
				[tpc.TREE_NAME]: row[18],
				[tpc.TREE_KIND]: row[17],
				[tpc.NUMBER_OF_TREES]: row[19],
				[tpc.REASON_SHORT]: row[5],
				[tpc.REASON_DETAILED]: row[6],
				[tpc.COMMENTS_IN_DOC]: row[20]

			}			
		);
	});
	return tree_permits;
};

module.exports = {
	getTreesPendingApproval: DownloadTreesXLSFile,
	//getTreesApproved
};

DownloadTreesXLSFile(REGIONAL_TREES_URL_WESTERN_GALIL_UPPER_GALIL_GOLAN, path);
const tree_permits = parseTreesXLS(path);
// extract fields
const new_tree_permits = saveNewTreePermits(tree_permits);
console.log('Done! extracted ' + new_tree_permits.length +' new permits from: ' + path );

