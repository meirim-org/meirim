const Model = require('./base_model');

class PlanAddress extends Model {

  get rules() {
    return {
      planId: ['required', 'integer'],
      district: ['string'],
      space: ['string'], // מרחב תכנון
      localAuthority: ['string'],
      settlement: ['string'],
      street: ['string'],
      houseNumber: ['string'], // maybe can be 18א? (notice the aleph)
    };
  }

  get tableName() {
    return 'plan_address';
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

  static createFromMavatData(plan, oldPlan = null, mavatData) {
      if (oldPlan) {
          return [];   //for now does nothing for old plan, should be changed
      }
      // each plan can have multiple addresses
      const addressesList = mavatData.addressesList;
      const addressesListJson = addressesList.map(address => { return {
          planId: plan.id,
              district: address[0],
              space: address[1],
              localAuthority: address[2],
              settlement: address[3],
              street: address[4],
              houseNumber: address[5],
      }});
      return addressesListJson.map(address => new PlanAddress(address).save());
  }

}

module.exports = PlanAddress;