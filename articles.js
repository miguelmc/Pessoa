$(document).ready(function() {
  $.get('/articles/abc/', function(results) {
    var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    for (var j = 0; j < alphabet.length; j++) {
      $('#articles').append('<div class="abc-article-section" id="' + alphabet[j] + '"></div>');
    }
    for (var i = 0; i < results.length; i++) {
      var id = results[i].title.substring(1).toLowerCase();
      $('#' + id).append('<div class="article"><a href="' + results[i].link + '"><img src="' + results[i].img + '" width="80%"></a>' + '<a href="' + results[i].link + '">' + results[i].title + '</a></div>');
    }
  });
});
      