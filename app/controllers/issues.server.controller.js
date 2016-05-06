var fs = require('fs'),
    db = require('../../config/mongoose'),
    Issue = db.model('Issue');

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
      var writeStream = db.gfs.createWriteStream(
        {
          filename: 'pessoa1.jpg'
          //_id: issue._id 
        }
      );
      fs.createReadStream('public/img/pessoa1.jpg').pipe(writeStream);
      writeStream.on('close', function (file) {
        console.log("Wrote file:" + file.filename);
      });

      res.json(issue);
    }
  });
};

exports.list = function(req, res, next) {
  // console.log(db.gfs);
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
  var fs_write_stream = fs.createWriteStream('pessoa_back.jpg');
  var readstream = db.gfs.createReadStream(
    {
      filename: 'pessoa1.jpg'
      //_id: req.issue._id 
    }
  );
  readstream.pipe(fs_write_stream);
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
