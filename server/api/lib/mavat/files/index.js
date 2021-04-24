const { File } = require('../../../model');

const FILE_TYPES = File.getFileTypes();
const FILE_SOURCES = File.getFileSources();

const getFileType = (file) => {
    if(isKML3d(file)) return FILE_TYPES.KML3D;
    if (file.name.includes('KML')) return FILE_TYPES.KML;
    if (file.file_icon.includes('PDF')) return FILE_TYPES.PDF;
    if (file.file_icon.includes('SHP')) return FILE_TYPES.SHP;
    if (file.file_icon.includes('DWG')) return FILE_TYPES.DWG;
    return FILE_TYPES.UNKNOWN;
}

const isKML3d = ( { kind, name } ) => {
	return kind=== 'קבצים דיגיטליים' && name.includes('KML') && name.includes('תלת מימד');
};

const getFileExtension = ( file ) => {
    if (isKML3d(file)) return 'kml';
    if (file.file_icon.includes('PDF')) return 'pdf';
    if (file.file_icon.includes('SHP')) return 'shp';
    if (file.file_icon.includes('DWG')) return 'dwg';
    return '';
}

const getFileUrl = ( openDocString ) => {

	if (openDocString === undefined) {
		return false;
	}

	// functionCallText is in the format `openDoc(X, Y)`
	// where X can be `'6000611696321'` for example
	// and Y can be `'0F249F3C4F7BC0CB0F1AB48D496389B23D5A3144FBBB0E125CC5472DE98A40AE'` for example
	// we wish to find X and Y, so we look for substrings that has numbers and letters between two ' chars.
	const matches = openDocString.match(/'[\dA-Z]+'/g);
	if (matches === null) {
		return false;
	}

	const entityDocId = matches[0].slice(1, matches[0].length - 1); // without the beginning and ending quotes
	const entityDocNumber = matches[1].slice(1, matches[1].length - 1);

	const downloadUrl = `http://mavat.moin.gov.il/MavatPS/Forms/Attachment.aspx?edid=${entityDocId}&edn=${entityDocNumber}&opener=AttachmentError.aspx`;

	return downloadUrl;
}

const formatFile = (file) => {
    //await new PlanChartOneEightRow(chartsOneEight[i]).save(null, {transacting: transaction});
    return {
        name: file.name,
        url_path: getFileUrl(file.open_doc),
        type: getFileType(file),
        extension: getFileExtension(file),
        source: FILE_SOURCES.MAVAT
    }
}

module.exports = { 
    formatFile,
    getFileUrl
}