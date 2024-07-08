/*
======================================================================
Project Name    : 弾幕インベーダー
Creation Date   : 2024年6月
 
Copyright © 2024 大阪ヒューマンネット All Rights Reserved.
 
This source code or any portion thereof must not be  
reproduced or used in any manner whatsoever.
======================================================================
*/

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//初期設定
let x = 0;	//自機のx座標
let stage = 0;
let score = 0;
let keyr = false;
let keyl = false;
let shot = 0;
let power = 0;
let shotwait = 0;
let bomb = 2;	//インベーダのミサイルを破壊する爆弾の数
let bombwait = 50;
let zanki = 3;
// let stopeffect = 0;
let newstage = true;
let clear = true;
let miss = false;
let gameover = false;
let extend = 0;
let shield = false;
let invincible = 0;
let tx = 0;
let tmove = 2;
let tcount = 50;
let retflag = false;
let tact = 0;
var teki = [[], [], [], [], []];
var tama = [[], [], [], [], []];
var jtama = [];
var item = [];

document.write
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//自弾クラス
class Jtama {
  constructor(_alive, _x, _y, _image) {
    this.x = _x;
    this.y = _y;
    this.image = _image;
    this.alive = _alive;
  }
}
//アイテムクラス
class Item {
  constructor(_alive, _x, _y, _type) {
    this.x = _x;
    this.y = _y;
    this.alive = _alive;
    this.type = _type;
  }
}
//敵クラス
class Enemy {
  constructor(_alive, _x, _y, _image) {
    this.x = _x;
    this.y = _y;
    this.image = _image;
    this.alive = _alive;
  }
}
//敵弾クラス
class BombA {
  constructor(_alive, _image1, _image2, _image3) {
    this.image1 = _image1;
    this.image2 = _image2;
    this.image3 = _image3;
    this.alive = _alive;
    this.x = 0;
    this.y = 0;
    this.l = 0;
  }
}
class BombB {
  constructor(_alive, _image) {
    this.image = _image;
    this.alive = _alive;
    this.x = 0;
    this.y = 0;
    this.mx = 0;
    this.my = 0;
  }
}
class BombC {
  constructor(_alive, _image1, _image2) {
    this.imagea = _image1;
    this.imageb = _image2;
    this.alive = _alive;
    this.x = 0;
    this.chage = 0;
    this.limit = 0;
  }
}
class BombD {
  constructor(_alive, _image) {
    this.image = _image;
    this.alive = _alive;
    this.x = 0;
    this.y = 0;
    this.mx = 0;
    this.my = 0;
    this.ra = 0;
    this.ranow = 0;
    this.lenge = 0;
    this.lengemv = 0;
  }
}
//４アイテムのインスタンス生成
for (let i = 0; i <= 4; i++) {
  item[i]=new Item(false, 0, 0, 0);
}

//インベーダのインスタンス生成
for (let i = 0; i <= 4; i++) {
  for (let j = 0; j <= 9; j++) {
    switch (i) {
      case 0:
        teki[i][j] = new Enemy(false, j * 50, i * 50 + 50, "res/inv5_32x24.png");
        break;
      case 1:
        teki[i][j] = new Enemy(false, j * 50, i * 50 + 50, "res/inv4_32x24.png");
        break;
      case 2:
        teki[i][j] = new Enemy(false, j * 50, i * 50 + 50, "res/inv3_32x24.png");
        break;
      case 3:
        teki[i][j] = new Enemy(false, j * 50, i * 50 + 50, "res/inv2_32x24.png");
        break;
      case 4:
        teki[i][j] = new Enemy(false, j * 50, i * 50 + 50, "res/inv1_32x24.png");
        break;
    }
  }
}

//インベーダーの3Wayミサイルのインスタンス生成
for (let j = 0; j <= 30; j++) {
  tama[0][j] = new BombA(false, "res/tama1a_16x12.png", "res/tama1b_16x12.png", "res/tama1c_16x12.png");
}

//インベーダーの誘導弾ミサイルのインスタンス生成
for (let j = 0; j <= 5; j++) {
  tama[1][j] = new BombB(false, "res/tamat_16x12.png");
}

//インベーダーのレーザービームのインスタンス生成
for (let j = 0; j <= 3; j++) {
  tama[2][j] = new BombC(false, "res/tamaL4_32x24.png", "res/tamaL5_32x24.png");
}

//インベーダーの弾幕ミサイルのインスタンス生成
for (let j = 0; j <= 4; j++) {
  tama[3][j] = new BombD(false, "res/tamah_16x12.png");
}

//自機のミサイルのインスタンス生成
for (let i = 0; i <= 6; i++) {
  jtama[i] = new Jtama(false, 0, 0, "res/tamaji_16x12.png");
}

//自機表示・枠表示
function draw() {
  //自機の表示
	jikiimg = new Image();
  jikiimg.src = "res/jiki_32x24.png";
  if (!miss&&!shield) {	//ミス状態でない、かつシールド状態でない（通常状態のとき）
    if (invincible>0&&invincible%2==1){	//無敵タイマ起動中、かつ、カウントが奇数のとき
    }else{
      ctx.globalAlpha = 1;
    	ctx.drawImage(jikiimg, x, 450, 40, 40);
    }
  }else if (!miss&&shield) {	//ミス状態でない、かつシールド中
    jikisimg = new Image();
    jikisimg.src = "res/jikib_32x24.png";
    ctx.globalAlpha = 1;
    ctx.drawImage(jikisimg, x, 450, 40, 40);
  } else {	//ミスしたとき
    jikimissimg = new Image();
    ctx.globalAlpha = 0.4;
    jikimissimg.src = "res/jiki_miss_32x24.png";
    ctx.drawImage(jikimissimg, x - 10, 450 - 10, 60, 60);
    ctx.globalAlpha = 1;
  }

	//ゲーム枠の表示
  ctx.beginPath();
  ctx.rect(0, 0, 800, 500);
  ctx.strokeStyle = "rgba(0, 0, 255)";
  ctx.stroke();
  ctx.closePath();

	//残機、アイテム、スコアの枠表示
  ctx.beginPath();
  ctx.rect(800, 0, 20, 500);		//左枠
  ctx.rect(800, 0, 400, 20);		//上の枠
  ctx.rect(800, 300, 400, 20);	//真ん中の枠
  ctx.rect(800, 480, 400, 20);	//下の枠
  ctx.rect(1180, 0, 20, 500);		//右枠
  ctx.strokeStyle = "rgba(0, 0, 255)";	//輪郭を青色で指定
  ctx.stroke();	//枠線の描画
  ctx.fillStyle = "rgba(0, 0, 255)";		//塗りつぶす色を青色で指定
  ctx.fill();	//塗りつぶし
  ctx.closePath();

	//残機の表示
	if (zanki>=1&&zanki<=3){
		for (i=0;i<zanki;i++){
  		ctx.drawImage(jikiimg, 900 + i*100, 50, 60, 60);
		}
	}else if (zanki>3&&zanki<=6){
  	for (i=0;i<3;i++){
    	ctx.drawImage(jikiimg, 900 + i*100, 30, 60, 60);
  	}
    for (i=0;i<zanki-3;i++){
    	ctx.drawImage(jikiimg, 900 + i*100, 100, 60, 60);
  	}
	}else if (zanki>=7){
  	ctx.drawImage(jikiimg, 900, 50, 60, 60);
  	ctx.font = "48px serif";
  	ctx.fillText("✖", 1000, 100);
  	ctx.fillText(String(zanki), 1050, 100);
	}

	//ステージ数、スコアの表示
  ctx.font = "48px serif";
  ctx.fillText("STAGE", 850, 380);
  ctx.fillText(String(stage), 1020, 380);
  ctx.font = "48px serif";
  ctx.fillText("Score", 850, 430);
  ctx.fillText(String(score), 980, 430);

	//アイテムの表示
  bombimg = new Image();
  bombimg.src = "res/item_b.png";
  for (i=0;i<bomb;i++){
    ctx.drawImage(bombimg, 900 + i*100, 250, 60, 60);
  }
  powerimg = new Image();
  powerimg.src = "res/item_p.png";
  for (i=0;i<power;i++){
    ctx.drawImage(powerimg, 830 + i*70, 180, 60, 60);
  }
}
  
//自機のミサイル処理
function shotmove() {
  tamaimg = new Image();
  tamaimg.src = "res/tamaji_16x12.png";
  for (h = 0; h <= 6; h++){
  	if(jtama[h].alive){
			//ミサイルの移動と表示
    	if(!miss && !clear){
    		jtama[h].y--;
    	}
    	ctx.drawImage(tamaimg, jtama[h].x, jtama[h].y, 1, 10);

			//ミサイルと敵機との当たり判定
  		for (i = 0; i <= 4; i++){
    		for (j = 0; j <= 9; j++){
      		if(teki[i][j].alive){	//生きている敵がいたら
        		if (jtama[h].y <= i*50+74 && jtama[h].y > i*50+40){	//ミサイルの先頭の位置が敵の高さの範囲に入っているとき
          		if (jtama[h].x >= teki[i][j].x+tx && jtama[h].x <= teki[i][j].x+tx+32){	//ミサイルのx座標が敵の幅の範囲に入っているとき
    						teki[i][j].alive = false;	//敵を倒した状態にセットする
    						score = score+(5-i)*100;	//スコアを加算（上段の敵ほど得点が高い）
    						if (score >= (extend+1)*10000){	//	//1万点ごとに自機を増やす
      						zanki++;
      						extend++;
    						}
    						jtama[h].alive = false;	//ミサイルを消す
    						shot--;		//ミサイルの数を1つ減らす
    						tcount--;	//敵のカウント数を1つ減らす
    						dropchance(i, j);	//ドロップアイテムの抽選
    						if (tcount == 0){	//敵の数がゼロになったとき
      						clear = true;		//クリア状態にセット
      						// stopeffect = 0;	//ストップ効果をクリア
    						}
  						}
						}
					}
				}
			}
			if (jtama[h].y<0){	//ミサイルのy座標が上限を超えた（弾が敵に当たらなかった）
  			shot--;	//ミサイルの数を1つ減らす
  			jtama[h].alive=false;	//ミサイルを消す
			}
		}
	}
}

//敵・弾リセット処理
function nextstage() {
  clear = false;	//クリア状態を戻す

	//敵をすべて復活させる
  for (i = 0; i < teki.length; i++) {
    for (j = 0; j < teki[i].length; j++) {
      teki[i][j].alive = true;
    }
  }

	//各変数のクリア
  stage++;	//ステージ数を1つアップする
  shot = 0;	//ミサイルの数をクリア
  tcount = 50;	//敵のカウント数をクリア
  x = 0;	//自機のx座標をクリア
  tx = 0;	//インベーダの移動用のx座標
  tmove = 2;	//インベーダの移動量
  miss = false;	//ミス状態のクリア

  if (bomb == 0){	//インベーダのミサイルを破壊する爆弾が0個のとき
    bomb++;	//インベーダのミサイルを破壊する爆弾を1つ増やす
  }

	//自機のミサイルをすべて無効にする
  for (i = 0; i <= 6; i++) {
    jtama[i].alive = false;
  }

	//アイテムをすべて無効にする
  for (j = 0; j <= 4; j++) {
    item[j].alive = false;
  }

	tamareset();	//インベーダのミサイルをすべて無効にする
}
//インベーダのミサイルをすべて無効にする
function tamareset() {
	for (let i = 0; i < tama.length; i++) {
		for (let j = 0; j < tama[i].length; j++) {
			tama[i][j].alive = false;
		}
	}

}
//敵描写
function tdrow() {
  for (let i = 0; i < teki.length; i++) {
    for (let j = 0; j < teki[i].length; j++) {
      if (teki[i][j].alive) { //インベーダーが生存しているとき
        //インベーダーの描画
        let tekiimg = new Image();
        tekiimg.src = teki[i][j].image;
        ctx.drawImage(tekiimg, teki[i][j].x+tx, teki[i][j].y, 32, 24);
        if (!miss) {  //自機が被弾状態でないとき
        	if (teki[i][j].x+tx > 800-32){  //インベーダーが右端に到達したとき
          	tmove=-2; //左方向への移動にセット
        	}else if (teki[i][j].x+tx < 0){ //インベーダーが左端に到達したとき
          	tmove=2; //右方向への移動にセット
        	}
          shotchance(i, j); //インベーダーの攻撃の抽選
      	}
			}
		}
	}
  if (!miss) {  //自機が被弾状態でないとき
    //インベーダーの数に応じて移動速度を変える
    tact = tact + 1;  //カウントアップ
  	if (tact >= tcount) { //カウンタが生存しているインベーダーの数を超えたとき
    	tx = tx + tmove;  //  //インベーダーのx座標の更新
    	tact = 0; //カウンタをクリア
  	}
	}
}
//ドロップアイテム抽選
function dropchance(_i, _j){
  let ratio = Math.random()*100;  //アイテムの抽選
  if (ratio < 40) { //抽選結果が40より小さいとき（40%の確率でアイテムを落とす）
    for (let i = 0; i < item.length; i++) {
      if (!item[i].alive) { //アイテムが有効でないとき
        item[i].alive = true; //アイテムを有効とする
        item[i].x = teki[_i][_j].x + 12 + tx; //アイテムを落とすインベーダーのx座標をセット
        item[i].y = teki[_i][_j].y + 16; //アイテムを落とすインベーダーのy座標をセット
        if (ratio < 1) {  //抽選結果が1より小さいとき
          item[i].type = 5; //1機アップアイテムをセット
        } else if (ratio < 5) {  //抽選結果が5より小さいとき
          item[i].type = 4; //シールドアイテムをセット
        } else if (ratio < 10) {  //抽選結果が10より小さいとき
          item[i].type = 3; //ボムアイテムをセット
        } else if (ratio < 20) {  //抽選結果が20より小さいとき
          item[i].type = 2; //パワーアップアイテムをセット
        } else {  //抽選結果が上記以外のとき
          item[i].type = 1; //スコアアップアイテムをセット
        }
        break;
      }
    }
  }
}
//敵が弾を撃つかどうかの抽選
function shotchance(_i, _j){
  // let i = _i;
  // let j = _j;
  // let beemnow = false;
  let ratio;
  switch (_i) {
    //上から5段目と4段目のインベーダーのとき
    case 4:
    case 3:
      ratio = Math.random()*120000; //抽選
      if(ratio < stage*10 + 500 - tcount*10) {  //ステージ数と生き残っているインベーダーの数で抽選
        for(let k = 0; k < tama[0].length; k++) {  //全3Wayミサイルを走査
          if(!tama[0][k].alive){  //ミサイルが未発射のとき
            tama[0][k].alive = true;  //ミサイルを発射状態にセット
            tama[0][k].x = teki[_i][_j].x + 12 + tx;  //ミサイルのx座標を対象となるインベーダーのx座標にセット
            tama[0][k].y = teki[_i][_j].y + 16;  //ミサイルのy座標を対象となるインベーダーのy座標にセット
            tama[0][k].l = 0; //左右方向の移動量を0にセット
            break;
          }
        }
      }
      break;
    //上から3段目のインベーダーのとき
    case 2:
      ratio = Math.random()*800000; //抽選
      if (ratio < stage*10 + 500 - tcount*10) {  //ステージ数と生き残っているインベーダーの数で抽選
        for (let k = 0; k < tama[1].length; k++) {
          if (!tama[1][k].alive) {  //ミサイルが未発射のとき
            tama[1][k].alive = true;  //ミサイルを発射状態にセット
            tama[1][k].x = teki[_i][_j].x + 12 + tx;  //ミサイルのx座標を対象となるインベーダーのx座標にセット
            tama[1][k].y = teki[_i][_j].y + 16;  //ミサイルのy座標を対象となるインベーダーのy座標にセット
            break;
         }
        }
      }
      break;
    //上から2段目のインベーダーのとき
    case 1:
      ratio = Math.random()*200000; //抽選
      if(ratio < stage*10 + 500 - tcount*10) {  //ステージ数と生き残っているインベーダーの数で抽選
        for(k = 0; k < tama[2].length; k++) {
          let beemnow = false; //ビーム発射中でない状態をセット
          if (!tama[2][k].alive) {  //ミサイルが未発射のとき
            tama[2][k].alive = true;  //ビーム発射状態にセット
            tama[2][k].x = _j;  //ビームを発射するx座標をセット
            tama[2][k].chage = 0; //チャージ中をクリア
            tama[2][k].limit = 0; //リミットをクリア
            break;
          }
        }
      }
      break;
    //最上段のインベーダーのとき
    case 0:
      let xlenge = 0;
      let ylenge = 0;
      let angle = 0;
      ratio = Math.random()*8000000; //抽選
      if(ratio < stage*10 + 5000 - tcount*100) {  //ステージ数と生き残っているインベーダーの数で抽選
        for(let k = 0; k < tama[3].length; k++) {
          if (!tama[3][k].alive) {  //ミサイルが未発射のとき
            tama[3][k].alive = true; //ミサイル発射状態にセット
            tama[3][k].x = teki[_i][_j].x + 12 + tx;  //ミサイルのx座標を対象となるインベーダーのx座標にセット
            tama[3][k].y = teki[_i][_j].y + 16;  //ミサイルのy座標を対象となるインベーダーのy座標にセット
            tama[3][k].ra = Math.random()*0.02-0.04;
            tama[3][k].ranow = 0;
            tama[3][k].lengemv = Math.random()*0.2-0.4;
            tama[3][k].lenge = 20;
            xlenge = x + 20-tama[3][k].x;
            ylenge = 470 - tama[3][k].y;
            angle = Math.atan2(ylenge, xlenge);
            tama[3][k].mx = Math.cos(angle)*1;
            tama[3][k].my = Math.sin(angle)*1;
            break;
          }
        }
      }
      break;
  }
}

//アイテム落下処理
function itemmove(){
  for (k = 0; k < item.length; k++) {
    if (item[k].alive) {  //アイテム有効のとき
      if (!miss && !clear) {  //自機が被弾状態でない、かつ、クリア状態でない
       item[k].y++; //アイテムのy座標を更新
      }
      //アイテム画像の描画
      itemimga = new Image();
      itemimgb = new Image();
      itemimgc = new Image();
      itemimgd = new Image();
      itemimge = new Image();
      itemimga.src = "res/item_s.png";
      itemimgb.src = "res/item_p.png";
      itemimgc.src = "res/item_b.png";
      itemimgd.src = "res/item_sh.png";
      itemimge.src = "res/item_ex.png";
      switch (item[k].type){
        case 1:
          ctx.drawImage(itemimga, item[k].x, item[k].y, 40, 40);
          break;
        case 2:
          ctx.drawImage(itemimgb, item[k].x, item[k].y, 40, 40);
          break;
        case 3:
          ctx.drawImage(itemimgc, item[k].x, item[k].y, 40, 40);
          break;
        case 4:
          ctx.drawImage(itemimgd, item[k].x, item[k].y, 40, 40);
          break;
        case 5:
          ctx.drawImage(itemimge, item[k].x, item[k].y, 40, 40);
          break;
      }
      //アイテムがゲットされたときの処理
      if (item[k].y >= 400 && item[k].y <= 499) { //アイテムのy座標が400px～499pxのとき
        if (item[k].x >= x-14 && item[k].x <= x+40) { //アイテムのx座標が自機のx座標と重なったとき
          if (item[k].type == 1) {  //ゲットしたアイテムがスコアアップアイテムのとき
            score = score + 500;  //スコアに500点追加
          } else if (item[k].type == 2) {  //ゲットしたアイテムがパワーアップアイテムのとき
            if (power < 5){ //アイテム数が5個より小さいとき
              power++;  //アイテム数を増やす
            }else{  //アイテム数が5つ以上のとき
              score = score + 500; //スコアに500点追加
            }
          } else if (item[k].type == 3) {  //ゲットしたアイテムがボムアイテムのとき
            if (bomb < 3) { //アイテム数が3個より小さいとき
              bomb++; //アイテム数を増やす
            }else{  //アイテム数が3つ以上のとき
              score = score + 500; //スコアに500点追加
            }
          } else if (item[k].type == 4) {  //ゲットしたアイテムがシールドアイテムのとき
            if (!shield) {  //シールド中でないとき
              shield = true;  //シールド状態にセット
            } else {  //シールド中のとき
              score = score + 500; //スコアに500点追加
            }
          }else if (item[k].type == 5) {  //ゲットしたアイテムが1機アップアイテムのとき
            zanki++; //残機数を増やす
          }
          item[k].alive = false;  //アイテムを無効にする
        }
      }
      //アイテムが流れた時の処理
      if (item[k].y > 500) {  //アイテムのy座標が500pxを超えたとき
        item[k].alive = false;  //アイテムを無効にする
      }
    }
  }
}

//被弾処理
function hit(){
  if (!miss && !shield && invincible <= 0) {  //被弾状態でない、かつ、シールド中でない、かつ、無敵状態でないとき
    miss = true;  //被弾状態にセット
  } else if (shield) {  //シールド中のとき
    shield = false; //シールド状態解除
  }
  invincible = 300; //無敵期間をセット
}

//3Way弾の移動と描画
function tamamovea(){
  for (k = 0; k < tama[0].length; k++) {
    if (tama[0][k].alive) { //3Way弾が有効なとき
      if(!miss && !clear){  //自機が被弾状態でない、かつクリア状態でないとき
        tama[0][k].y = tama[0][k].y+1;  //3Way弾のy座標を1px増やす
        tama[0][k].l = tama[0][k].l+0.3;  //3Way弾の左右ミサイルのx座標を0.3増やす
      }
      //3Way弾の描画
      tamaimga = new Image();
      tamaimgb = new Image(); 
      tamaimgc = new Image(); 
      tamaimga.src = tama[0][k].image1;
      tamaimgb.src = tama[0][k].image2;
      tamaimgc.src = tama[0][k].image3;
      ctx.drawImage(tamaimga, tama[0][k].x, tama[0][k].y, 8, 12);
      ctx.drawImage(tamaimgb, tama[0][k].x-tama[0][k].l, tama[0][k].y, 8, 6);
      ctx.drawImage(tamaimgc, tama[0][k].x+tama[0][k].l, tama[0][k].y, 8, 6);

      //3Way弾と自機の当たり判定
      if(tama[0][k].y >= 460 && tama[0][k].y <= 474) {
        if (tama[0][k].x >= x+14 && tama[0][k].x <= x+20) {
          hit();  //被弾処理
        } else if (tama[0][k].x-tama[0][k].l >= x+18 && tama[0][k].x-tama[0][k].l <= x+24) {
          hit();  //被弾処理
        } else if (tama[0][k].x+tama[0][k].l >= x+18 && tama[0][k].x+tama[0][k].l <= x+24) {
          hit();  //被弾処理
        }
      }

      //3Way弾が流れていったときの処理
      if (tama[0][k].y > 500) {  //3Way弾のy座標が500pxを超えたとき
        tama[0][k].alive = false; //3Way弾を無効にする
      }
    }
  }
}

//誘導弾
function tamamoveb(){
  let xlenge=0;
  let ylenge=0;
  let angle=0;
  for(k=0;k<5;k++){
    if(tama[1][k].alive){
      if(!miss&&!clear){
        if(tama[1][k].y<400){
        xlenge=x+20-tama[1][k].x;
        ylenge=470-tama[1][k].y;
        angle = Math.atan2(ylenge, xlenge);
        tama[1][k].mx=Math.cos(angle)*2;
        tama[1][k].my=Math.sin(angle)*2;
      }
      tama[1][k].y=tama[1][k].y+tama[1][k].my;
      tama[1][k].x=tama[1][k].x+tama[1][k].mx;
      }
      tamaimg = new Image();
      tamaimg.src = tama[1][k].image;
      ctx.drawImage(tamaimg, tama[1][k].x, tama[1][k].y, 12, 12);
        if(tama[1][k].y>=460&&tama[1][k].y<=474){
        if(tama[1][k].x>=x+14&&tama[1][k].x<=x+20){
          hit();
        }
      }
      if(tama[1][k].y>500){
        tama[1][k].alive=false;
        }
    }}
}
//ビーーーーーーーーーーーーーーーーーーーーム
function tamamovec(){
  let xx=0;
  let yy=0;
  let body=0;
  for(k=0;k<3;k++){
    if(tama[2][k].alive){
      body=tama[2][k].x;
      xx=teki[1][body].x+tx;
      yy=teki[1][body].y;
      if(!teki[1][body].alive){
        tama[2][k].alive=false;
      }
        if(tama[2][k].chage<40){
          if(!miss&&!clear){
            tama[2][k].chage=tama[2][k].chage+0.05*stage;
          }
            tamaaimg = new Image();
            tamaaimg.src = tama[2][k].imagea;
            ctx.drawImage(tamaaimg, xx+16-tama[2][k].chage/2,yy+28-tama[2][k].chage/2, tama[2][k].chage,tama[2][k].chage);
      }else if(tama[2][k].limit<120+stage*20){
        if(!miss&&!clear){
          tama[2][k].limit++;
        }
        tamabimg = new Image();
        tamabimg.src = tama[2][k].imageb;
        ctx.drawImage(tamabimg, xx,yy+28, 24,500);
        if(xx>=x-4&&xx<=x+20){
          hit();
        }
    }else{
        tama[2][k].alive=false;
      }
      }
    }
  }
//スター
function tamamoved(){
  let rg = Math.PI*0.2;
  let xx = 0;
  let yy = 0;
  for(k=0;k<4;k++){
    if(tama[3][k].alive){
      if(!miss&&!clear){
      tama[3][k].x=tama[3][k].x+tama[3][k].mx;
      tama[3][k].y=tama[3][k].y+tama[3][k].my;
      tama[3][k].ranow=tama[3][k].ranow+tama[3][k].ra;
      tama[3][k].lenge=tama[3][k].lenge+tama[3][k].lengemv;
      }
      tamaimg = new Image();
      tamaimg.src = tama[3][k].image;
      for (i=1;i<=10;i++){
        if(i%2==1){
          xx=Math.cos(tama[3][k].ranow+rg*i)*tama[3][k].lenge/2;
          yy=Math.sin(tama[3][k].ranow+rg*i)*tama[3][k].lenge/2;
          }else{
            xx=Math.cos(tama[3][k].ranow+rg*i)*tama[3][k].lenge;
            yy=Math.sin(tama[3][k].ranow+rg*i)*tama[3][k].lenge;
        }

      ctx.drawImage(tamaimg, tama[3][k].x+xx, tama[3][k].y+yy, 8, 8);
        if(tama[3][k].y+yy>=460&&tama[3][k].y+yy<=474){
        if(tama[3][k].x+xx>=x+14&&tama[3][k].x+xx<=x+20){
          hit();
      }
    }}
      if(tama[3][k].y>1000){
        tama[3][k].alive=false;
        }
    }
  }
}

//リスポーン処理
function respone(){
  if (zanki >= 1) { //自機の残数が1以上のとき
    zanki--;  //自機の残数を1つ減らす
    bomb = 2; //ボムのアイテム数を2にセット
    power = Math.ceil(power/2);   //パワーアップアイテムの数を半分に減らす
    x = 0;  //x座標の初期化
    shot = 0; //ショット数の初期化
    //自機のミサイルの初期化
    for (let i = 0; i < jtama.length; i++) {
      jtama[i].alive = false;
    }
    miss=false; //被弾状態のクリア

    //インベーダーの3Wayミサイルの初期化
    for (let j = 0; j < tama[0]/length; j++) {
      tama[0][j].alive = false;
    }
    //インベーダーの誘導弾ミサイルの初期化
    for (let j = 0; j < tama[1].length; j++) {
      tama[1][j].alive = false;
    }
    //インベーダーのレーザービームの初期化
    for (let j = 0; j < tama[2].length; j++) {
      tama[2][j].alive = false;
    }
    //インベーダーの弾幕ミサイルの初期化
    for (j = 0; j < tama[3].length; j++) {
      tama[3][j].alive = false;
    }
    //アイテムの初期化
    for (j = 0; j < item.length; j++) {
      item[j].alive = false;
    }
  } else if (!gameover) { //残機がなく、かつ、ゲームオーバーでないとき
    gameover = true;  //ゲームオーバー状態にセット
  } else {  //上記以外の状態でもう一度キーが押されたとき
    gameover = false; //ゲームオーバー状態を初期化
    stage = 0;  //ステージ数を初期化
    zanki = 3;  //残機数を初期化
    score = 0;  //スコアを初期化
    extend = 0; //自機を増やすときの拡張数を初期化
    power = 0;  //パワーアップアイテム数を初期化
    nextstage();  //
  }
}
//クリア表示
function cleareffect() {
  clrimg = new Image();
  clrimg.src = "res/text_gameclear_e.png";
  if (stage != 0) { //初期表示中でないとき
    ctx.drawImage(clrimg, 100,200, 500, 100);
  }
}
//ゲームオーバー表示
function gameovereffect() {
  clrimg = new Image();
  clrimg.src = "res/text_gameover_e.png";
  ctx.drawImage(clrimg, 100,200, 500, 100);
}
//ボムエフェクト
function bombeffect() {
  ctx.beginPath();
  ctx.arc(x+20, 450, 40*bombwait, 0, Math.PI*2, false);
  ctx.fillStyle = "rgba(100,200,255,0.5)";
  ctx.fill();
  ctx.closePath();
}

//メイン処理
function game() {
  //キャンバスのクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //インベーダー、自機、ミサイル等の描画
  tdrow();
  draw();
  itemmove();
  tamamovea();
  tamamoveb();
  tamamovec();
  tamamoved();
  shotmove();

  //ボム爆発表示
  if (bombwait<20){
    bombeffect();
  }

  //クリア時の表示
  if (clear) {
    cleareffect();
  }

  //ゲームオーバー表示
  if (gameover) {
    gameovereffect();
  }

  //
  if(!miss&&!clear){  //自機が被弾状態でない、かつ、クリア状態でないとき
    if (keyl) { //左移動キー押下時
      x = x - 2;  //x座標を2pxずつ減らす
      if (x < 0) {  //左端に到達したとき
        x = 0;  //x座標に常に0をセット
      }
    }
    if (keyr) { //右移動キー押下時
      x = x + 2;  //x座標を2pxずつ増やす
      if (x > 760) {  //右端に到達したとき
        x = 760;  //x座標に常に760をセット
      }
    }
  }
  //各種カウンタのアップ、あたはダウン
  shotwait++;
  bombwait++;
  invincible--;

  //デバッグ用
	debug();
}
//メイン処理を定期的に実行
setInterval(game, 10);

//キー入力
function keyDownHandler(e) {
  if (!miss && !clear) {  //自機が被弾状態でない、かつ、クリア状態でないとき
    //右矢印キーまたはDキー押下
    if (e.key === 'ArrowRight' || e.key === 'd') {
      keyr = true;
    }
    //左矢印キーまたはAキー押下
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      keyl = true;
    }
    //スペースキー押下またはZキー押下、かつショットの数がパワーアップアイテム数以下、かつショット待ち中でないとき
    if ((e.key === ' ' || e.key === 'z') && shot <= power && shotwait > 20) {
      for (let i = 0; i < jtama.length; i++) {
        if (!jtama[i].alive) {  //自機のミサイルが未発射のとき
          jtama[i].alive = true;  //自機のミサイルを発射状態にセット
          jtama[i].x = x + 20;  //自機の中心のx座標をセット
          jtama[i].y = 450; //y座標をセット
          shotwait = 0; //ショット待ちカウンタをクリア（カウントスタート）
          shot++; //ショット数を1つ増やす
          break;
        }
      }      
    }
    //Xキー押下またはBキー押下時、かつ、ボムのアイテム数が1以上、かつボム待ち中でないとき
    if ((e.key === 'x' || e.key === 'b') && bomb >= 1 && bombwait > 250) {
      bombwait = 0; //ボム待ちカウンタをクリア
      bomb--; //ボムのアイテム数を1つ減らす
      tamareset();  //敵のミサイルをすべて無効化
    }
  }else{  //自機が被弾中、またはクリア状態
    keyr = false; //右キー押下状態をクリア
    keyl = false; //左キー押下状態をクリア
  }

  if (miss) { //自機が被弾したとき
    respone();  //自機の復活処理
  } else if (clear) { //クリアしたとき
    nextstage();  //次のステージにセット
  }
}

//キー開放
function keyUpHandler(e) {
  //右矢印キーまたはDキー押下
  if (e.key === 'ArrowRight' || e.key === 'd') {
    keyr = false; //右キー押下状態をクリア
  }
  //左矢印キーまたはAキー押下
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    keyl = false; //左キー押下状態をクリア
  }
}
function debug() {
	// console.log(x);
}
