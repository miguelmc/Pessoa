process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('views', __dirname);
app.use(express.static('assets'));
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
