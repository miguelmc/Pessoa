var users = require('../controllers/users.server.controller'),
    passport = require('passport');

module.exports = function(app) {
  //app.route('/signup')
  //   .post(users.signup);

  app.route('/signin')
     .get(users.renderSignin)
     .post(passport.authenticate('local', {
       successRedirect: "/",
       failureRedirect: "/signin",
       failureFlash: true
     }));

  app.get('/signout', users.signout);

  app.route('/users')
     .get(users.list)
     .post(users.create);

  app.route('/users/:userId')
     .get(users.read)
     .put(users.update)
     .delete(users.delete);

  // Middleware handling :userId
  app.param("userId", users.userById);
};
