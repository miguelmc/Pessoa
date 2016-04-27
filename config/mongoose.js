var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
  var db = mongoose.connect(config.db);

  require('../app/models/issue.server.model');
  require('../app/models/entry.server.model');
  require('../app/models/user.server.model');

  return db;
};
