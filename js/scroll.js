document.addEventListener('DOMContentLoaded', function() {
    //DOMの読み込み完了後に実行
    var ul = document.getElementById('scroll_content'); //スクロール対象となるulタグの取得
    var li = ul.getElementsByTagName('li'); //ulタグ内の全liタグの取得
    for (var i=0; i < li.length; i++) { //liタグの数だけ繰り返す
        //liタグがクリックされた時の処理
        li[i].addEventListener('click', function() {
            var input = this.getElementsByTagName('input'); //inputタグの取得
            var frame = document.getElementById('frame');   //iframeタグの取得
            const URL = input[0].value;   //ゲームアプリのURLを取得
            
            //URLが未設定（該当アプリ無し）の場合の処理
            if (URL == ""){
                $('#app_name').html("Sorry, Please wait!"); //アプリ名をセット
                $('#app_description').html(""); //アプリの説明をセット
                frame.src = ""; //URLをiframeのsrc属性にセット
                return;
            }
            
            frame.src = URL; //URLをiframeのsrc属性にセット
            
            //Ajax通信でアプリ名とアプリ概要の情報を取得する
            $.ajax({
                type: "GET",
                cache: false,
                url: URL,
                datatype:'html'
            })
            .done( (data) => {
                let html = $($.parseHTML(data));    //HTMLデータに変換
                let title = html.filter('title')[0].innerHTML;  //タイトルタグの情報を取得
                let desc = html.filter('#game_description')[0].value;  //タイトルタグの情報を取得
                $('#app_name').html(title); //アプリ名をセット
                $('#app_description').html(desc); //アプリの説明をセット
            })
            ;
            //ゲーム画面が表示されるようにスクロールする
            let frame_rect = frame.getBoundingClientRect();
            console.log(frame_rect.top);
            window.scrollTo({
                top: frame_rect.top,
                left: 0,
                behavior: 'smooth'
            });
        });
    };
});
