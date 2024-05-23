var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//初期設定
let x=0;
let stage=0;
let score=0;
let keyr = false;
let keyl = false;
let shot = false;
let sx = -10;
let sy = -10;
let zanki=3;
let stopeffect = 0;
let stop = false;
let newstage = true;
let clear =true;
let miss =false;
let gameover=false;
var jiki = new Image();
var jtama = new Image();
var tekia = new Image();
var tekib = new Image();
var tekic = new Image();
var tekid = new Image();
var tekie = new Image();
var tamaa1 = new Image();
var tamaa2 = new Image();
var tamaa3 = new Image();
var tamac = new Image();
var tamae = new Image();
let tekix = 0;
const talive = [[],[],[],[],[]];
const ttama = [[],[],[],[]];
const tcarge = [];
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
//敵・弾リセット処理
function nextstage(){
  if(!stop){
    clear=false;
    stop=true;
    stopeffect=0;
  }
  for (i=0;i<=5;i++){
    for (j=0;j<=10;j++){
      talive[i][j]=true;
    }
  }
  stage++;
  x=0;
  i=0;
  for (j=0;j<=30;j++){
    ttama[i][j]=false;
  }
  i=1;
  for (j=0;j<=5;j++){
    ttama[i][j]=false;
  }
  i=2;
  for (j=0;j<=3;j++){
    ttama[i][j]=false;
  }
  i=3;
  for (j=0;j<=4;j++){
    ttama[i][j]=false;
  }
}
//敵描写
function tdrow(){
  tekia.src = "res/inv1_32x24.png";
  tekib.src = "res/inv2_32x24.png";
  tekic.src = "res/inv3_32x24.png";
  tekid.src = "res/inv4_32x24.png";
  tekie.src = "res/inv5_32x24.png";
  for (i=0;i<=4;i++){
    for (j=0;j<=9;j++){
      if (talive[i][j]){
        console.log(talive[i][j]);
        switch(i){
          case 0:
            ctx.drawImage(tekia, tekix+j*50, i*50+50,32,24);
          break;
          case 1:
            ctx.drawImage(tekib, tekix+j*50, i*50+50,32,24);
          break;
          case 2:
            ctx.drawImage(tekic, tekix+j*50, i*50+50,32,24);
          break;
          case 3:
            ctx.drawImage(tekid, tekix+j*50, i*50+50,32,24);
          break;
          case 4:
            ctx.drawImage(tekie, tekix+j*50, i*50+50,32,24);
          break;
        }
        
      }
    }
  }
}

//被弾処理
function misseffect(){

}
//ゲームオーバー処理
function gameovereffect(){

}
//メイン処理
function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
if (clear){
  nextstage();
}
if (miss){
  misseffect();
}
if (gameover){
  gameovereffect();
}
tdrow();
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
stopeffect++

console.log(clear);
}
//メイン処理を定期的に実行
setInterval(game, 10);
//キー入力
function keyDownHandler(e) {
if (stop){
  if (e.key ===  'ArrowRight') {
    keyr=true;
  }
  if (e.key ===  'd') {
    keyr=true;
  }
  if (e.key ===  'ArrowLeft') {
    keyl=true;
  }
  if (e.key ===  'a') {
    keyl=true;
  }
  if (e.key === ' '&&!shot) {
    shot=true;
    sx=x+20;
    sy=450;
  }
  if (e.key === 'z'&&!shot) {
    shot=true;
    sx=x+20;
    sy=450;
  }
}else if(stopeffect>20){
  console.log(a);
  stop=false;
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
