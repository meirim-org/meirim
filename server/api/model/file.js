const Model = require('./base_model');
const Exception = require('./exception');

const FILE_SOURCES = {
	MAVAT: 'MAVAT',
	USER: 'USER',
	UNKNOWN: 'UNKNOWN'
};

const FILE_TYPES = {
	KML3D: 'KML3D',
	KML: 'KML',
    SHP: 'SHP',
    PDF: 'PDF',
	DWG: 'DWG',
	PNG: 'PNG',
    UNKNOWN: 'UNKNOWN'
};

class File extends Model {
	get rules() {
		return {
			id: 'integer',
			person_id: 'integer',
			plan_id: 'integer',
			tree_id: 'integer',
			type: 'string',
			file_extension: 'string',
			link: 'string',
			source: 'string',
			name: 'string',
		};
	}	

	get tableName() {
		return 'file';
	}

	defaults() {
		return {
			source: FILE_SOURCES.UNKNOWN,
			type: FILE_TYPES.UNKNOWN
		};
	}

	static getFileTypes() {
		return FILE_TYPES;
	}

	static getFileSources() {
		return FILE_SOURCES;
	}

	static getFilesOfSource ({ sourceId, isPlan}) {
		const fileSource = isPlan? 'plan_id' : 'tree_id';
		return this.query('where', filefileSourcePopulates, '=', sourceId).fetchAll();
	}

	static getFileLinkById ({ fileId }) {
		return this.query('where', id, '=', fileId).first().then(file=> file.link)
	}

	static getPlan3DKMLContent ({ plan_id, fileFormat}) {
		const tempFileUrl = 'https://mavat.moin.gov.il/MavatPS/Forms/Attachment.aspx?edid=77000663466169&edn=49E156E9C248E7986FA2874249FE6773C4E3A17EA2BE227DFD519668864493BA&opener=AttachmentError.aspx';
		return this.query('where', 'plan_id', '=', plan_id).first().then(file =>{
			// Downloading file content, and formatting it
		}).fetchAll();
	}
}

module.exports = File;
