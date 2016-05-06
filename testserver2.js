var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var engines = require('consolidate');
app.engine('html', engines.hogan);
app.set('views', __dirname);
var fs = require('fs');
app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/articles/abc', function(request, response) {
  var toReturn = []
  toReturn.push({"link":"http://www.apple.com", "title":"Apple", "img":"http://thebrainfever.com/images/apple-logos/Silhouette.png"});
  toReturn.push({"link":"http://www.google.com", "title":"Google", "img":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png"});
  toReturn.push({"link":"http://www.microsoft.com", "title":"Microsoft", "img":"https://www.seeklogo.net/wp-content/uploads/2015/11/microsoft-windows-logo-vector-download.jpg"});
  toReturn.push({"link":"/s-article/copernicus", "title":"Copernicus", "img":"https://upload.wikimedia.org/wikipedia/commons/5/57/Heliocentric.jpg"});
  toReturn.push({"link":"http://www.amazon.com", "title":"Amazon", "img":"https://millennialaspirations.files.wordpress.com/2015/08/amazon-logo-black-square.png"});
  response.json(toReturn);
  response.end();
});

app.get('/s-article/:pageName', function(request, response) {
  response.render('singlearticle.html', {name: request.params.pageName});
});

app.get('/article/:pageName', function(request, response) {
  var info = {"title":"Copernicus", "img":"https://upload.wikimedia.org/wikipedia/commons/5/57/Heliocentric.jpg", "link":"https://en.wikipedia.org/wiki/Nicolaus_Copernicus", "abstract":"This is an article about copernicus"};
  response.json(info);
  response.end();
});

app.get('/a-search/:author/:date/:subject/:text', function(request, response) {
  var authSort = request.params.author;
  var dateSort = request.params.date;
  var subSort = request.params.subject;
  var query = request.params.text;
  response.render('search-results.html', {name:authSort+'/'+dateSort+'/'+subSort+'/'+query});
});
                                          
app.get('/search/:author/:date/:subject/:text', function(request, response) {
  var authSort = request.params.author;
  var dateSort = request.params.date;
  var subSort = request.params.subject;
  var query = request.params.text;
  var toReturn =[];
  toReturn.push({"title":"Newton", "link":"http://www.reddit.com", "description":"The life of Newton or whatever"});
  response.json(toReturn);
  response.end();
});

app.get('/', function(request, response) {
  response.render('index.html');
});

app.listen(8080);