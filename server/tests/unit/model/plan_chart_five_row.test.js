const expect = require('chai').expect;
const { PlanChartFiveRow } = require('../../../api/model');

describe('plan chart five row model', function() {
    let instance;

	beforeEach(function () {
		instance = new PlanChartFiveRow();
	}); 
	
	afterEach(function() {
		instance = null;
	});

	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.plan_id).to.eql(['required', 'integer']);
        expect(rules.designation).to.eql('string');
        expect(rules.use).to.eql('string');
        expect(rules.area_number).to.eql('string');
        expect(rules.location).to.eql('string');
        expect(rules.field_size_sqm).to.eql('string');
        expect(rules.above_primary_main).to.eql('string');
        expect(rules.above_primary_service).to.eql('string');
        expect(rules.below_primary_main).to.eql('string');
        expect(rules.below_primary_service).to.eql('string');
        expect(rules.building_percentage).to.eql('string');
        expect(rules.tahsit).to.eql('string');
        expect(rules.density_yahad_to_dunam).to.eql('string');
        expect(rules.num_of_housing_units).to.eql('string');
        expect(rules.floors_above).to.eql('string');
        expect(rules.floors_below).to.eql('string');
        expect(rules.overall_building_band).to.eql('string');
        expect(rules.height_above_entrance).to.eql('string');
        expect(rules.side_line_right).to.eql('string');
        expect(rules.side_line_left).to.eql('string');
        expect(rules.side_line_back).to.eql('string');
        expect(rules.side_line_front).to.eql('string');
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('table_5_building_rights');
	});

	it('has no timestamps', function() {
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(false);
	});
});
