var users = require('../controllers/users.server.controller'),
    issues = require('../controllers/issues.server.controller');

module.exports = function(app) {
  app.route('/api/issues')
     .get(issues.list)
     .post(/*users.requiresAdmin,*/ issues.create);

  app.route('/api/issues/:issueId')
     .get(issues.read)
     .put(/*users.requiresAdmin,*/ issues.update)
     .delete(/*users.requiresAdmin,*/ issues.delete);

  // Middleware handling :issueId
  app.param("issueId", issues.issueById);
};
