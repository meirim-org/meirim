const Log = require('../../log');
const fs = require('fs');
const xlsx = require('xlsx');
const fetch = require('node-fetch');
const TreePermit = require('../../../model/tree_permit');



	// Pending cutting are marked with class "ms-rteTableEvenCol-default"
	// and the files are named "Befor-<region>.xls" (typo in origin)

const REGIONAL_TREES_URL = 'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Pages/default.aspx';
const REGIONAL_TREES_URL_WESTERN_GALIL_UPPER_GALIL_GOLAN = 'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_galil_golan.XLS';
const path = '/Users/galia/Downloads/trees/galil_golan5.xls';


async function DownloadTreesXLSFile(url, path) {

	try {

		console.log('Fetching trees file... ' + `${REGIONAL_TREES_URL_WESTERN_GALIL_UPPER_GALIL_GOLAN}`);

		const res = await fetch(REGIONAL_TREES_URL_WESTERN_GALIL_UPPER_GALIL_GOLAN);		
		const dest = fs.createWriteStream(path);
		res.body.pipe(dest);

		console.log('Sucessfully Download trees file:' 
		+ `${REGIONAL_TREES_URL_WESTERN_GALIL_UPPER_GALIL_GOLAN}`
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

const saveToDB = () => {
	//compare to existing tree list
	
	//save only the new ones
	console.log('hi!');
};


const parseTreesXLS = (filename) => {
	
	const workbook = xlsx.readFile(filename);
	const sheet = workbook.Sheets['Data2ToExcel_BeforDate'];
	const trees_csv = xlsx.utils.sheet_to_csv(sheet, {FS: '|'});

	const rows = trees_csv.split('\n');

	const tree_permits =rows.map( (row) => {
		console.log(row);
		row= row.split('|');
		return new TreePermit(
			{
				region: row[0],
				permit_number: row[1],
				action: row[2], // cutting , copying
				permit_issue_date: row[3],
				person_request_name: row[4],
				start_date: row[12],
				end_date: row[13],
				last_date: row[14],
				approver_name: row[15],
				approver_title: row[16],

				// Location
				place: row[7],
				street: row[8],
				street_number: row[9],
				gush: row[10],
				helka: row[11],
				
				// Trees details
				tree_name: row[18],
				tree_kind: row[17],
				trees_number: row[19],
				reason_short: row[5],
				reason_detailed: row[6],
				comments_in_doc: row[20]

			}			
		);
	});
	//map xls columns to fields

	console.log({tree_permits});
	return tree_permits;
};

module.exports = {
	getTreesPendingApproval: DownloadTreesXLSFile,
	getTreesApproved
};

DownloadTreesXLSFile(REGIONAL_TREES_URL_WESTERN_GALIL_UPPER_GALIL_GOLAN, path);
const tree_permits = parseTreesXLS(path);
// extract fields
//save to db