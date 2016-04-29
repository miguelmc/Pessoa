var app = require('../../server.js'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

describe('user model testing', function() {
		it('Username must be present', function() {
			var user1 = new User({username: "abcdef", email: "abcdef@brown.edu", password: "password",admin: true});
			user1.save(function(err) {
				assert.equal(err, '');
			});
			user1.remove();
			var user2 = new User({username: "", email: "abcdef@brown.edu", password: "password",admin: true});
			user2.save(function(err) {
				assert.equal(err, 'Username is required');
			});
			user2.remove();
		});
		it('Email name must be present and correct', function() {
			var user4 = new User({username: "abcdef", email: "", password: "password",admin: true});
			user4.save(function(err) {
				assert.equal(err, 'Required');
			});
			user4.remove();
			var user5 = new User({username: "abcdef", email: "abcdefbrown.edu", password: "password",admin: true});
			user5.save(function(err) {
				assert.equal(err, 'Please fill a valid e-mail address');
			});
			user5.remove();
		});
		it('Password must meet requirements', function() {
			var user7 = new User({username: "abcdef", email: "abcdef@brown.edu", password: "",admin: true});
			user7.save(function(err) {
				assert.equal(err, 'Password should be longer');
			});
			user7.remove();
			var user8 = new User({username: "abcdef", email: "abcdef@brown.edu", password: "passwo",admin: true});
			user8.save(function(err) {
				assert.equal(err, 'Password should be longer');
			});
			user8.remove();
		});
	});