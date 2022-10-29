const { File } = require('../../../model');

const FILE_TYPES = File.getFileTypes();
const FILE_SOURCES = File.getFileSources();

const isKML3d = ({ kind, name }) => {
	return kind === 'קבצים דיגיטליים' && name.includes('KML') && name.includes('תלת מימד');
};

const isSHPZip = ({ name, fileIcon }) => {
	return name.includes('SHP') && fileIcon.includes('ZIP');
};

const isMSG = ({ kind, fileIcon }) => {
	return (kind === 'תכתובת' || kind.trim() === 'msg') && fileIcon.includes('file.gif');
};

const getFileType = (file) => {
	if (isKML3d(file)) return FILE_TYPES.KML3D;
	else if (isSHPZip(file)) return FILE_TYPES.SHP_ZIP;
	else if (file.name.includes('KML')) return FILE_TYPES.KML;
	else if (file.fileIcon.includes('PDF')) return FILE_TYPES.PDF;
	else if (file.fileIcon.includes('DWG')) return FILE_TYPES.DWG;
	else if (file.fileIcon.includes('JPG')) return FILE_TYPES.JPG;
	else if (file.fileIcon.includes('PNG')) return FILE_TYPES.PNG;
	else if (file.fileIcon.includes('DOCX')) return FILE_TYPES.DOCX;
	else if (file.fileIcon.includes('DOC')) return FILE_TYPES.DOC;
	else if (file.fileIcon.includes('PPTX')) return FILE_TYPES.PPTX;
	else if (file.fileIcon.includes('PPT')) return FILE_TYPES.PPT;
	else if (file.fileIcon.includes('XLSX')) return FILE_TYPES.XLSX;
	else if (file.fileIcon.includes('XLS')) return FILE_TYPES.XLS;
	else if (file.fileIcon.includes('ZIP')) return FILE_TYPES.ZIP;
	else if (isMSG(file)) return FILE_TYPES.MSG;
	else return FILE_TYPES.UNKNOWN;
};

const getFileExtension = (file) => {
	if (isKML3d(file)) return 'kml';
	else if (isSHPZip(file)) return 'zip';
	else if (file.name.includes('KML')) return 'kml';
	else if (file.fileIcon.includes('PDF')) return 'pdf';
	else if (file.fileIcon.includes('DWG')) return 'dwg';
	else if (file.fileIcon.includes('JPG')) return 'jpg';
	else if (file.fileIcon.includes('PNG')) return 'png';
	else if (file.fileIcon.includes('DOCX')) return 'docx';
	else if (file.fileIcon.includes('DOC')) return 'doc';
	else if (file.fileIcon.includes('PPTX')) return 'pptx';
	else if (file.fileIcon.includes('PPT')) return 'ppt';
	else if (file.fileIcon.includes('XLSX')) return 'xlsx';
	else if (file.fileIcon.includes('XLS')) return 'xls';
	else if (file.fileIcon.includes('ZIP')) return 'zip';
	else if (isMSG(file)) return 'msg';
	else return '';
};

const getFileUrl = (id, num) => {
	if(!id || !num) return false;
	
	return `https://mavat.iplan.gov.il/rest/api/Attacments/?eid=${id}&edn=${num}`;
};

const formatFile = (file) => {
	return {
		name: file.name,
		link: getFileUrl(file.id, file.num),
		type: getFileType(file),
		extension: getFileExtension(file),
		source: FILE_SOURCES.MAVAT
	};
};

module.exports = { 
	formatFile,
	getFileUrl
};
