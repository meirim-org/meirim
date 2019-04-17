const Controller = require("../controller/controller");
const Tag = require("../model/tag");

class TagController extends Controller {}

module.exports = {
  class: TagController,
  instance: new TagController(Tag)
};
