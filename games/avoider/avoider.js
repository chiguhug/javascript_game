var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//初期設定
let x=20;
let stage=1;
let Pressed = false;
let Re = false;
let Rex = 0;
let Rem = 2;
let gameRunning = true;
let deatheffect = 0;
let gamewait = false;
let gameover=false;
var img = new Image();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//自機表示
function draw() {

  if (!gameover){
    if(!Re){
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
  ctx.beginPath();
  ctx.ellipse(x, 160, 20, 20-deatheffect, Math.PI, 0, Math.PI*2);
  ctx.fillStyle = "#DDDDDD";
  ctx.fill();
  ctx.closePath();
  deatheffect=deatheffect+0.2;
}
  ctx.beginPath();
  ctx.rect(0, 0, 1200, 320);
  ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  ctx.stroke();
  ctx.closePath();
}
//リセット処理
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
switch(stage){
  case 0:
    clr();
  break;
  case 1:
    enemy1();
    enemy2();
  break;
  case 2:
    enemy3();
  break;
  case 3:
    enemy4();
    enemy5();
  break;
  case 4:
    if (Re) {
      reenemy6();
    }else{
      enemy6();
    }
  break;
  case 5:
    enemy7();
  break;
  case 6:
    tre();
  break;
}
draw();
if (Re) {
  Rex=Rex+Rem;
  evt++;
  if (stage>=1&&stage<=5) {
    ReE();
  }
  if (Rex>=10) {
    Rem=-1;
  }else if (Rex<=-10) {
    Rem=1;
  }
  if (!gameover&&!gamewait){
    if (Pressed) {
      x-=2;
    }
    if (x<=20) {
      x=1180;
      stage--;
      evt=0;
    }
  }
  }else{
    if (!gameover&&!gamewait){
      if (Pressed) {
        x+=2;
      }
      if (x>=1180) {
        x=20;
        stage++;
      }
    }
  }
}
//メイン処理を定期的に実行
setInterval(game, 10);
//キー入力
function keyDownHandler(e) {
  if (e.key === " ") {
    Pressed = true;
  }else if (e.key ===  'r'&&stage!=0) {
    restartGame();
  }else if (e.key ===  's') {
    x=1000;
  }else if (e.key ===  't') {
    test();
  }
}
  function keyUpHandler(e) {
  if (e.key === " ") {
    Pressed = false;
  }
}
//以下各障害処理
  let ex1=0;
  let exm1=3.9;
    function enemy1() {
    ctx.beginPath();
    ctx.rect(200+Rex, ex1, 100, 20);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
ex1+=exm1;
if (ex1>=320) {
    exm1=-3.9;
   }
   if (ex1<=-20) {
    exm1=3.9;
   }
   if (ex1>=140&&ex1<=160) {
    if (x>=180&&x<=320) {
      gameover=true;
    }
   }
}
let ex2 = 100;
let ey2 = 800;
let em2 = 1.9;
function enemy2() {
  ctx.beginPath();
  ctx.rect(ey2+Rex, ex2, 80, 80);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
ex2+=em2;
ey2-=em2;
if (ex2>=240) {
  em2=-1.9;
 }
 if (ex2<=0) {
  em2=1.9;
 }
 if (ex2>=80&&ex2<=160) {
  if (x>=ey2-20&&x<=ey2+100) {
    gameover=true;
  }
 }
}
let e3 = false;
let em3 = 0;
let et3 = 0;
function enemy3() {
  ctx.beginPath();
  ctx.rect(200+Rex, 40, 240, 240);
  if (e3) {
    ctx.fillStyle = "red";
  }else{
    ctx.fillStyle = "rgb( 200, 200, 200 )";
  }
  ctx.fill();
  ctx.closePath();
if (x>=100&&x<=540&&em3==0) {
  em3=1;
  et3=0;
  e3=true;
 }
 if (em3!=0) {
  et3++;
 }
 if (et3>=300&&et3<500) {
  if (et3%20<=10) {
    e3=true;
  }else{
    e3=false;
  }
 }
 if (et3>=700) {
  em3=0;
 }
 if (e3) {
  if (x>=180&&x<=460) {
    gameover=true;
  }
 }
}
let er4 = 0;
function enemy4() {
  ctx.beginPath();
  ctx.arc(500+Math.cos(er4)*100+Rex, 160+Math.sin(er4)*100, 20, 0,Math.PI*2, false);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
  er4=er4+0.03;
  if (Math.sqrt((500+Math.cos(er4)*100-x)*(500+Math.cos(er4)*100-x)+(Math.sin(er4)*100)*(Math.sin(er4)*100))<=40) {
    gameover=true;
  }
}
let er5 = 0;
function enemy5() {
  ctx.beginPath();
  ctx.arc(500+Math.cos(er5)*250+Rex, 160+Math.sin(er5)*250, 20, 0,Math.PI*2, false);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
er5=er5+0.05;
if (Math.sqrt((500+Math.cos(er5)*250-x)*(500+Math.cos(er5)*250-x)+(Math.sin(er5)*250)*(Math.sin(er5)*250))<=40) {
  gameover=true;
}
}

let e6 = false;
let ex6 = 200;
let em6 = 150;
let et6 = 0;
function enemy6() {
  ctx.beginPath();
  if (et6<400) {
    ctx.rect(ex6, 0, 20, 320);
  }else if (et6<420) {
    ctx.rect(ex6+10-(420-et6)/2, 0, 420-et6, 320);
  }

  if (et6<20&&et6!=0) {
    ctx.rect(ex6-em6+10-et6/2, 0, et6, 320);
  }else if (et6>=20) {
    ctx.rect(ex6-em6, 0, 20, 320);
  }
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
  if (x>=100) {
    e6=true;
   }
   if (e6) {
    et6=et6+0.2;
   }
   if (et6<50) {
   }else if (et6<250) {
    ex6=ex6+0.5;
    em6=em6+0.1;
  }else if (et6<280) {
  }else if (et6<290) {
    ex6=ex6-1.5;
  }else if (et6<300) {
    ex6=ex6+1.5;
  }else if (et6<310) {
    ex6=ex6-1.5;
  }else if (et6<360) {
    ex6=ex6+1.5;
  }else if (et6<395) {
    em6=em6-1;
  }else if (et6<460) {
  }else{
    ex6=ex6+4;
  }
 
  if (et6<=400&&x>ex6-20) {
    gameover=true;
  }
  if (et6!=0&&x<ex6-em6+40) {
    gameover=true;
  }
}

let re6 = false;
let rex6 = 900;
let rem6 = 150;
let ret6 = 0;
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

let ex7 = 500;
let ey7 = 120;
let eh7 = 160;
let em7 = 4;
let et7 = 0;
function enemy7() {
  ctx.beginPath();
  ctx.moveTo(ex7+Rex,ey7);
  ctx.lineTo(ex7-30+Rex,ey7-300);
  ctx.lineTo(ex7+30+Rex,ey7-300);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(ex7+eh7+Rex,ey7);
  ctx.lineTo(ex7-30+eh7+Rex,ey7-300);
  ctx.lineTo(ex7+30+eh7+Rex,ey7-300);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(ex7+eh7*2+Rex,ey7);
  ctx.lineTo(ex7-30+eh7*2+Rex,ey7-300);
  ctx.lineTo(ex7+30+eh7*2+Rex,ey7-300);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(ex7+eh7*0.5+Rex,ey7);
  ctx.lineTo(ex7+eh7*0.5-30+Rex,ey7+300);
  ctx.lineTo(ex7+eh7*0.5+30+Rex,ey7+300);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(ex7+eh7*1.5+Rex,ey7);
  ctx.lineTo(ex7+eh7*1.5-30+Rex,ey7+300);
  ctx.lineTo(ex7+eh7*1.5+30+Rex,ey7+300);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(ex7+eh7*2.5+Rex,ey7);
  ctx.lineTo(ex7+eh7*2.5-30+Rex,ey7+300);
  ctx.lineTo(ex7+eh7*2.5+30+Rex,ey7+300);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  et7++;
  ey7=ey7+em7;
  if (ey7==200||ey7==120) {
    if (em7!=0) {
      em7=0;
      et7=0;
    }
  }
  if (et7==50) {
    if (ey7==200) {
      em7=-4;
    }else {
      em7=+4;
    }
  }
 
  if (ey7>=160) {
    if ((x>=ex7-20&&x<=ex7+20)||(x>=ex7+eh7-20&&x<=ex7+eh7+20)||(x>=ex7+eh7*2-20&&x<=ex7+eh7*2+20)) {
      gameover=true;
    }
  }
  if (ey7<=160) {
    if ((x>=ex7+eh7*0.5-20&&x<=ex7+eh7*0.5+20)||(x>=ex7+eh7*1.5-20&&x<=ex7+eh7*1.5+20)||(x>=ex7+eh7*2.5-20&&x<=ex7+eh7*2.5+20)) {
      gameover=true;
    }
  }
}

let evt=0;
function tre() {
  ctx.beginPath();
  ctx.rect(550+Rex, 110, 100, 100);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();

  if (Re) {
    ctx.beginPath();
    ctx.arc(1600-evt, 160, 400, 0,Math.PI*2, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    }
 
  if (x>=550&&!Re) {
    gamewait=true;
    Re=true;
    e3 = false;
    em3 = 0;
    et3 = 0;
  }
  if (evt>400) {
    gamewait=false;
  }
}
function ReE() {
  ctx.beginPath();
  ctx.arc(2000-evt/2, 160, 400, 0,Math.PI*2, false);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
  if (x>=1600-evt/2) {
    gameover=true;
  }
}
function clr() {
  Re=false;
  gamewait=true
  evt++;
if(evt<200){
  x=x-2;
}else if(evt<300){
  x--;
  ctx.beginPath();
  ctx.arc(2000-evt*2, 160, 400, 0,Math.PI*2, false);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}else if(evt<=700){
  ctx.beginPath();
  ctx.ellipse(1400, 160, 400, 700-evt, Math.PI, 0, Math.PI*2);
  ctx.fillStyle = "#DDDDDD";
  ctx.fill();
  ctx.closePath();
 
}

}
