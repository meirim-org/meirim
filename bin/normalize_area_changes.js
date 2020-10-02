const { Knex } = require("../api/service/database");

const normalize_area_changes = async (knex) => {
    const data = await knex.raw(`SELECT id, areaChanges FROM plan WHERE id NOT IN (SELECT DISTINCT plan_id FROM plan_area_changes)`);

    const idsAndChanges = data[0];
    let howMuchLeft = idsAndChanges.length;
    const showMultiplesOf100 = howMuchLeft >= 200;

    console.log('starting to insert');

    for (const { id: planId, areaChanges: areaChangesStr } of idsAndChanges) {

        if ((showMultiplesOf100 && howMuchLeft % 100 === 0) || (!showMultiplesOf100 && howMuchLeft % 10 === 0)) {
            console.log(`${howMuchLeft} plans left`);
        }

        const changesObj = JSON.parse(areaChangesStr);
        if (changesObj === null || changesObj === undefined) {
            howMuchLeft--;
            continue;
        }

        const changesIndexedObjs = changesObj[0];
        const changesToInsert = changesIndexedObjs.map(changeIndexedObj => {
            if (changeIndexedObj === null || changesObj === undefined) {
                return [];
            }

            //changeIndexedObj is not a list (it's an object), so we cant really iterate on it
            const orderedData = [planId];
            for (let i = 3; i < 10; i++) {
                orderedData.push(changeIndexedObj[i]);
            }
           return orderedData;
        });
        for (const orderedData of changesToInsert) {
            if (orderedData === []) {
                continue;
            }

           await knex.raw(`INSERT INTO plan_area_changes (plan_id, \`usage\`, measurement_unit, approved_state, change_to_approved_state,
               total_in_detailed_plan, total_in_mitaarit_plan, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, orderedData);
        }
        howMuchLeft--;
    }

};

// if it's main (we run it directly)
if (require.main === module) {
    normalize_area_changes(Knex).then(() => {
        console.log('done normalizing');
        process.exit(0);
    })
        .catch(err => console.log(err))
}

module.exports =  {
    normalize_area_changes
};
