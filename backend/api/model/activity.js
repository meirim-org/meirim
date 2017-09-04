'use strict';
const Bookshelf = require("./bookshelf");
const Checkit = require('checkit');
const Exception = require('./exception');
const Upload = require("../service/upload");
const PersonActivity = require("../model/person_activity");
const Status = require("../model/status");
const ImageResize = require('node-image-resize');
const fs = require('fs');
const Log = require("../service/log");
class Activity extends Bookshelf.Model {

  get rules() {
    return {
      id: [
        'required', 'integer'
      ],
      headline: [
        'required', 'string'
      ],
      address: [
        'required', 'string'
      ],
      latlon: [
        'required', 'string'
      ],
      description: [
        'required', 'string'
      ],
      status: ['required', 'integer']
    }
  }
  get hidden() {
    return ['password', 'admin']
  }

  get tableName() {
    return 'activity';
  }

  get hasTimestamps() {
    return true;
  }
  get idAttribute() {
    return 'id';
  }

  get hasTimestamps() {
    return true;
  }

  status() {
    return this.belongsTo('status', 'status');
  }

  addPerson(person_id) {
    return PersonActivity.forge({activity_id: this.get("id"), person_id: person_id}).save();
  }

  upload(files) {

    var newPath = __dirname + "/../../public/upload/";

    if (!files)
      return new Exception.badRequest('No files were uploaded');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    Log.debug(files);
    Object.keys(files).forEach(function(key) {
      Log.debug("Handeling file:", key);
      var sampleFile = files[key];
      console.log(sampleFile.path);
      var image = new ImageResize(sampleFile.path);
      console.log(1);
      image.loaded().then(function() {
        console.log(2);
        image.smartResizeDown({width: 200, height: 200}).then(function() {
          console.log(3);
          image.stream(function(err, stdout, stderr) {
            console.log(newPath + sampleFile.filename + '.jpg');
            if (err)
              Log.e(err);
            var writeStream = fs.createWriteStream(newPath + sampleFile.filename + '.jpg');
            console.log(5);
            stdout.pipe(writeStream);
            console.log(6);
          });
        });
      });
    });
  }

  static uploadMiddleWareFactory() {
    return Upload.middleware.array('photos', 12);
  }
  canRead(session) {
    return  Promise.resolve(this);;
  }
  canEdit(session) {
    // if (!session.person || !session.person.admin) {
    // 	throw new Exception.notAllowed("Must be an admin")
    // }
    return  Promise.resolve(this);;
  }
  canJoin(session) {
    if (!session.person || !session.person.id) {
    	throw new Exception.notAllowed("Must be signed in")
    }
    if (!this.status().notActive()) {
    	throw new Exception.notAllowed("Activity isn't active");
    }
    return Promise.resolve(this);
  }
  static canCreate(session) {
    if (!session.person || !session.person.id) {
      throw new Exception.notAllowed("Must be signed in")
    }
    return Activity;
  }
};
// private
module.exports = Bookshelf.model('Activity', Activity);
