var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//初期設定
let x = 0;
let stage = 0;
let score = 0;
let keyr = false;
let keyl = false;
let shot = 0;
let power = 0;
let shotwait = 0;
let bomb = 2;
let bombwait = 50;
let zanki = 3;
let stopeffect = 0;
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
class tekic {
  constructor(_alive, _x, _y, _image) {
    this.x = _x;
    this.y = _y;
    this.image = _image;
    this.alive = _alive;
  }
}
//敵弾クラス
class tamaa {
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
class tamab {
  constructor(_alive, _image) {
    this.image = _image;
    this.alive = _alive;
    this.x = 0;
    this.y = 0;
    this.mx = 0;
    this.my = 0;
  }
}
class tamac {
  constructor(_alive, _image1, _image2) {
    this.imagea = _image1;
    this.imageb = _image2;
    this.alive = _alive;
    this.x = 0;
    this.chage = 0;
    this.limit = 0;
  }
}
class tamad {
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
for (i = 0; i <= 4; i++) {
  item[i]=new Item(false,0,0,0)
}
for (i = 0; i <= 4; i++) {
  for (j = 0; j <= 9; j++) {
    switch (i) {
      case 0:
        teki[i][j] = new tekic(false,j * 50, i * 50 + 50, "res/inv5_32x24.png");
        break;
      case 1:
        teki[i][j] = new tekic(false,j * 50, i * 50 + 50, "res/inv4_32x24.png");
        break;
      case 2:
        teki[i][j] = new tekic(false,j * 50, i * 50 + 50, "res/inv3_32x24.png");
        break;
      case 3:
        teki[i][j] = new tekic(false,j * 50, i * 50 + 50, "res/inv2_32x24.png");
        break;
      case 4:
        teki[i][j] = new tekic(false,j * 50, i * 50 + 50, "res/inv1_32x24.png");
        break;
    }
  }
}
i = 0;
  for (j = 0; j <= 30; j++) {
        tama[i][j] = new tamaa(false, "res/tama1a_16x12.png", "res/tama1b_16x12.png", "res/tama1c_16x12.png");
    }
    i = 1;
    for (j = 0; j <= 5; j++) {
      tama[i][j] = new tamab(false, "res/tamat_16x12.png");
    }
      i = 2;
      for (j = 0; j <= 3; j++) {
        tama[i][j] = new tamac(false, "res/tamaL4_32x24.png", "res/tamaL5_32x24.png");
        }
        i = 3;
        for (j = 0; j <= 4; j++) {
          tama[i][j] = new tamad(false, "res/tamah_16x12.png");
        }
      for (i = 0; i <= 6; i++) {
        jtama[i] = new Jtama(false,0, 0, "res/tamaji_16x12.png");
}
//自機表示・枠表示
function draw() {
  ctx.beginPath();
  ctx.rect(0, 0, 800, 500);
  ctx.strokeStyle = "rgba(0, 0, 255)";
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(800, 0, 20, 500);
  ctx.rect(800, 0, 400, 20);
  ctx.rect(800, 300, 400, 20);
  ctx.rect(800, 480, 400, 20);
  ctx.rect(1180, 0, 20, 500);
  ctx.strokeStyle = "rgba(0, 0, 255)";
  ctx.stroke();
  ctx.fillStyle = "rgba(0, 0, 255)";
  ctx.fill();
  ctx.closePath();
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
  ctx.font = "48px serif";
  ctx.fillText("STAGE", 850, 380);
  ctx.fillText(String(stage), 1020, 380);
  ctx.font = "48px serif";
  ctx.fillText("Score", 850, 430);
  ctx.fillText(String(score), 980, 430);
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
  

//自弾処理
function shotmove() {
  tamaimg = new Image();
  tamaimg.src = "res/tamaji_16x12.png";
  for (h=0;h<=6;h++){
  if(jtama[h].alive){
    if(!miss&&!clear){
    jtama[h].y--;
    }
    ctx.drawImage(tamaimg, jtama[h].x, jtama[h].y, 1, 10);
  for (i=0;i<=4;i++){
    for (j=0;j<=9;j++){
      if(teki[i][j].alive){
        if (jtama[h].y<=i*50+74&&jtama[h].y>i*50+40){
          if (jtama[h].x>=teki[i][j].x+tx&&jtama[h].x<=teki[i][j].x+tx+32){
    teki[i][j].alive=false;
    score=score+(5-i)*100;
    if (score>=(extend+1)*10000){
      zanki++;
      extend++;
    }
    jtama[h].alive=false;
    shot--;
    tcount--;
    dropchance(i,j);
    if (tcount == 0){
      clear=true;
      stopeffect=0;
    }
  }
}}}}
if (jtama[h].y<0){
  shot--;
  jtama[h].alive=false;
}
}
}
}

//敵・弾リセット処理
function nextstage() {
    clear = false;
  for (i = 0; i <= 4; i++) {
    for (j = 0; j <= 9; j++) {
      teki[i][j].alive = true;
    }
  }
  stage++;
  shot =0;
  tcount=50;
  x = 0;
  tx = 0;
  tmove = 2;
  miss=false;
  if (bomb==0){
    bomb++;
  }
  for (i = 0; i <= 6; i++) {
    jtama[i].alive = false;
  }
  for (j = 0; j <= 4; j++) {
    item[j].alive = false;
  }
  
tamareset();
}
//敵弾消し
function tamareset() {
i = 0;
for (j = 0; j <= 30; j++) {
  tama[i][j].alive = false;
}
i = 1;
for (j = 0; j <= 5; j++) {
  tama[i][j].alive = false;
}
i = 2;
for (j = 0; j <= 3; j++) {
  tama[i][j].alive = false;
}
i = 3;
for (j = 0; j <= 4; j++) {
  tama[i][j].alive = false;
}
}
//敵描写
function tdrow() {
  for (i = 0; i <= 4; i++) {
    for (j = 0; j <= 9; j++) {
      if (teki[i][j].alive) {
        tekiimg = new Image();
        tekiimg.src = teki[i][j].image;
        ctx.drawImage(tekiimg, teki[i][j].x+tx, teki[i][j].y,32,24);
        if (!miss) {
        if (teki[i][j].x+tx>800-32){
          tmove=-2;
        }else if (teki[i][j].x+tx<0){
          tmove=2;
        }
            shotchance(i,j);
      }}}}
      if (!miss) {
        tact = tact + 1;
  if (tact >= tcount) {
    tx = tx + tmove;
    tact=0;
  }}
}
//ドロップアイテム抽選
function dropchance(_i,_j){
  i=_i;
  j=_j;
  xx=Math.random()*100;
  if(xx<40) {
    for(k=0;k<=4;k++){
      if(!item[k].alive){
        item[k].alive=true;
        item[k].x=teki[i][j].x+12+tx;
        item[k].y=teki[i][j].y+16;
        if(xx<1){
          item[k].type=5;
        } else if(xx<5){
          item[k].type=4;
        } else if(xx<10){
          item[k].type=3;
        } else if(xx<20){
          item[k].type=2;
        } else if(xx<40){
          item[k].type=1;
        }
        break;
  }
  }
}
}
//敵が弾を撃つかどうかの抽選
function shotchance(_i,_j){
  i=_i;
  j=_j;
  let beemnow=false;
  switch (i){
     case 4:
    case 3:
      xx=Math.random()*120000;
      if(xx<stage*10+500-tcount*10) {
        for(k=0;k<=30;k++){
          if(!tama[0][k].alive){
            tama[0][k].alive=true;
            tama[0][k].x=teki[i][j].x+12+tx;
            tama[0][k].y=teki[i][j].y+16;
            tama[0][k].l=0;
            break;
        }
      }
    }
    break;
    case 2:
      xx=Math.random()*800000;
      if(xx<stage*10+500-tcount*10) {
        for(k=0;k<=5;k++){
          if(!tama[1][k].alive){
            tama[1][k].alive=true;
            tama[1][k].x=teki[i][j].x+12+tx;
            tama[1][k].y=teki[i][j].y+16;
            break;
        }
      }
    }
    break;
    case 1:
      xx=Math.random()*200000;
      if(xx<stage*10+500-tcount*10) {
        for(k=0;k<=3;k++){
          beemnow=false;
          if(!tama[2][k].alive){
            for (l=0;l<=3;l++){
              if(tama[2][l].alive==true&&tama[2][l].x==j)
                beemnow=true;
            }
            if (!beemnow){
            tama[2][k].alive=true;
            tama[2][k].x=j;
            tama[2][k].chage=0;
            tama[2][k].limit=0;
            break;
          }
        }
      }
    }
    break;
    case 0:
        let xlenge=0;
        let ylenge=0;
        let angle=0;
      xx=Math.random()*8000000;
      if(xx<stage*10+5000-tcount*100) {
        for(k=0;k<=4;k++){
          if(!tama[3][k].alive){
            tama[3][k].alive=true;
            tama[3][k].x=teki[i][j].x+12+tx;
            tama[3][k].y=teki[i][j].y+16;
            tama[3][k].ra=Math.random()*0.02-0.04;
            tama[3][k].ranow=0;
            tama[3][k].lengemv=Math.random()*0.2-0.4;
            tama[3][k].lenge=20;
            xlenge=x+20-tama[3][k].x;
            ylenge=470-tama[3][k].y;
            angle = Math.atan2(ylenge, xlenge);
            tama[3][k].mx=Math.cos(angle)*1;
            tama[3][k].my=Math.sin(angle)*1;
            break;
        }
      }
    }
    break;
   }
}
function itemmove(){
  for(k=0;k<4;k++){
    if(item[k].alive){
      if(!miss&&!clear){
      item[k].y++;
      }
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
        if(item[k].y>=400&&item[k].y<=499){
        if(item[k].x>=x-14&&item[k].x<=x+40){
          if (item[k].type==1){
            score=score+500;
          }else if (item[k].type==2){
            if (power<5){
            power++;
          }else{
            score=score+500;
          }
          }else if (item[k].type==3){
            if (bomb<3){
              bomb++;
            }else{
              score=score+500;
            }
            }else if (item[k].type==4){
              if (!shield){
                shield=true;
              }else{
              score=score+500;
              }
          }else if (item[k].type==5){
            zanki++;
          }
          item[k].alive=false;
        }
      }
      if(item[k].y>500){
        item[k].alive=false;
        }
    }
  }
}
//被弾処理
function hit(){
  if(!miss&&!shield&&invincible<=0){
    miss=true;
    stopeffect=0;
}else if(shield)
  shield=false;
  invincible=300;
}

//リスポーン処理
function respone(){
if(zanki >= 1){
  zanki--;
  bomb=2;
  power=Math.ceil(power/2);  
  x=0;
shot=0;
for (i = 0; i <= 6; i++) {
  jtama[i].alive = false;
}
miss=false;
i = 0;
for (j = 0; j <= 30; j++) {
  tama[i][j].alive = false;
}
i = 1;
for (j = 0; j <= 5; j++) {
  tama[i][j].alive = false;
}
i = 2;
for (j = 0; j <= 3; j++) {
  tama[i][j].alive = false;
}
i = 3;
for (j = 0; j <= 4; j++) {
  tama[i][j].alive = false;
}
for (j = 0; j <= 4; j++) {
  item[j].alive = false;
}
}else if (!gameover){
  gameover=true;
  stopeffect=0;
}else{
  gameover=false;
  stage =0;
  zanki =3;
  score=0;
  extend = 0;
  power=0;
  nextstage();
}
}
//クリア表示
function cleareffect() {
  clrimg = new Image();
  clrimg.src = "res/text_gameclear_e.png";
  if (stage!=0){
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
  ctx.arc(x+20, 450, 40*bombwait, 0,Math.PI*2, false);
  ctx.fillStyle = "rgba(100,200,255,0.5)";
  ctx.fill();
  ctx.closePath();
}

//メイン処理
function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    if (bombwait<20){
      bombeffect();
    }
    if (clear) {
      cleareffect();
    }
    if (gameover) {
      gameovereffect();
    }
    if(!miss&&!clear){
    if (keyl) {
      x = x - 2;
      if (x < 0) {
        x = 0;
      }
    }
    if (keyr) {
      x = x + 2;
      if (x > 760) {
        x = 760;
      }
    }
  }
    stopeffect++;
    shotwait++;
  bombwait++;
  invincible--;
  }
//メイン処理を定期的に実行
setInterval(game, 10);

//キー入力
function keyDownHandler(e) {
  if (!miss&&!clear) {
    if (e.key === 'd') {
      keyr = true;
    }
    if (e.key === 'a') {
      keyl = true;
    }
  } else if (stopeffect >= 50) {
    if(miss){
      respone();
    }else if(clear){
      nextstage();
    }

  }else{
  }
}
function keyUpHandler(e) {
  if (e.key === 'd') {
    keyr = false;
  }
  if (e.key === 'a') {
    keyl = false;
  }
}
