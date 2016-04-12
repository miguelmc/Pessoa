process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express'),
    mongoose = require('./config/mongoose');
    passport = require('./config/passport');
var bodyParser = require('body-parser');
var anyDB = require('any-db');

var db = mongoose();
var app = express();
var passport = passport();


app.set('views', __dirname);
var fs = require('fs');
app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


// get requests
app.get('/mainslides', function(request, response) {
  var slides = [{"link":"http://www.google.com", "img":"holygrail.png"},
                {"link":"http://www.google.com", "img":"LookinglassImage.png"},
                {"link":"http://www.google.com", "img":"YugiohAIImage.png"}];
  response.json(slides);
  response.end();
});

app.get('/articles/abc', function(request, response) {
  var stuff = [{"link":"http://www.google.com", "img":"", "title":"Portugal and Pomegrantes"}];
  response.json(stuff);
  response.end();
});

app.get('/', function(request, response) {
  response.render('index.html');
});



app.listen(8080);

module.exports = app;

console.log("Server running at http://localhost:8080/")
