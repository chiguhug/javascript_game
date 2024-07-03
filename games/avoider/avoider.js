/*
======================================================================
Project Name    : 避けゲー
Creation Date   : 2024年5月
 
Copyright © 2024 大阪ヒューマンネット All Rights Reserved.
 
This source code or any portion thereof must not be  
reproduced or used in any manner whatsoever.
======================================================================
*/

var canvas = document.getElementById("myCanvas"); //キャンバスの取得
var ctx = canvas.getContext("2d");  //コンテキストの取得
//初期設定
let x=20; //スタート時の自キャラのx座標
let stage=1;  //ステージ番号
let Pressed = false;	//スペースキーが押されたかの判定フラグ
let Re = false;	//往路側（右に進んでいくステージ）にセット
let Rex = 0;	//障害物のx座標
let Rem = 2;	//障害物を揺らす演出用カウンタ
let deatheffect = 0;	//自キャラが倒れた時の演出用カウンタ
let gamewait = false;	//ゲームの一時停止フラグ
let gameover=false;		//ゲームオーバー
var img = new Image();	//自キャラの画像用オブジェクト生成

document.addEventListener("keydown", keyDownHandler, false);  //キー押下時のイベント登録
document.addEventListener("keyup", keyUpHandler, false);  //キー開放時のイベント登録

//自機表示
function draw() {
	if (!gameover){
		//ゲーム進行中の描画
		if(!Re){
			//左に移動しているときの自キャラの表示
			if(x%40<=10){
				img.src = "res/char001A1.png";
				ctx.drawImage(img, x-20, 140,40,40);
			}else if(x%40<=20){
				img.src = "res/char001A3.png";
				ctx.drawImage(img, x-20, 140,40,40);
			}else if(x%40<=30){
				img.src = "res/char001A2.png";
				ctx.drawImage(img, x-20, 140,40,40);
			}else{
				img.src = "res/char001A3.png";
				ctx.drawImage(img, x-20, 140,40,40);
			}
		}else{
			//右に移動しているときの自キャラの表示
			if(x%40<=10){
				img.src = "res/char001B1.png";
				ctx.drawImage(img, x-20, 140,40,40);
			}else if(x%40<=20){
				img.src = "res/char001B3.png";
				ctx.drawImage(img, x-20, 140,40,40);
			}else if(x%40<=30){
				img.src = "res/char001B2.png";
				ctx.drawImage(img, x-20, 140,40,40);
			}else{
				img.src = "res/char001B3.png";
				ctx.drawImage(img, x-20, 140,40,40);
			}
		}
	}else if(deatheffect<=20){
		//ゲームオーバー時の自キャラの消滅の描画
		ctx.beginPath();
		ctx.ellipse(x, 160, 20, 20-deatheffect, Math.PI, 0, Math.PI*2);
		ctx.fillStyle = "#DDDDDD";
		ctx.fill();
		ctx.closePath();
		deatheffect=deatheffect+0.2;
	}
	//ステージエリアの枠線の表示
	ctx.beginPath();
	ctx.rect(0, 0, 1200, 320);
	ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
	ctx.stroke();
	ctx.closePath();
}
//リセット処理
function restartGame(){
	deatheffect = 0;	//自キャラが倒れた時の演出用
	gamewait = false;
	gameover=false;
	Rex = 0;
	Rem = 2;
	Pressed = false;	//スペースキーが押された判定のクリア
	ex1=0;
	exm1=3.9;
	ex2 = 100;
	ey2 = 800;
	em2 = 1.9;
	e3 = false;
	em3 = 0;
	et3 = 0;
	er4 = 0;
	er5 = 0;
	e6 = false;
	ex6 = 200;
	em6 = 150;
	et6 = 0;
	re6 = false;
	rex6 = 900;
	rem6 = 150;
	ret6 = 0;
	ex7 = 500;
	ey7 = 120;
	eh7 = 160;
	em7 = 4;
	et7 = 0;
	evt=0;
	if(Re){
		x=1180;
	}else{
		x=20;
	}
}

//デバッグ用
function test(){
	gameover=false;	//ゲームを強制的に再開させる
}
//メイン処理
function game() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	//キャンバスのクリア
	//ステージ毎の処理
	switch(stage){
	case 0:
		clr();	//ステージクリア時の処理
		break;
	case 1:
		//第一ステージの障害物表示
		enemy1();	//左側の障害物の表示
		enemy2();	//右側の障害物の表示
		break;
	case 2:
		//第二ステージの障害物表示
		enemy3();
		break;
	case 3:
		//第三ステージの障害物表示
		enemy4();
		enemy5();
		break;
	case 4:
		//第四ステージの障害物表示
		if (Re) {
			reenemy6();
		}else{
			enemy6();
		}
		break;
	case 5:
		//第五ステージの障害物表示
		enemy7();
		break;
	case 6:
		//第六ステージの障害物表示
		tre();
		break;
	}
	window.focus(); //画面をフォーカスさせる

	draw();

	if (Re) {
		//復路側の処理
		Rex=Rex+Rem;
		evt++;	//復路時のイベント用のカウントアップ
		if (stage>=1&&stage<=5) {	//第一ステージから第五ステージのとき
			ReE();	//右から追いかけてくる障害物の表示
		}
		//障害物をゆらゆら揺らして少し難易度を上げる
		if (Rex>=10) {
			Rem=-1;
		}else if (Rex<=-10) {
			Rem=1;
		}
		if (!gameover&&!gamewait){	//ゲーム進行中のとき
			if (Pressed) {	//スペースキーが押されているとき
				x-=2;	//自キャラを左に移動する
			}
			if (x<=20) {	//ステージの左端に到達したか（ステージをクリアしたか）
				x=1180;	//次のステージの初期のx座標をセット
				stage--;	//ステージ数を減らす（次のステージにセットする）
				evt=0;	//イベント用のカウンタをクリア
			}
		}
	}else{
		//往路側の処理
		if (!gameover&&!gamewait){	//ゲームが進行中のとき
			if (Pressed) {	//スペースキーが押されているとき
				x+=2;	//自キャラを右に移動する
			}
			if (x>=1180) {	//ステージの右端に到達したか（ステージをクリアしたか）
				x=20;	//次のステージの初期のx座標をセット
				stage++;	//ステージ数を増やす（次のステージにセットする）
			}
		}
	}
}
//メイン処理を定期的（10msec毎）に実行
setInterval(game, 10);

//キー押下時のイベントハンドラー
function keyDownHandler(e) {
	if (e.key === " ") {	//スペースキーが押下された
		Pressed = true;	//スペースキーが押されている状態をセット
	}else if (e.key ===  'r'&&stage!=0) {	//rキーが押下された
		restartGame();	//ゲームを初期状態に戻す
	}else if (e.key ===  's') {	//sキーが押下された
    	x=1000;	//自キャラのx座標を1000まで強制的に移動させる（デバッグ用）
	}else if (e.key ===  'c') {	//sキーが押下された（デバッグ用）
		if (Re) {
			stage--;	//ステージ数を増やす（次のステージにセットする）
		} else {
			stage++;	//ステージ数を増やす（次のステージにセットする）
		}
  	}else if (e.key ===  't') {	//tキーが押下された
    	test();	//自キャラをその位置のままゲーム再開させる（デバッグ用）
  	}
}
//キー開放時のイベントハンドラー
function keyUpHandler(e) {
	if (e.key === " ") {
		Pressed = false;	//スペースキーが押されている状態をクリア
	}
}
//以下各障害処理

//第一ステージの左側の障害物の表示
let ex1=0;	//障害物のy軸
let exm1=3.9;	//障害物の上下方向の移動量
function enemy1() {
	//障害物の上下移動
    ctx.beginPath();
    ctx.rect(200+Rex, ex1, 100, 20);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
	ex1+=exm1;
	if (ex1>=320) {	//キャンバスエリアの一番下にきたとき
    	exm1=-3.9;	//移動量を上方向に切り替える
	}
	if (ex1<=-20) {	//キャンバスエリアの一番上にきたとき
    	exm1=3.9;	//移動量を下方向に切り替える
	}
	if (ex1>=140&&ex1<=160) {	//障害物のy軸が140～160の間にいるとき
    	if (x>=180&&x<=320) {	//自キャラのx座標が180～320の間にいるとき
      		gameover=true;	//障害物にぶつかったと判定し、ゲームオーバーの判定をセットする
    	}
	}
}

//第一ステージの右側の障害物の表示
let ex2 = 100;	//障害物の初期のy座標
let ey2 = 800;	//障害物の初期のx座標
let em2 = 1.9;	//正方向（横軸は右、縦軸は下）への移動量
function enemy2() {
	//障害物の上下左右移動
	ctx.beginPath();
	ctx.rect(ey2+Rex, ex2, 80, 80);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
	ex2+=em2;	//y軸方向への移動
	ey2-=em2;	//x軸方向への移動
	if (ex2>=240) {	//キャンバスの下に到達
		em2=-1.9;	//負の方向への移動に切り替える
 	}
 	if (ex2<=0) {	//キャンバスの上に到達
  		em2=1.9;	//正の方向への移動に切り替える
 	}
 	if (ex2>=80&&ex2<=160) {	//障害物のy軸が80～160の間にいるとき
  		if (x>=ey2-20&&x<=ey2+100) {	//自キャラのx軸と障害物の横幅の間にいるとき
    		gameover=true;	//障害物にぶつかったと判定し、ゲームオーバーの判定をセットする
  		}
 	}
}

//第二ステージの障害物の表示
let e3 = false;	//障害物が有効・無効判定を無効にセット
let em3 = 0;	//障害物を点滅判定をクリア
let et3 = 0;	//障害物の点滅用カウント
function enemy3() {
	ctx.beginPath();
	ctx.rect(200+Rex, 40, 240, 240);
	if (e3) {
		ctx.fillStyle = "red";	//障害物が有効のときの背景色
	}else{
		ctx.fillStyle = "rgb( 200, 200, 200 )";	//障害物が無効のときの背景色
	}
  	ctx.fill();
  	ctx.closePath();
	if (x>=100&&x<=540&&em3==0) {	//自キャラが障害物に近づいたとき
  		em3=1;	//障害物を点滅開始
  		et3=0;	//点滅用カウンタの初期化
  		e3=true;	//障害物を有効にセット
 	}
	if (em3!=0) {
  		et3++;	//点滅中はカウントアップ
 	}
	if (et3>=300&&et3<500) {	//点滅期間の3秒～5秒の間
		//0.2秒ごとに障害物を点滅させる
  		if (et3%20<=10) {
    		e3=true;
  		}else{
    		e3=false;
  		}
	}
	if (et3>=700) {	//点滅開始してから7秒経過後
  		em3=0;	//点滅を停止
	}
	if (e3) {	//障害物が有効の時（赤色の期間）
  		if (x>=180&&x<=460) {	//自キャラのx座標と障害物のx座標が重なった
    		gameover=true;	//障害物にぶつかったと判定し、ゲームオーバーの判定をセットする
  		}
 	}
}

//第三ステージの内側の円形障害物の表示
let er4 = 0;	//障害物の回転の移動量
function enemy4() {
	//回転しながら円形の障害物の表示
  	ctx.beginPath();
  	ctx.arc(500+Math.cos(er4)*100+Rex, 160+Math.sin(er4)*100, 20, 0,Math.PI*2, false);
  	ctx.fillStyle = "red";
  	ctx.fill();
  	ctx.closePath();
  	er4=er4+0.03;	//回転の移動量のセット
  	if (Math.sqrt((500+Math.cos(er4)*100-x)*(500+Math.cos(er4)*100-x)+(Math.sin(er4)*100)*(Math.sin(er4)*100))<=40) {
   		gameover=true;	//障害物にぶつかったと判定し、ゲームオーバーの判定をセットする
  	}
}

//第三ステージの外側の円形障害物の表示
let er5 = 0;	//障害物の回転の移動量
function enemy5() {
	//回転しながら円形の障害物の表示
	ctx.beginPath();
  	ctx.arc(500+Math.cos(er5)*250+Rex, 160+Math.sin(er5)*250, 20, 0,Math.PI*2, false);
  	ctx.fillStyle = "red";
  	ctx.fill();
  	ctx.closePath();
	er5=er5+0.05;	//回転の移動量のセット（内側の円より早い速度に設定）
	if (Math.sqrt((500+Math.cos(er5)*250-x)*(500+Math.cos(er5)*250-x)+(Math.sin(er5)*250)*(Math.sin(er5)*250))<=40) {
  		gameover=true;	//障害物にぶつかったと判定し、ゲームオーバーの判定をセットする
	}
}

//第四ステージの障害物表示
let e6 = false;		//障害物の仕掛けの稼働許可をクリア
let ex6 = 200;	//移動する障害物のベースとなるx座標
let em6 = 150;	//移動する障害物の演出用のカウンタ
let et6 = 0;	//障害物の仕掛け用のカウンタ
function enemy6() {
  	ctx.beginPath();

	//右側の障害物の表示（仕掛けの発動から20秒以降は障害物を表示しない）
  	if (et6<400) {
    	ctx.rect(ex6, 0, 20, 320);	//初期の障害物表示
  	}

	//左側の障害物の表示
	if (et6<20&&et6!=0) {
    	ctx.rect(ex6-em6+10-et6/2, 0, et6, 320);	//左側の障害物を徐々に表示させる演出
  	}else if (et6>=20) {
    	ctx.rect(ex6-em6, 0, 20, 320);	//2秒後以降は障害物を移動させながら常に表示させる
  	}
  	ctx.fillStyle = "yellow";
  	ctx.fill();
  	ctx.closePath();

	//自キャラが障害物に近づいたら仕掛けを稼働
  	if (x>=100) {
    	e6=true;	//障害物の仕掛けを稼働させる
   	}

   	if (e6) {
    	et6=et6+0.2;	//障害物の仕掛け用のカウンタをアップ
   	}

   	if (et6<50) {			//仕掛けの稼働後の0秒～2.5秒まで
		//処理なし（仕掛けとめる）
   	}else if (et6<250) {	//仕掛けの稼働後の2.5秒～12.5秒まで
    	ex6=ex6+0.5;	//障害物を右に移動（スピードは遅め）
    	em6=em6+0.1;	//左右の障害物の間隔を徐々に広げる
  	}else if (et6<280) {	//仕掛けの稼働後の12.5秒～14.0秒まで
		//処理なし（仕掛けとめる）
	}else if (et6<290) {	//仕掛けの稼働後の14.0秒～14.5秒まで
    	ex6=ex6-1.5;	//障害物を左に移動（スピードは少し早め）
  	}else if (et6<300) {	//仕掛けの稼働後の14.5秒～15.0秒まで
    	ex6=ex6+1.5;	//障害物を右に移動（スピードは少し早め）
  	}else if (et6<310) {	//仕掛けの稼働後の15.0秒～15.5秒まで
    	ex6=ex6-1.5;	//障害物を左に移動（スピードは少し早め）
  	}else if (et6<360) {	//仕掛けの稼働後の15.5秒～18.0秒まで
    	ex6=ex6+1.5;	//障害物を右に移動（スピードは少し早め）
  	}else if (et6<395) {	//仕掛けの稼働後の18.0秒～19.75秒まで
    	em6=em6-1;	//左側の障害物だけ右に移動
  	}else if (et6<460) {	//仕掛けの稼働後の19.75秒～23.0秒まで
  	}else{	//仕掛けの稼働後の23秒以降
    	ex6=ex6+4;	//障害物を右に移動（スピードは早め）
  	}
 
	//右の障害物との衝突判定
  	if (et6<=400&&x>ex6-20) {
    	gameover=true;	//障害物にぶつかったと判定し、ゲームオーバーの判定をセットする
  	}
	//左の障害物との衝突判定
	if (et6!=0&&x<ex6-em6+40) {
    	gameover=true;	//障害物にぶつかったと判定し、ゲームオーバーの判定をセットする
  	}
}

//折り返し後の第四ステージの障害物表示（enemy6()を逆再生した内容になっている）
let re6 = false;		//障害物の仕掛けの稼働許可をクリア
let rex6 = 900;	//移動する障害物のベースとなるx座標
let rem6 = 150;	//移動する障害物の演出用のカウンタ
let ret6 = 0;	//障害物の仕掛け用のカウンタ
function reenemy6() {
  	ctx.beginPath();
  	if (ret6<400) {
    	ctx.rect(rex6+Rex, 0, 20, 320);
  	}else if (ret6<420) {
    	ctx.rect(rex6+10-(420-ret6)/2+Rex, 0, 420-ret6, 320);
  	}

  	if (ret6<20&&ret6!=0) {
    	ctx.rect(rex6+rem6+10-ret6/2+Rex, 0, ret6, 320);
  	}else if (ret6>=20) {
    	ctx.rect(rex6+rem6+Rex, 0, 20, 320);
  	}
  	ctx.fillStyle = "yellow";
  	ctx.fill();
  	ctx.closePath();
  	if (x<=1000) {
    	re6=true;
   	}
   	if (re6) {
    	ret6=ret6+0.2;
   	}
   	if (ret6<50) {
   	}else if (ret6<250) {
    	rex6=rex6-0.5;
    	rem6=rem6+0.1;
  	}else if (ret6<280) {
  	}else if (ret6<290) {
    	rex6=rex6+1.5;
  	}else if (ret6<300) {
    	rex6=rex6-1.5;
  	}else if (ret6<310) {
    	rex6=rex6+1.5;
  	}else if (ret6<360) {
    	rex6=rex6-1.5;
  	}else if (ret6<395) {
    	rem6=rem6-1;
  	}else if (ret6<460) {
  	}else{
    	rex6=rex6-4;
  	}
 
  	if (ret6<=400&&x<rex6+40) {
    	gameover=true;
  	}
  	if (ret6!=0&&x>rex6+rem6-20) {
    	gameover=true;
  	}
}

//第五ステージの障害物の表示
let ex7 = 500;	//障害物のベースのx座標
let ey7 = 120;	//障害物の初期の頂点の位置
let eh7 = 160;	//隣の障害物との間隔
let em7 = 4;	//上下移動の移動量
let et7 = 0;	//第五ステージ用のカウンタ
function enemy7() {
	//上段一番左の障害物の表示
	ctx.beginPath();
	ctx.moveTo(ex7+Rex,ey7);
	ctx.lineTo(ex7-30+Rex,ey7-300);
	ctx.lineTo(ex7+30+Rex,ey7-300);
	ctx.closePath();
	ctx.fillStyle = "red";
	ctx.fill();
	//上段左から二番目の障害物の表示
	ctx.beginPath();
	ctx.moveTo(ex7+eh7+Rex,ey7);
	ctx.lineTo(ex7-30+eh7+Rex,ey7-300);
	ctx.lineTo(ex7+30+eh7+Rex,ey7-300);
	ctx.closePath();
	ctx.fillStyle = "red";
	ctx.fill();
	//上段左から三番目の障害物の表示
	ctx.beginPath();
	ctx.moveTo(ex7+eh7*2+Rex,ey7);
	ctx.lineTo(ex7-30+eh7*2+Rex,ey7-300);
	ctx.lineTo(ex7+30+eh7*2+Rex,ey7-300);
	ctx.closePath();
	ctx.fillStyle = "red";
	ctx.fill();
	//下段一番左の障害物の表示
	ctx.beginPath();
	ctx.moveTo(ex7+eh7*0.5+Rex,ey7);
	ctx.lineTo(ex7+eh7*0.5-30+Rex,ey7+300);
	ctx.lineTo(ex7+eh7*0.5+30+Rex,ey7+300);
	ctx.closePath();
	ctx.fillStyle = "red";
	ctx.fill();
	//下段左から二番目の障害物の表示
	ctx.beginPath();
	ctx.moveTo(ex7+eh7*1.5+Rex,ey7);
	ctx.lineTo(ex7+eh7*1.5-30+Rex,ey7+300);
	ctx.lineTo(ex7+eh7*1.5+30+Rex,ey7+300);
	ctx.closePath();
	ctx.fillStyle = "red";
	ctx.fill();
	//下段左から三番目の障害物の表示
	ctx.beginPath();
	ctx.moveTo(ex7+eh7*2.5+Rex,ey7);
	ctx.lineTo(ex7+eh7*2.5-30+Rex,ey7+300);
	ctx.lineTo(ex7+eh7*2.5+30+Rex,ey7+300);
	ctx.closePath();
	ctx.fillStyle = "red";
	ctx.fill();

	et7++;	//カウンタアップ
	ey7=ey7+em7;	//障害物管理用のy軸座標の増減
	if (ey7==200||ey7==120) {	//障害物の移動が下限か上限の位置になったとき
		if (em7!=0) {	//障害物が移動していたら
			em7=0;	//移動を止める
			et7=0;	//カウンタをクリアする
		}
	}
	if (et7==50) {	//カウンタクリア後、0.5秒経過時
		if (ey7==200) {	//障害物が下限に来た時
			em7=-4;	//障害物のy座標を上方向の移動量に切り替え
		}else {	//障害物が上限に来た時
			em7=+4;	//障害物のy座標を下方向の移動量に切り替え
		}
	}
	
	//障害物が下に移動しているとき
	if (ey7>=160) {
		//上段の障害物の頂点と自キャラのx座標が重なった時
		if ((x>=ex7-20&&x<=ex7+20)||(x>=ex7+eh7-20&&x<=ex7+eh7+20)||(x>=ex7+eh7*2-20&&x<=ex7+eh7*2+20)) {
			gameover=true;
		}
	}
	//障害物が上に移動しているとき
	if (ey7<=160) {
		//下段の障害物の頂点と自キャラのx座標が重なった時
		if ((x>=ex7+eh7*0.5-20&&x<=ex7+eh7*0.5+20)||(x>=ex7+eh7*1.5-20&&x<=ex7+eh7*1.5+20)||(x>=ex7+eh7*2.5-20&&x<=ex7+eh7*2.5+20)) {
			gameover=true;
		}
	}
}

//最終ステージの障害物の表示
let evt=0;	//	復路のイベント用カウンタをクリア
function tre() {
	//宝箱の表示
	ctx.beginPath();
	ctx.rect(550+Rex, 110, 100, 100);
	ctx.fillStyle = "yellow";
	ctx.fill();
	ctx.closePath();

	//右から追いかけてくる障害物の表示（最終ステージのみここで表示、他のステージはReE()で表示）
	if (Re) {
		ctx.beginPath();
		ctx.arc(1600-evt, 160, 400, 0,Math.PI*2, false);	//キャンバスをはみ出る大きめの円を描画
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
	}
	
	//自キャラが宝箱に近づいたら
	if (x>=550&&!Re) {
		gamewait=true;	//ゲームを一旦停止する
		Re=true;	//復路側にセット
		e3 = false;	//第二ステージ用の点滅フラグをクリア
		em3 = 0;	//第二ステージ用の点滅状態をクリア
		et3 = 0;	//第二ステージ用の点滅カウンタをクリア
	}
	if (evt>400) {	//ゲーム一旦停止してから4秒経過後
		gamewait=false;	//ゲームを再開させる
	}
	if (x>=1600-evt-400) {	//円（障害物）の左端のx座標とぶつかったか
		gameover=true;	//障害物にぶつかったと判定し、ゲームオーバーの判定をセットする
	}
}

//右から追いかけてくる障害物の表示（復路のみ）
function ReE() {
	ctx.beginPath();
	ctx.arc(2000-evt/2, 160, 400, 0,Math.PI*2, false);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
	//当たり判定
	if (x>=1600-evt/2) {	//円（障害物）の左端のx座標とぶつかったか
		gameover=true;	//障害物にぶつかったと判定し、ゲームオーバーの判定をセットする
	}
}

//ステージクリア時の処理
function clr() {
	Re=false;	//逆方向（左向き）に進むかの判定フラグをクリア
	gamewait=true	//ゲームを待ち状態にセット
	evt++;	//待ち時間計測用のカウンタをアップ
	if(evt<200){	//0秒～2秒間の処理
  		x=x-2;
	}else if(evt<300){	//2秒～3秒間の処理
		//キャンバスをはみ出る大きめの円を描画
		x--;
  		ctx.beginPath();
  		ctx.arc(2000-evt*2, 160, 400, 0,Math.PI*2, false);
  		ctx.fillStyle = "red";
  		ctx.fill();
  		ctx.closePath();
	}else if(evt<=700){	//3秒～7秒間の処理
		//y軸方向の半径を縮めながら敵を消滅させていく
		ctx.beginPath();
  		ctx.ellipse(1400, 160, 400, 700-evt, Math.PI, 0, Math.PI*2);
  		ctx.fillStyle = "#DDDDDD";
  		ctx.fill();
  		ctx.closePath();
	}
}
