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
let stopeffect = 0;let newstage = true;
let clear = true;
let miss = false;
let gameover = false;
let tx = 0;
let tmove = 2;
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
    this.l = _l;
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
  constructor(_alive, _image1, _image2,_x, _chage, _limit) {
    this.imagea = _image1;
    this.imageb = _image2;
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
    this.ra = _r;
    this.ranow = 0;
    this.lenge = 0;
    this.lengemv = 0;
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
  tama[i][j] = new tamac(false,"res/tamaL4_32x24.png","res/tamaL4_32x24.png",0, 0, 0);
}
i = 3;
for (j = 0; j <= 4; j++) {
  tama[i][j] = new tamad(false,"res/tamah_16x12.png",  0, 0,  0, 0,0);
}


//自機表示・枠表示
function draw() {
  jikiimg = new Image();
  jikiimg.src = "res/jiki_32x24.png";
  if (!miss) {
    ctx.globalAlpha = 1;
    ctx.drawImage(jikiimg, x, 450, 40, 40);
  } else {
    jikimissimg = new Image();
    ctx.globalAlpha = 0.4;
    jikimissimg.src = "res/jiki_miss_32x24.png";
    ctx.drawImage(jikimissimg, x - 10, 450 - 10, 60, 60);
    ctx.globalAlpha = 1;
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
if (zanki>=1&&zanki<=3){
for (i=0;i<zanki;i++){
  ctx.drawImage(jikiimg, 900 + i*100, 50, 60, 60);
}
}else if (zanki>3&&zanki<=6){
  for (i=0;i<3;i++){
    ctx.drawImage(jikiimg, 900 + i*100, 50, 60, 60);
  }
    for (i=0;i<zanki-3;i++){
    ctx.drawImage(jikiimg, 900 + i*100, 150, 60, 60);
  }
}else if (zanki>=7){
  ctx.drawImage(jikiimg, 900, 50, 60, 60);
  ctx.font = "48px serif";
  ctx.fillText("✖", 1000, 100);
  ctx.fillText(String(zanki), 1050, 100);
}
  ctx.font = "48px serif";
  ctx.fillText("Score", 900, 380);
  ctx.fillText(String(score), 900, 430);
}
//自弾処理
function shotmove() {
  tamaimg = new Image();  
  tamaimg.src = "res/tamaji_16x12.png";
  ctx.drawImage(tamaimg, sx, sy, 1, 10);
if(!miss){
  sy = sy - 2;
}
  for (i=0;i<=4;i++){
    if (sy<=i*50+74&&sy>i*50+40){
for (j=0;j<=9;j++){
  if (sx>=teki[i][j].x+tx&&sx<=teki[i][j].x+tx+32&&teki[i][j].alive){
    teki[i][j].alive=false;
    score=score+(5-i)*100;
    shot=false
    tcount--;
    if (tcount == 0){
      clear=true;
      stopeffect=0;
    }
  }
}}
  }
  if (sy < 0) {
    shot = false;
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
  tcount=50;
  x = 0;
  tx = 0;
  tmove = 2;
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
        if (!miss) {
        if (teki[i][j].x+tx>800-32){
          tmove=-2;
        }else if (teki[i][j].x+tx<0){
          tmove=2;
        }
            shotchance(i,j);
      }
      }}}
      if (!miss) {
        tact = tact + 1;
  if (tact >= tcount) {
    tx = tx + tmove;
    tact=0;
  }}
}
//敵が弾を撃つかどうかの抽選
function shotchance(_i,_j){
  i=_i;
  j=_j;
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
          if(!tama[2][k].alive){

            tama[2][k].alive=true;
            tama[2][k].x=j;
            tama[2][k].chage=0;
            tama[2][k].limit=0;
            break;
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
//3Way弾
function tamamovea(){
  for(k=0;k<30;k++){
    if(tama[0][k].alive){
      if(!miss&&!clear){
      tama[0][k].y=tama[0][k].y+1;
      tama[0][k].l=tama[0][k].l+0.3;
      }
      tamaimga = new Image();
      tamaimgb = new Image(); 
      tamaimgc = new Image(); 
      tamaimga.src = tama[0][k].image1;
      tamaimgb.src = tama[0][k].image2;
      tamaimgc.src = tama[0][k].image3;
      ctx.drawImage(tamaimga, tama[0][k].x, tama[0][k].y, 8, 12);
      ctx.drawImage(tamaimgb, tama[0][k].x-tama[0][k].l, tama[0][k].y, 8, 6);
      ctx.drawImage(tamaimgc, tama[0][k].x+tama[0][k].l, tama[0][k].y, 8, 6);
      if(!miss&&!clear){
        if(tama[0][k].y>=460&&tama[0][k].y<=474){
        if(tama[0][k].x>=x+14&&tama[0][k].x<=x+20){
          miss=true;
          stopeffect=0;
        }else if(tama[0][k].x-tama[0][k].l>=x+18&&tama[0][k].x-tama[0][k].l<=x+24){
          miss=true;
          stopeffect=0;
        }else if(tama[0][k].x+tama[0][k].l>=x+18&&tama[0][k].x+tama[0][k].l<=x+24){
          miss=true;
          stopeffect=0;
        }
      }
      if(tama[0][k].y>500){
        tama[0][k].alive=false;
        }
    }}
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
        if(tama[1][k].y<440){
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
      if(!miss&&!clear){
        if(tama[1][k].y>=460&&tama[1][k].y<=474){
        if(tama[1][k].x>=x+14&&tama[1][k].x<=x+20){
          miss=true;
          stopeffect=0;
        }
      }
      if(tama[1][k].y>500){
        tama[1][k].alive=false;
        }
    }}
  }
}
//ビーーーーーーーーーーーーーーーーーーーーム
function tamamovec(){
  let xx=0;
  let yy=0;
  for(k=0;k<3;k++){
    if(tama[2][k].alive){
      xx=teki[1][tama[2][k].x].x+tx;
      yy=teki[1][tama[2][k].x].y;
      if(!teki[1][k].alive){
        tama[2][k].alive=false;
      }
        if(tama[2][k].chage<24){
          if(!miss&&!clear){
            tama[2][k].chage=tama[2][k].chage+0.05*stage;
          }
            tamaaimg = new Image();
            tamaaimg.src = tama[2][k].imagea;
            ctx.drawImage(tamaaimg, xx+16-tama[2][k].chage/2,yy+28-tama[2][k].chage/2, tama[2][k].chage,tama[2][k].chage);
      }else if(tama[2][k].limit<80+stage*10){
        if(!miss&&!clear){
          tama[2][k].limit++;
        }
        tamabimg = new Image();
        tamabimg.src = tama[2][k].imageb;
        ctx.drawImage(tamabimg, xx,yy+28, 24,500);
        if(!miss){
          if(xx>=x-4&&xx<=x+20){
          miss=true;
          stopeffect=0;
        }}
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
      if(!miss){
        if(tama[3][k].y+yy>=460&&tama[3][k].y+yy<=474){
        if(tama[3][k].x+xx>=x+14&&tama[3][k].x+xx<=x+20){
          miss=true;
          stopeffect=0;
      }
    }}}
      if(tama[3][k].y>1000){
        tama[3][k].alive=false;
        }
    }
  }
}

//リスポーン処理
function respone(){
if(zanki >= 1){
  zanki--;
  x=0;
shot=false;
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
}else if (!gameover){
  gameover=true;
  stopeffect=0;
}else{
  gameover=false;
  stage =0;
  zanki =3;
  score=0;
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

//メイン処理
function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tdrow();
    draw();
    tamamovea();
    tamamoveb();
    tamamovec();
    tamamoved();
    if (shot) {
      shotmove();
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

  }
//メイン処理を定期的に実行
setInterval(game, 10);

//キー入力
function keyDownHandler(e) {
  if (!miss&&!clear) {
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
  } else if (stopeffect >= 50) {
    if(miss){
      respone();
    }else if(clear){
      nextstage();
    }

  }else{
    keyr = false;
    keyl = false;
  }
}
function keyUpHandler(e) {
  if (e.key === 'ArrowRight') {
    keyr = false;
  }
  if (e.key === 'd') {
    keyr = false;
  }
  if (e.key === 'ArrowLeft') {
    keyl = false;
  }
  if (e.key === 'a') {
    keyl = false;
  }
}
