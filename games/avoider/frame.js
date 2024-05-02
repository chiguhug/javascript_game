$(function(){
  $(window).on('load resize', function() {
    var b_w = $('body').width() * 0.8;
    var c_w = $('#myCanvas').width();
    console.log(b_w);
    console.log(c_w);
    $('body').css('transform', 'scale(' + (b_w/c_w) + ')');
  });
});
