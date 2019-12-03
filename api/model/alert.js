const Checkit = require("checkit");
const Promise = require("bluebird");
const Model = require("./base_model");
const Person = require("./person");
const Crypt = require("../lib/crypt");
const { Knex } = require("../service/database");
const Geocoder = require("../service/geocoder").geocoder;
const DegreeToMeter = require("../service/geocoder").degreeToMeter;
const Exception = require("./exception");

class Alert extends Model {
    get rules() {
        return {
            person_id: ["required", "integer"],
            address: ["required", "string"],
            geom: ["required", "object"],
            radius: ["required", "number"]
        };
    }

    defaults() {
        return {
            radius: 5
        };
    }

    get geometry() {
        return ["geom"];
    }

    get tableName() {
        return "alert";
    }

    initialize() {
        this.on("saving", this._saving, this);
        super.initialize();
    }

    alerts() {
        return this.belongsTo(Person);
    }

    _saving(model, attrs, options) {
        // partial validation
        const partialRules = Object.assign(model.rules, {});
        delete partialRules.geom;
        return new Checkit(partialRules).run(model.attributes).then(() => {
            return Geocoder.geocode(model.get("address")).then(res => {
                if (!res[0]) {
                    throw new Exception.NotFound("The address does not exist");
                }
                const box = [];
                const km = 1000;
                const radius = model.get("radius") * km;
                box.push(
                    DegreeToMeter(
                        res[0].longitude,
                        res[0].latitude,
                        radius,
                        radius
                    )
                );
                box.push(
                    DegreeToMeter(
                        res[0].longitude,
                        res[0].latitude,
                        -radius,
                        radius
                    )
                );
                box.push(
                    DegreeToMeter(
                        res[0].longitude,
                        res[0].latitude,
                        -radius,
                        -radius
                    )
                );
                box.push(
                    DegreeToMeter(
                        res[0].longitude,
                        res[0].latitude,
                        radius,
                        -radius
                    )
                );
                box.push(box[0]);

                model.set("geom", {
                    type: "Polygon",
                    coordinates: [box]
                });
                model.set("address", res[0].formattedAddress);
                return new Checkit(model.rules).run(model.attributes);
            });
        });
    }

    canRead(session) {
        if (!session.person) {
            throw new Exception.NotAllowed("Must be logged in");
        }
        if (this.get("person_id") !== session.person.id) {
            throw new Exception.NotAllowed("You cannot read this alert");
        }
        return Promise.resolve(this);
    }

    canEdit(session) {
        return this.canRead(session);
    }

    static canCreate(session) {
        if (!session.person) {
            throw new Exception.NotAllowed("Must be logged in");
        }
        return Promise.resolve(this);
    }

    getCollection() {
        return this.collection()
            .query("where", {
                person_id: this.get("person_id")
            })
            .fetch();
    }

    unsubsribeToken() {
        const token = Crypt.encrypt(
            `${this.get("id")}_${this.get("person_id")}`
        );
        return Buffer.from(token).toString("base64");
    }

    static ByToken(token) {
        const details = Crypt.decrypt(
            Buffer.from(token, "base64").toString("ascii")
        );
        const parts = details.split("_");
        return Alert.forge({
            id: parts[0]
        });
    }

    static getUsersByGeometry(planId) {
        const sql = `SELECT 
    person.email,
    person.id as person_id,
    alert.id as alert_id
    FROM alert 
    INNER JOIN plan ON ST_Intersects(plan.geom,alert.geom)
    INNER JOIN person ON person.id=alert.person_id
    WHERE plan.id=${planId} AND
    person.status=1
    GROUP BY person.id`;
        return Knex.raw(sql);
    }
}

module.exports = Alert;
