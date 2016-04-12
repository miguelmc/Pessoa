var slideIndex = 0;

function hideslide(slideimgs) {
  for (var i = 0; i < slideimgs.length; i++) {
    slideimgs[i].style.display = "none";
  }
}

function slide() {
  var slideimgs = $('#slides').children();
  hideslide(slideimgs);
  slideimgs[slideIndex].style.display = "block";
  slideIndex = slideIndex + 1;
  if (slideIndex > slideimgs.length - 1) {
    slideIndex = 0;
  }
};
  
$(document).ready(function() {
  var rotate;
  $.get('/mainslides', function(results) {
    for (var i = 0; i < results.length; i++) {
      $('#slides').append('<div class="slide"><a href="' + results[i].link + '"><img src="img/' + results[i].img + '" width="100%"></a></div>');
    }
    rotate = setInterval(slide, 2500);
  });
  for (var i = 0; i < $('#slides').children().length; i++) {
    $('#slide-indicators').append('<div class="slide-indicator"><button class="slide-circle" id="' + i +'"><img src="img/SlideCircle.png" width="100%"></button></div>');
  }
  $('.slide-circle').click(function() {
    var id = $(this).attr('id').replace('#', '');
    var slides = $('#slides').children();
    hideslide(slides);
    slides[id].style.display = "block";
    clearInterval(rotate);
    slideIndex = id + 1;
    if (slideIndex > slides.length - 1) {
      slideIndex = 0;
    }
    rotate = setInterval(slide, 2500);
  });
  $('#sright').click(function() {
    var slides = $('#slides').children();
    hideslide(slides);
    slides[slideIndex].style.display = "block";
    clearInterval(rotate);
    slideIndex = slideIndex + 1;
    if (slideIndex > slides.length - 1) {
      slideIndex = 0;
    }
    rotate = setInterval(slide, 2500);
  });
  $('#sleft').click(function() {
    var slides = $('#slides').children();
    var target = slideIndex - 2;
    if (target < 0) {
      target = slides.length + target;
    }
    hideslide(slides);
    console.log(target);
    slides[target].style.display = "block";
    clearInterval(rotate);
    slideIndex = target + 1;
    if (slideIndex > slides.length - 1) {
      slideIndex = 0;
    }
    rotate = setInterval(slide, 2500);
  });
  $('#search-form').submit(function(event) {
    event.preventDefault();
    var query = $('#search-box').val();
    window.location = '/search/' + query;
  });
});
  