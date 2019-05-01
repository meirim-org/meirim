const Log = require("./lib/log");
const Exception = require("./model/exception");
const Failure = require("./view/failure");

module.exports = (req, res) => {
  const err = req.error ? req.error : new Exception.NotFound("Not Found");

  if (err.code === "ER_DUP_ENTRY") {
    // this is specific for MYSQL
    const index = err.message.indexOf("ER_DUP_ENTRY:") + 14;
    return Failure.duplicate(res, err.message.substr(index));
  }

  Log.error("User error", JSON.stringify(err));

  if (err.name === "NotAllowed") { return Failure.notAllowed(res, err.message); }
  if (err.name === "BadRequest") { return Failure.badRequest(res, err.message); }
  if (err.name === "NotFound") { return Failure.notFound(res, err.message); }
  if (err.name === "NotImplemented") { return Failure.notImplemented(res, err.message); }
  return Failure.error(res, err.message);
};
