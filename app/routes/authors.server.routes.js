var users = require('../controllers/users.server.controller'),
    authors = require('../controllers/authors.server.controller');

module.exports = function(app) {
  app.route('/api/authors')
     .get(authors.list)
     .post(/*users.requiresAdmin,*/ authors.create);

  app.route('/api/authors/:authorId')
     .get(authors.read)
     .put(/*users.requiresAdmin,*/ authors.update)
     .delete(/*users.requiresAdmin,*/ authors.delete);

  // Middleware handling :authorId
  app.param("authorId", authors.authorById);
};
