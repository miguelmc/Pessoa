var fs = require('fs'),
    db = require('../../config/mongoose'),
    Author = db.model('Author');

var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    // Dispensable. Expand if ever needed.
    switch(err.code) {
      // Not really going to happen if we are only having
      //  the root user.
      case 11000:
      case 11001:
        // TODO
        message = 'Author (?) number already exists';
        break;
      default:
        message = 'Something went wrong';
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
  var author = new Author(req.body);

  author.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(author);
    }
  });
};

exports.list = function(req, res, next) {
  // console.log(db.gfs);
  Author.find(req.query, function(err, authors){
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(authors);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.author);
}

exports.update = function(req, res, next) {
  Author.findByIdAndUpdate(req.author.id, req.body, function(err, author) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(author);
    }
  });
};

exports.delete = function(req, res, next) {
  req.author.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(req.author);
    }
  });
};

// Middleware for paths having :authorId
exports.authorById = function(req, res, next, id) {
  Author.findOne({
    _id: id
  }, function(err, author) {
    if (err) return next(err);
    if (!author) {
      return next(new Error('Failed to load author ' + id));
    }
    req.author = author;
    next();
  });
};
