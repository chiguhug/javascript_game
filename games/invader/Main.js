var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//初期設定
let x = 0;
let stage = 0;
let score = 0;
let keyr = false;
let keyl = false;
let shot = false;
let zanki = 3;
let stopeffect = 0;
let st = false;
let newstage = true;
let clear = true;
let miss = false;
let gameover = false;
let tx = 0;
let tmove = 1;
let tcount = 50;
let retflag = false;
let tact = 0;
var teki = [[], [], [], [], []];
var tama = [[], [], [], [], []];


document.write
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
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
  constructor(_alive, _image1, _image2, _image3, _x, _y, _l) {
    this.image1 = _image1;
    this.image2 = _image2;
    this.image3 = _image3;
    this.alive = _alive;
    this.x = _x;
    this.y = _y;
  }
}
class tamab {
  constructor(_alive, _image, _x, _y, _mx, _my) {
    this.image = _image;
    this.alive = _alive;
    this.x = _x;
    this.y = _y;
    this.mx = _mx;
    this.my = _my;
  }
}
class tamac {
  constructor(_alive, _x, _chage, _limit) {
    this.alive = _alive;
    this.x = _x;
    this.chage = _chage;
    this.limit = _limit;
  }
}
class tamad {
  constructor(_alive, _image, _x, _y,_mx, _my, _r) {
    this.image = _image;
    this.alive = _alive;
    this.x = _x;
    this.y = _y;
    this.mx = _mx;
    this.my = _my;
    this.r = _r;
  }
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
  tama[i][j] = new tamaa(false,"res/tama1a_16x12.png","res/tama1b_16x12.png","res/tama1c_16x12.png", false, 0, 0,0);
}
i = 1;
for (j = 0; j <= 5; j++) {
  tama[i][j] = new tamab(false,"res/tamat_16x12.png",  0, 0,0,0);
}
i = 2;
for (j = 0; j <= 3; j++) {
  tama[i][j] = new tamac(false,0, 0, 0);
}
i = 3;
for (j = 0; j <= 4; j++) {
  tama[i][j] = new tamad(false,"res/tamah_16x12.png",  0, 0,  0, 0,0);
}


//自機表示・枠表示
function draw() {
  jikiimg = new Image();
  if (!miss) {
    jikiimg.src = "res/jiki_32x24.png";
    ctx.globalAlpha = 1;
    ctx.drawImage(jikiimg, x, 450, 40, 40);
  } else {
    jikimg.src = "res/jiki_miss_32x24.png";
    ctx.drawImage(jikiimg, x - 10, 450 - 10, 60, 60);
    misseffect++;
  }
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
}
//自弾処理
function shotmove() {
  tamaimg = new Image();  
  tamaimg.src = "res/tamaji_16x12.png";
  ctx.drawImage(tamaimg, sx, sy, 1, 10);
  sy = sy - 2;
  for (i=0;i<=4;i++){
    if (sy<=i*50+74&&sy>i*50+40){
for (j=0;j<=9;j++){
  if (sx>=teki[i][j].x+tx&&sx<=teki[i][j].x+tx+32&&teki[i][j].alive){
    teki[i][j].alive=false;
    score=score+(5-i)*100;
    shot=false
  }
}}
  }


  if (sy < 0) {
    shot = false;
  }
}
//敵・弾リセット処理
function nextstage() {
  if (!st) {
    clear = false;
    st = true;
    stopeffect = 0;
  }
  for (i = 0; i <= 4; i++) {
    for (j = 0; j <= 9; j++) {
      teki[i][j].alive = true;
    }
  }
  stage++;
  tcount=50
  x = 0;
  tekix = 0;
  i = 0;
  shot=false;
  for (j = 0; j <= 30; j++) {
    tama[i][j].active = false;
  }
  i = 1;
  for (j = 0; j <= 5; j++) {
    tama[i][j].active = false;
  }
  i = 2;
  for (j = 0; j <= 3; j++) {
    tama[i][j].active = false;
  }
  i = 3;
  for (j = 0; j <= 4; j++) {
    tama[i][j].active = false;
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
      }
    }
  }

tact = tact + 50;
if (tact >= tcount) {
  tx = tx + tmove;
  console.log(tmove);
  tact=0;
  retflag = false;
  if (tmove==1){
      for (j = 9; j >= 0; j--) {
        if (tx>j*50+320){
        for (i = 0; i <= 4; i++) {
          if(teki[i][j].alive)
          retflag = true;
        }
      }}
      if(retflag){
      tmove=-1;
    }
  }else if (tmove==-1){
    for (j = 0; j <= 9; j++) {
      if (tx<j*(-50)){
      for (i = 0; i <= 4; i++) {
        if(teki[i][j].alive)
        retflag = true;
      }
    }
}
if(retflag){
  tmove=1;
}

}
console.log(retflag);
}
}
//被弾処理
function misseffect() {

}
//ゲームオーバー処理
function gameovereffect() {

}
//初期処理

//メイン処理
function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (clear) {
      nextstage();
    }
    if (miss) {
      misseffect();
    }
    if (gameover) {
      gameovereffect();
    }
    tdrow();
    draw();
    if (shot) {
      shotmove();
    }
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
    stopeffect++

  }
//メイン処理を定期的に実行
setInterval(game, 10);

//キー入力
function keyDownHandler(e) {
  if (st) {
    if (e.key === 'ArrowRight') {
      keyr = true;
    }
    if (e.key === 'd') {
      keyr = true;
    }
    if (e.key === 'ArrowLeft') {
      keyl = true;
    }
    if (e.key === 'a') {
      keyl = true;
    }
    if (e.key === ' ' && !shot) {
      shot = true;
      sx = x + 20;
      sy = 450;
    }
    if (e.key === 'z' && !shot) {
      shot = true;
      sx = x + 20;
      sy = 450;
    }
  } else if (stopeffect > 20) {
    console.log(a);
    st = false;
  }else{
    keyr = false;
    keyl = false;
  }
}
function keyUpHandler(e) {
  keyr = false;
  keyl = false;
}

//以下各障害処理
