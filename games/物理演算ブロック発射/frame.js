$(function(){
  $(window).on('load resize', function() {
    var b_w = $('body').width();
    var c_w = $('#myCanvas').width();
    $('body').css('transform', 'scale(' + (b_w/c_w) + ')');
  });
});
