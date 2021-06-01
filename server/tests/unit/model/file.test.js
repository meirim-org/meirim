const expect = require('chai').expect;
const { File } = require('../../../api/model');

const FILE_TYPES = File.getFileTypes();
const FILE_SOURCES = File.getFileSources();

describe('file model', function() {
	let instance;
	beforeEach(function () {
		instance = new File();
	});
	
	afterEach(function() {
		instance = null;
	});

	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.plan_id).to.eql('integer');
		expect(rules.tree_id).to.eql('integer');
		expect(rules.type).to.eql(['required', 'string']);
		expect(rules.extension).to.eql(['required', 'string']);
		expect(rules.link).to.eql(['required', 'string']);
		expect(rules.source).to.eql(['required', 'string']);
		expect(rules.name).to.eql(['required', 'string']);
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('file');
	});

	it('has the right defaults', function() {
		const defaults = instance.defaults();
		expect(defaults).to.eql({
			source: FILE_SOURCES.UNKNOWN,
			type: FILE_TYPES.UNKNOWN
		});
	});

	it('has no timestamps', function() {
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(false);
	});
});