var Issue = require('mongoose').model('Issue');

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
  var issue = new Issue(req.body);
  //issue._id = req.body.issue;

  issue.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(issue);
    }
  });
};

exports.list = function(req, res, next) {
  Issue.find({}, function(err, issues){
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(issues);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.issue);
}

exports.update = function(req, res, next) {
  Issue.findByIdAndUpdate(req.issue.id, req.body, function(err, issue) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(issue);
    }
  });
};

exports.delete = function(req, res, next) {
  req.issue.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(req.issue);
    }
  });
};

// Middleware for paths having :issueId
exports.issueById = function(req, res, next, id) {
  Issue.findOne({
    _id: id
  }, function(err, issue) {
    if (err) return next(err);
    if (!issue) {
      return next(new Error('Failed to load issue ' + id));
    }
    req.issue = issue;
    next();
  });
};
