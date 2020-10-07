const Bluebird = require("bluebird");
const Controller = require("../controller/controller");
const Impression = require("../model/impression");
const Plan = require("../model/plan");
const { Knex } = require('../service/database')

class ImpressionController extends Controller {

    getIp = (req) => {
        return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    };

    create(req, transaction) {
        const body = req.body;
        body.plan_id = parseInt(req.params.plan_id, 10);
        body.ip = this.getIp(req);
        body.person_id = req.session.person ? req.session.person.id : 0;
        console.log(body)
        return this.model.forge(body).save()
        // we don't was to ruturn data
            .then(() => true)
    }

    /**
     * Aggregate impressions and update view count in plan table.
     * Should be executed by cron every hour or day
     */
    aggregate() {
        
        // get aggregated count for every plan
        const query = 'select a.plan_id, count(*) as num from (SELECT plan_id, ip FROM `impression` group by plan_id, ip) as a group by a.plan_id ';
      
        return Plan.erode_views()
            .then(() => {
                return Knex.raw(query)
            })

            .then(results => {
                //map plans by planid
                const map = {}
                results[0].map(item => {
                    map[item.num] ? map[item.num].push(item.plan_id) : map[item.num] = [item.plan_id];
                })
                
                // build update queries
                const queries = Object.keys(map)
                    .map(key => `UPDATE plan SET 
                        views=views+${key}, 
                        erosion_views=erosion_views +${key} 
                        WHERE id IN(${map[key].join(',')})`);

                // update the plan table
                return Bluebird.mapSeries(queries, query => Knex.raw(query))
            })
            .then(() => {
                // remove impressions
                return Knex.raw('TRUNCATE impression')
            })
    }

}

module.exports = new ImpressionController(Impression);
