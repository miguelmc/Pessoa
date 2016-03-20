var entries = require('../controllers/entries.server.controller');

module.exports = function(app) {
  app.route('/entries')
     .post(entries.create)
     .get(entries.list);

  app.route('/entries/:entryId')
     .get(entries.read)
     .put(entries.update)
     .delete(entries.delete);

  // Middleware handling :entryId
  app.param("entryId", entries.entryById);
};
