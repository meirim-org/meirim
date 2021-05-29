const Plan = require('../api/model/plan');

exports.up = async function(knex) {

    await knex.schema.table('plan', table => {
        table.string('plan_display_name', 256);
    });

    const knexRes = await knex.raw(`SELECT id, PL_NAME
          FROM plan
          WHERE plan_display_name IS NULL`);

    const idsAndNames = knexRes[0];

    await knex.transaction(trx => {
        const queries = [];

        for (const {id: planId, PL_NAME: planName} of idsAndNames) {

            const cleanedName = Plan.cleanPlanName(planName);
            const query = knex('plan')
                .where({id: planId})
                .update({plan_display_name: cleanedName})
                .transacting(trx);
            queries.push(query);

        }

        Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback);
    });

};

exports.down = function(knex) {
    return knex.schema.table('plan', table => {
        table.dropColumns('plan_display_name');
    });
};
