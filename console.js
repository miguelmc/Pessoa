process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var repl = require("repl");

var config = require('./config/config');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

var db = mongoose.createConnection(config.db);

// app specific modules
var Author = require('./app/models/author.server.model');
var Issue = require('./app/models/issue.server.model');
var Entry = require('./app/models/entry.server.model');
var User = require('./app/models/user.server.model');

db.on('error', function(err) {
  console.log("ERROR connecting to: " + config.db + '. ' + err);
});

db.once('open', function() {
  console.log("Succeeded connected to: " + config.db);
  gfs = Grid(db.db);
  // open the repl session
  var replServer = repl.start({
    prompt: "console > "
  });

  // attach modules to the repl context
  replServer.context.config = config;
  replServer.context.db = db;  
  replServer.context.Author= db.model('Author');  
  replServer.context.Issue = db.model('Issue');  
  replServer.context.Entry = db.model('Entry');  
  replServer.context.User = db.model('User');  
  replServer.context.gfs = gfs;
});

