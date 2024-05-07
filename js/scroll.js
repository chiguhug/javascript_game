document.addEventListener('DOMContentLoaded', function() {
    //DOMの読み込み完了後に実行
    var ul = document.getElementById('scroll_content'); //スクロール対象となるulタグの取得
    var li = ul.getElementsByTagName('li'); //ulタグ内の全liタグの取得
    for (var i=0; i < li.length; i++) { //liタグの数だけ繰り返す
        //liタグがクリックされた時の処理
        li[i].addEventListener('click', function() {
            var input = this.getElementsByTagName('input'); //inputタグの取得
            var frame = document.getElementById('frame');   //iframeタグの取得
            frame.src = input[0].value; //inputタグの値（ゲームアプリのURL）をiframeのsrc属性にセット
        });
    };
});