var app = require('../../server.js'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Issue = mongoose.model('Issue');

var user, issue;

describe('Issue Model Unit Tests', function() {
  beforeEach(function(done) {
    user = new User({
      username: "Admin",
      email: "email@brown.edu",
      password: "password",
      admin: true
    });

    user.save(function() {
      issue = new Issue({
        issueNumber: 1,
        notes: "Some notes",
        season: "Spring",
        year: 2016,
      });

      done();
    });
  });

  describe('Testing the save method', function() {
    it('Should be able to save without problems', function() {
      issue.save(function(err) {
        // This is not working.....
        // IT ALWAYS RETURNS TRUE... WTF
        console.log(err);
        should.exist(err);
        should.not.exist(err);
        should.exist(undefined);
        should.exist(null);
      });
    });

    it('Should not be able to save an issue without issue number', function() {
      issue.issueNumber= '';

      issue.save(function(err) {
        console.log(err);
        should.exist(err);
      });
    });

    it('Should not be able to save an issue without season', function() {
      issue.season= '';

      issue.save(function(err) {
        console.log(err);
        should.exist(err);
      });
    });

    it('Should not be able to save an issue without a valid season', function() {
      issue.season= 'Not a season';

      issue.save(function(err) {
        console.log(err);
        should.exist(err);
      });
    });

    it('Should not be able to save an issue without a year', function() {
      issue.year= '';

      issue.save(function(err) {
        console.log(err);
        should.exist(err);
      });
    });

    it('Should be able to save an issue without notes', function() {
      issue.notes= '';

      issue.save(function(err) {
        console.log(err);
        should.not.exist(err);
      });
    });
  });

  afterEach(function(done) {
    Issue.remove(function() {
      User.remove(function() {
        done();
      });
    });
  });
});
