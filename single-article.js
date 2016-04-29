$(document).ready(function() {
  $.get('/article/' + $(document).find("title").text(), function(results) {
    //results = parseJson(results);
    $('.detail-article').append('<div id="detail-image"><img src="' + results.img + '" width="100%"></div>');
    $('.detail-article').append('<div id="detail-text"><a href="' + results.link + '">' + results.title + '</a>');
    $('#detail-text').append(results.abstract);
  });
  $.get('/article-images/' + $(document).find('title').text(), function(results) {
    //results = parseJSON(results);
    for (var i = 0; i < results.length; i++) {
      $('#image-grid').append('<div class="article-image"><a href="' + results[i].link + '"><img src="' + results[i].img + '" width="80%"></a></div>');
    }
  });
    
});