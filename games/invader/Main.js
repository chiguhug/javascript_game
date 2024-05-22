var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//初期設定
let x=0;
let stage=1;
let score=0;
let keyr = false;
let keyl = false;
let shot = false;
let sx = -10;
let sy = -10;

let misseffect = 0;
let miss = false;
let gameover=false;
var jiki = new Image();
var jtama = new Image();

document.write
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//自機表示・枠表示
function draw() {
  if (!miss){
    jiki.src = "res/jiki_32x24.png";
    ctx.globalAlpha=1;
    ctx.drawImage(jiki, x, 450,40,40);
   } else {
  jiki.src = "res/jiki_miss_32x24.png";
  ctx.drawImage(jiki, x-10, 450-10,60,60);
  misseffect++;
}
  ctx.beginPath();
  ctx.globalAlpha=1;
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
  ctx.fillStyle  = "rgba(0, 0, 255)";
  ctx.fill();
  ctx.closePath();
}
//自弾処理
function shotmove() {
    jtama.src = "res/tamaji_16x12.png";
    ctx.drawImage(jtama, sx, sy,1,10);
    sy=sy-2;
    if(sy<0){
      shot=false;
    }
}
//リセット処理(未実装)
function restartGame(){
deatheffect = 0;
gamewait = false;
gameover=false;
Rex = 0;
Rem = 2;
Pressed = false;
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
function test(){
gameover=false;
}
//メイン処理
function game() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
draw();
if (shot){
  shotmove();
}
if (keyl){
  x=x-2;
  if(x<0){
    x=0;
  }
}
if (keyr){
  x=x+2;
  if(x>760){
    x=760;
  }
}
}
//メイン処理を定期的に実行
setInterval(game, 10);
//キー入力
function keyDownHandler(e) {
  if (e.key ===  'ArrowRight'&&!gameover&&!miss) {
    keyr=true;
  }
  if (e.key ===  'a'&&!gameover&&!miss) {
    keyr=true;
  }
  if (e.key ===  'ArrowLeft'&&!gameover&&!miss) {
    keyl=true;
  }
  if (e.key ===  'd'&&!gameover&&!miss) {
    keyl=true;
  }
  if (e.key === ' '&&!gameover&&!miss&&!shot) {
    shot=true;
    sx=x+20;
    sy=450;
  }else if(misseffect>20){
    miss=false;
    misseffect=0;
  }
  if (e.key === 'z'&&!gameover&&!miss&&!shot) {
    shot=true;
    sx=x+20;
    sy=450;
  }else if(misseffect>20){
    miss=false;
    misseffect=0;
  }
  if (e.key === 'p'&&!gameover&&!miss) {
    miss=true;
  }
}
  function keyUpHandler(e) {
    if (e.key ===  'ArrowRight') {
      keyr=false;
    }
    if (e.key ===  'a') {
      keyr=false;
    }
    if (e.key ===  'ArrowLeft') {
      keyl=false;
    }  
    if (e.key ===  'd') {
      keyl=false;
    }  
  }
 
  //以下各障害処理
