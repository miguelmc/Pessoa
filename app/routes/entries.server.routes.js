var users = require('../controllers/users.server.controller'),
    entries = require('../controllers/entries.server.controller');

module.exports = function(app) {
  app.route('/api/entries')
     .get(entries.list)
     .post(/*users.requiresAdmin,*/ entries.create);

  app.route('/api/entries/:entryId')
     .get(entries.read)
     .put(/*users.requiresAdmin,*/ entries.update)
     .delete(users.requiresAdmin, entries.delete);

  // Middleware handling :entryId
  app.param("entryId", entries.entryById);
};
