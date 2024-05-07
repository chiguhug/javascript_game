
$(function(){
    $("#scroll_content").click(function () {

      let input = this.getElementsByTagName('input'); //inputタグの取得
      const url = input[0].value;

      $.ajax({
        type: "GET",
        cache: false,
        url: url,
        datatype:'html'
      })
      .done( (data) => {
        let out_html = $($.parseHTML(data));
        let title = out_html.filter('title')[0].innerHTML;
        $('#app_name').html(title);
      })
      ;
  });

});