var config = require('./config'),
    mongoose = require('mongoose'),
    Grid = require('gridfs-stream');

Grid.mongo = mongoose.mongo;

var db = mongoose.createConnection(config.db);

db.on('error', function(err) {
  console.log("ERROR connecting to: " + config.db + '. ' + err);
});

db.once('open', function() {
  console.log("Succeeded connected to: " + config.db);
  this.gfs = Grid(db.db);
});

require('../app/models/issue.server.model');
require('../app/models/entry.server.model');
require('../app/models/user.server.model');
require('../app/models/author.server.model');

module.exports = db;

/*module.exports = function() {
  var db = mongoose.connect(config.db, function(err, res) {
    if (err) {
      console.log("ERROR connecting to: " + config.db + '. ' + err);
    } else {
      console.log("Succeeded connected to: " + config.db);
    }
  });


  require('../app/models/issue.server.model');
  require('../app/models/entry.server.model');
  require('../app/models/user.server.model');

  return db;
};*/
