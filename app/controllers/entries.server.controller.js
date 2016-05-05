var Entry = require('mongoose').model('Entry');

var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message)
        return err.errors[errName].message;
    }
  } else {
    return 'Unknown server error';
  }
};

exports.create = function(req, res, next) {
  var entry = new Entry(req.body);

  entry.save(function(err) {
    if (err) {
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
