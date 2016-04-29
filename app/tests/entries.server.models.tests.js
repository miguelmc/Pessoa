var app = require('../../server.js'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('Entry');

describe('entry model testing', function() {
	it('Author name must be present', function() {
		var entry1 = new Entry({author: "author", titleEn: "titleEn", titlePt:"titlePt", type:"Article", abstractDesc:"abstractDesc"});
		entry1.save(function(err) {
			assert.equal(err, '');
		});
		entry1.remove();
		var entry2 = new Entry({author: "", titleEn: "titleEn", titlePt:"titlePt", type:"Article", abstractDesc:"abstractDesc"});
		entry2.save(function(err) {
			assert.equal(err, 'Author cannot be blank');
		});
		entry2.remove();
	});
	it('Titles must be present', function() {
		var entry3 = new Entry({author: "author", titleEn: "", titlePt:"titlePt", type:"Article", abstractDesc:"abstractDesc"});
		entry3.save(function(err) {
			assert.equal(err, 'Title cannot be blank');
		});
		entry3.remove();
		var entry4 = new Entry({author: "author", titleEn: "titleEn", titlePt:"", type:"Article", abstractDesc:"abstractDesc"});
		entry4.save(function(err) {
			assert.equal(err, 'Title cannot be blank');
		});
		entry4.remove();
	});
	it('Types must be present', function() {
		var entry5 = new Entry({author: "author", titleEn: "titleEn", titlePt:"titlePt", abstractDesc:"abstractDesc"});
		entry5.save(function(err) {
			assert.equal(err, 'Required');
		});
		entry5.remove();
		var entry6 = new Entry({author: "author", titleEn: "titleEn", titlePt:"titlePt", type:"BLAHBLAH", abstractDesc:"abstractDesc"});
		entry6.save(function(err) {
			assert.equal(err, 'Type not recognised');
		});
		entry6.remove();
	});
	it('Abstract must be present', function() {
		var entry7 = new Entry({author: "author", titleEn: "titleEn", titlePt:"titlePt", type:"Article"});
		entry7.save(function(err) {
			assert.equal(err, 'Please add an abstract');
		});
		entry7.remove();
	});
});