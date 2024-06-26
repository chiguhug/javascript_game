/*
======================================================================
Project Name    : ゲーム開発
 
Copyright © 2024 大阪ヒューマンネット All Rights Reserved.
 
This source code or any portion thereof must not be  
reproduced or used in any manner whatsoever.
======================================================================
*/
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
            } else if (URL == "scratch") {
                $('#app_name').html("Please choose your favorite game!"); //アプリ名をセット
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
            const pos = $('#frame').position();
            window.scrollTo({
                top: pos.top,
                left: 0,
                behavior: 'smooth'
            });
        });
    };
});
