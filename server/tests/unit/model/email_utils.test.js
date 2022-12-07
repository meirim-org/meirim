const utils = require('../../../api/service/email_utils');
const expect = require('chai').expect;

describe('Next bussiness day and time', function() {

	it('businness day early', function() {		
        const value = new Date('December 7, 2022 03:24:00');
		expect(utils.calcBussinessDate(value)).to.eql(new Date('December 7, 2022 10:00:00'));
    });

    it('businness day late', function() {		
        const value = new Date('December 7, 2022 20:24:00');
		expect(utils.calcBussinessDate(value)).to.eql(new Date('December 8, 2022 10:00:00'));
    });

    it('thursday late', function() {		
        const value = new Date('December 8, 2022 20:24:00');
		expect(utils.calcBussinessDate(value)).to.eql(new Date('December 11, 2022 10:00:00'));
    });

    it('friday', function() {		
        const value = new Date('December 9, 2022 12:24:00');
		expect(utils.calcBussinessDate(value)).to.eql(new Date('December 11, 2022 10:00:00'));
    });

    it('saturday', function() {		
        const value = new Date('December 10, 2022 12:24:00');
		expect(utils.calcBussinessDate(value)).to.eql(new Date('December 11, 2022 10:00:00'));
    });

    it('sunday in range', function() {		
        const value = new Date('December 11, 2022 12:24:00');
		expect(utils.calcBussinessDate(value)).to.eql(new Date('December 11, 2022 12:24:00'));
    });
	
});
