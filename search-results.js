$(document).ready(function() {
  $.get('/search/' + $(document).find("title").text(), function(results) {
    //results = parseJSON(results);
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        var artName = results[i].title
        var desc = results[i].description
        var ref = results[i].link
        $('#result-section').append('<div class="search-element"><a href="' + ref + '"><h2>' + artName + '</h2></a>' + desc + '</div>')
      }
    } else {
      $('#no-results').css('display', 'block');
    }
  });
});