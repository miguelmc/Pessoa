$(document).ready(function() {
  $.get('/article/' + $(document).find("title").text();, function(results) {
    $('.detail-article').append('<div id="detail-image"><img src="images/' + results.img + '" width="100%"></div>');
    $('.detail-article').append('<div id="detail-text"><a href="' + results.link + '">' + results.title + '</a>');
    $('#detail-text').append(results.abstract);
  }
}