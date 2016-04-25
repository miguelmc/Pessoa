$(document).ready(function() {
  var author = 0
  var date = 0
  var subject = 1
  $('#author').click(function() {
    author = 1 - author;
  });
  $('#date').click(function() {
    date = 1 - date;
  });
  $('#subject').click(function() {
    subject = 1 - subject;
  });
  $('#a-search-go').click(function() {
    var text = $('#a-search-box').val()
    $.get('/a-search/' + author + '/' + date + '/' + subject + '/' + text, function(response) {
    });
  });
});