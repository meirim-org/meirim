const Classifier = require('../data_processing/categorize_plans');

exports.up = async function(knex) {
  await knex.schema.createTable('plan_details', (t) => {
     t.increments('id').primary();
     t.integer('planId').references('id').inTable('plan');
     t.string('tag');
     t.string('detail', 1000);
     t.string('area_designation_from', 1000);
     t.string('area_designation_to', 1000);
  });
  const stopWords = await Classifier.readStopWords();
  const data = await knex('plan').select('id', 'main_details_from_mavat');
  data.forEach(row => {
     const planId = row.id;
     const detailsStr = row.main_details_from_mavat;
     const tags = Classifier.parseStrDetailsOfPlan(detailsStr, stopWords);
     tags.forEach(async tag => {
         if(tag === undefined) {
             //some details may have no classification
             return;
         }
         const objToInsert = {planId: planId,
                              tag: tag.tag,
                              detail: tag.detail,
                              area_designation_from: tag.hasOwnProperty('fromArea') ? tag.fromArea : '',
                              area_designation_to: tag.hasOwnProperty('toArea') ? tag.toArea : ''};
         await knex('plan_details').insert(objToInsert);
     });
  });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('plan_details')
};
