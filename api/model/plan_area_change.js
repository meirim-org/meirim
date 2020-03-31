const Model = require('./base_model');

class PlanAreaChange extends Model {

    get rules() {
        return {
            planId: ['required', 'integer'],
            category: ['string'], // example: מגורים
            unit: ['string'], // example: יח"ד
            approvedState: ['integer'],
            changeToApprovedState: ['integer'],
            totalChange: ['integer'],
        };
    }

    get tableName() {
        return 'plan_area_changes';
    }

    plan() {
        return this.belongsTo('Plan')
    }

    // support json encode for data field
    format(attributes) {
        if (attributes.data) {
            attributes.data = JSON.stringify(attributes.data);
        }
        return super.format(attributes);
    }

    // support json encode for data field
    parse(attributes) {
        try {
            if (attributes.data) {
                attributes.data = JSON.parse(attributes.data);
            }
        } catch (e) {
            Log.error("Json parse error", attributes.data);
        }
    }

    static createFromAreaChangesJson(jsonStr, plan) {
        //return [];
        if (!jsonStr || !plan) {
            return [];
        }
        const jsonArr = JSON.parse(jsonStr)[0]; // 0 is cus it's always wrapped with an array
        // the next line parses the json into normal js object
        const objsArr = jsonArr.map(singleJsonObj => {
            return {
                planId: plan.get('id'),
                category: singleJsonObj[3].substring(0, singleJsonObj[3].indexOf(' (')), // example: מגורים (מ"ר) to מגורים
                unit: singleJsonObj[4],
                approvedState: singleJsonObj[5] ? parseInt(singleJsonObj[5].replace(',', '')) : 0, // example: 1,234 to 1234
                changeToApprovedState: singleJsonObj[6] ? parseInt(singleJsonObj[6].replace(',', '')) : 0,
                totalChange: singleJsonObj[7] ? parseInt(singleJsonObj[7].replace(',', '')) : 0
            };
        });
        return objsArr.map(change => new PlanAreaChange(change).save());
    }

}

module.exports = PlanAreaChange;