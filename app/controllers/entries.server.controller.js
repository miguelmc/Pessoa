var db = require('../../config/mongoose'),
    Entry = db.model('Entry');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    // Dispensable. Expand if ever needed.
    switch(err.code) {
      // Not really going to happen if we are only having
      //  the root user.
      case 11000:
      case 11001:
        message = 'Title already exists';
        break;
      default:
        message = 'Something went wrong ' + err.code;
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message)
        message = err.errors[errName].message;
    }
  }

  return message;
};

exports.create = function(req, res, next) {
  console.log(req.body);
  var entry = new Entry(req.body);

  entry.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(entry);
    }
  });
};

exports.list = function(req, res, next) {
  Entry.find(req.query, function(err, entries){
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(entries);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.entry);
}

exports.update = function(req, res, next) {
  // Gotta do this to work...
  delete req.body._id;

  Entry.findByIdAndUpdate(req.entry.id, req.body, function(err, entry) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(entry);
    }
  });
};

exports.delete = function(req, res, next) {
  req.entry.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(req.entry);
    }
  });
};

// Middleware for paths having :entryId
exports.entryById = function(req, res, next, id) {
  Entry.findOne({
    _id: id
  }, function(err, entry) {
    if (err) return next(err);
    if (!entry) {
      return next(new Error('Failed to load entry ' + id));
    }
    req.entry = entry;
    next();
  });
};
