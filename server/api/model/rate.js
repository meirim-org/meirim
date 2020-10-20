const Checkit = require("checkit");
const Model = require("./base_model");
const { Knex } = require("../service/database");

const Person = require("./person");
const Exception = require("./exception");

class Rate extends Model {
    get rules() {
        return {
            person_id: ["required", "integer"],
            score: ["required", "integer"],
            plan_id: ["required", "integer"]
        };
    }

    get tableName() {
        return "rate";
    }

    person() {
        return this.belongsTo(Person);
    }

    initialize() {
        this.on("saving", this._saving, this);
        super.initialize();
    }

    _saving(model, attrs, options) {
        return new Checkit(model.rules).run(model.attributes);
    }

    canRead(session) {
        return Promise.resolve(this);
    }

    canEdit(session) {
        if (session.person.id !== this.get("person_id")) {
            throw new Exception.NotAllowed("You cannot edit this rating");
        }
        return Promise.resolve(this);
    }

    static byPlan(planId) {
        if (!planId) {
            throw new Exception.BadRequest("Must provide planId");
        }
        return Knex("rate")
            .select("score")
            .count("score as num")
            .where({ plan_id: planId })
            .groupBy("score");
    }

    static canCreate(session) {
        if (!session.person) {
            throw new Exception.NotAllowed("Must be logged in");
        }
        return Promise.resolve(this);
    }
}

module.exports = Rate;
