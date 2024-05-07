
$(function(){
    $("#scroll_content").click(function () {    //アプリの画像をクリックされたときの処理

      let input = this.getElementsByTagName('input');   //inputタグの取得
      const url = input[0].value;                       //情報を取得するURLをセット

      //Ajax通信
      $.ajax({
        type: "GET",
        cache: false,
        url: url,
        datatype:'html'
      })
      .done( (data) => {
        let html = $($.parseHTML(data));    //HTMLデータに変換
        let title = html.filter('title')[0].innerHTML;  //タイトルタグの情報を取得
        $('#app_name').html(title); //アプリ名をセット
      })
      ;
  });

});