const Controller = require("../controller/controller");
const Status = require("../model/status");

class StatusController extends Controller {}

module.exports = new StatusController(Status);
