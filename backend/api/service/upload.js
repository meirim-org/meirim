'use strict';
const uploadDirectory = 'tmp/';
const Multer = require('multer')({dest: uploadDirectory});

module.exports = {
  middleware:Multer,
  uploadDirectory: uploadDirectory
}
