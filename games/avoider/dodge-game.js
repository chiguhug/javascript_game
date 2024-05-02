var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let x=20
let stage=1
let ex1=0
let exm1=4
let Pressed = false;
let gameRunning = true;
let gameover=false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function draw() {
  ctx.beginPath();
  ctx.arc(x, 160, 20, 0,Math.PI*2, false);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(0, 0, 1200, 320);
  ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  ctx.stroke();
  ctx.closePath();  
}
function check() {
  ctx.beginPath();
  ctx.arc(600, 50, 20, 0,Math.PI*2, false);
  if (gameover) {
    ctx.fillStyle = "rgb( 255, 0, 0 )";
  }else{
    ctx.fillStyle = "rgb( 0, 0, 255 )";
  }
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(0, 0, 1200, 320);
  ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  ctx.stroke();
  ctx.closePath();  
}
function startGame(){
x=20;
ex=0;
gameRunning = true;
gameover=false;
}
function test(){
  gameover=false;
  }
  
function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
switch(stage){
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
    }
  check();
  if (Pressed) {
      x+=2;
    }
    if (x>=1180) {
      x=20;
      stage++;
    }
    
}
     
    setInterval(game, 10);


  function keyDownHandler(e) {
    if (e.key === " "&& gameRunning) {
      Pressed = true;
    }else if (e.key === ' ' && !gameRunning) {
    startGame();
  }else if (e.key ===  'r') {
    startGame();
  }else if (e.key ===  't') {
    test();
  }
}
  
  function keyUpHandler(e) {
    if (e.key === " ") {
      Pressed = false;
    }
  }

  function enemy1() {
    ctx.beginPath();
    ctx.rect(200, ex1, 100, 20);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
ex1+=exm1;
if (ex1>=320) {
    exm1=-4;
   }
   if (ex1<=0) {
    exm1=4;
   }
   if (ex1>=140&&ex1<=160) {
    if (x>=180&&x<=320) {
      gameover=true;
    }
   }
}
let ex2 = 100;
let ey2 = 800;
let em2 = 4;
function enemy2() {
  ctx.beginPath();
  ctx.rect(ey2, ex2, 80, 80);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
ex2+=em2;
ey2-=em2;
if (ex2>=240) {
  em2=-2;
 }
 if (ex2<=0) {
  em2=2;
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
  ctx.rect(200, 40, 240, 240);
  if (e3) {
    ctx.fillStyle = "red";
  }else{
    ctx.fillStyle = "rgb( 200, 200, 200 )";
  }
  ctx.fill();
  ctx.closePath();
if (x>=100&&em3==0) {
  em3=1;
  et3=0;
  e3=true;
 }
 if (em3!=0) {
  et3++;
 }
 if (et3>=400&&et3<600) {
  if (et3%20<=10) {
    e3=true;
  }else{
    e3=false;
  }
 }
 if (et3>=1000) {
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
  ctx.arc(500+Math.cos(er4)*100, 160+Math.sin(er4)*100, 20, 0,Math.PI*2, false);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
  er4=er4+0.03;
  if (Math.sqrt((500+Math.cos(er4)*100-x)^2+(Math.sin(er4)*100)^2)<=40) {
    gameover=true;
  }
}
let er5 = 0;
function enemy5() {
  ctx.beginPath();
  ctx.arc(500+Math.cos(er5)*250, 160+Math.sin(er5)*250, 20, 0,Math.PI*2, false);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
er5=er5+0.05;
if (Math.sqrt((500+Math.cos(er5)*250-x)^2+(Math.sin(er5)*250)^2)<=40) {
  gameover=true;
}
}

