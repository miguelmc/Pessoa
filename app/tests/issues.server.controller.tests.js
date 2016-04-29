var app = require('../../server.js'),
    request = require("supertest"),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Issue = mongoose.model('Issue');

var user, issue;

describe('Issues Controller Unit Tests', function() {
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

      issue.save(function(err) {
        done();
      });
    });
  });

  describe('Testing the GET methods', function() {
    it('Should be able to get the list of issue', function(done) {
      request(app).get('/api/issues/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          // and chaining doesnt work.....
          res.body.should.be.an.Array;
          res.body.should.have.lengthOf(1);
          res.body[0].should.have.property('issueNumber', issue.issueNumber);
          res.body[0].should.have.property('notes', issue.notes); 
          res.body[0].should.have.property('season', issue.season);
          res.body[0].should.have.property('year', issue.year);

          done();
        });
    });

    it('Should be able to get a specific issue', function(done) {
      request(app).get('/api/issues/' + issue.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.should.be.an.Object;
          res.body.should.have.property('issueNumber', issue.issueNumber);

          done();
        });
    });
  });

  afterEach(function(done) {
    Issue.remove().exec();
    User.remove().exec();
    done();
  });
});
