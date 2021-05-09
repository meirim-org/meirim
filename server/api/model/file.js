const Model = require('./base_model');

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
	SHP: 'SHP',
	SHP_ZIP: 'SHP_ZIP',
	JPG: 'JPG',
	PNG: 'PNG',
	DOCX: 'DOCX',
	DOC: 'DOC',
	PPTX: 'PPTX',
	PPT: 'PPT',
	XLSX: 'XLSX',
	XLS: 'XLS',
	MSG: 'MSG',
	ZIP: 'ZIP',
    UNKNOWN: 'UNKNOWN'
};

class File extends Model {
	get rules() {
		return {
			plan_id: 'integer',
			tree_id: 'integer',
			type: ['required', 'string'],
			extension: ['required', 'string'],
			link: ['required', 'string'],
			source: ['required', 'string'],
			name: ['required', 'string']
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
}

module.exports = File;
