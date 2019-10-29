const Controller = require("../controller/controller");
const Rate = require("../model/rate");
const Log = require("../lib/log");
const Exception = require("../model/exception");
const { Knex } = require("../service/database");


class RateController extends Controller {
    /**
     * Return person's alerts. Must be logged in.
     * @param {IncomingRequest} req
     */
    byPlan(req) {
        return this.model.byPlan(req.params.plan_id).then(collection => {
            Log.debug(this.tableName, "Get rate list", req.params.plan_id);
            return collection;
        });
    }

    create(req, transaction) {
        const plan_id = parseInt(req.body.plan_id, 10);
        return this.model
        .forge({
            person_id: req.session.person.id,
            plan_id
        })
        .fetch()
        .then(fetchedModel => {
            if (fetchedModel){
                return fetchedModel.save(req.body)
            }
            return super.create(req,transaction)
        })
        .then(newRating => {
            // update plan table
            const query = `UPDATE plan SET rating=(SELECT sum(score)/count(*) from rate where plan_id=${plan_id}) WHERE id=${plan_id}`
            return Knex.raw(query);
        });
    }
}

module.exports = new RateController(Rate);
