//matter初期設定
// 使用モジュール
const Engine     = Matter.Engine;
const Render     = Matter.Render;
const Runner     = Matter.Runner;
const Bodies     = Matter.Bodies;
const Common     = Matter.Common;
const Composite  = Matter.Composite;
const Mouse      = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;
const World = Matter.World;
const Body       = Matter.Body;

//初期変数設定
const WIDTH  = 830;
let wall_left, wall_right, wall_top;
let stage = 1;
let substage = 1;
let score = 0;
let jikix=50;
let jikiy=550;
let jikiangle=0;
let keyr = false;
let keyl = false;
let keyu = false;
let keyd = false;
let power = 0;
let shotwait = 0;
let refrectwait = 50;
let zanki = 3;
let respawnwait = 0;
let clear = true;
let miss = false;
let gameover = false;
let extend = 0;
let shield = false;
let invincible = 0;
let retflag = false;
let tact = 0;
var block = [];
var tama = [];
var atack = [];
jikiimg = new Image();
jikiimg.src = "res/jiki_32x24.png";

document.write
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
const init = () => {
  //キャンバスの取得
  canvas = document.getElementById("myCanvas");  //キャンバスの取得
  world_canvas = document.getElementById("worldCanvas");  //キャンバスの取得
  context = canvas.getContext("2d");
  wcontext = world_canvas.getContext("2d");
  width = canvas.width;   //キャンバスの幅をセット
  height = canvas.height; //キャンバスの高さをセット

// 物理エンジン本体のクラス
engine = Engine.create();
  world = engine.world;

// 画面を描画するクラス
render = Render.create({
  canvas: world_canvas,
  engine: engine,
  options: {
    width: WIDTH,   //横幅は制限する
    height: height, //キャンバスの高さに合わせる
    showIds: true,  //ID番号の表示を許可
    wireframes: false,
  }
});

Render.run(render);

  //　外枠を作成
wall_left = new Box(15, 300, 30, 600, 0, true, "red");
wall_right = new Box(815, 300, 30, 600, 0, true, "red");
wall_top = new Box(415, 15, 770, 30, 0, true, "red");
jiki = new Jiki(jikix,jikiy);

// 物理世界を更新
const runner = Runner.create();
Runner.run(runner, engine);
  
  // デバッグ用（クリックした位置の座標をコンソールに表示）
  world_canvas.addEventListener("click", event => {
    console.log(event.offsetX, event.offsetY);
    jikiangle = Math.atan2(event.offsetY-jikiy,event.offsetX-jikix);
  });
  main();
}
//　Main関数
function main() {
  move();
  draw();
  window.requestAnimationFrame(main);
}
function move() {
  console.log(jiki.body.angle);
  console.log(jikiangle);

  if (keyr)jikix=jikix+3;
  if (keyl)jikix=jikix-3;
  if (keyd)jikiy=jikiy+3;
  if (keyu)jikiy=jikiy-3;
  Matter.Body.setPosition(jiki.body, {x:jikix,y:jikiy});

  //Matter.Body.setAngle(jiki.Body,jikiangle, [updateVelocity=false]);
  jiki.body.angle=jikiangle;

}

//　描画関数
function draw() {
  wall_left.show();
  wall_right.show();
  wall_top.show();
  jiki.show();

  context.beginPath();
  context.rect(830, 0, 470,30 );
  context.rect(1170, 0, 30, 600);
  context.rect(830, 300, 470, 10);
  context.rect(830, 570, 470, 30);
  context.strokeStyle = "red";
  context.stroke();
  context.fillStyle = "red";
  context.fill();
  context.closePath();
}
class Box {
  //　コンストラクタ宣言
  constructor(x, y, w, h, a, s, c){
    let optisons = {
      restitution: 1,
      friction: 0,
      density: 1,
      angle: a,
      isStatic: s,
    };
    this.color = c;
    this.body = Bodies.rectangle(x, y, w, h, optisons);
    Composite.add(world, this.body);
  }

  //　表示用メソッド
  show() {
    let vertices = this.body.vertices;
    wcontext.beginPath(); //パスの作成
    wcontext.moveTo(vertices[0].x, vertices[0].y);
    wcontext.lineTo(vertices[1].x, vertices[1].y);
    wcontext.lineTo(vertices[2].x, vertices[2].y);
    wcontext.lineTo(vertices[3].x, vertices[3].y);
    wcontext.closePath();
    wcontext.fillStyle = this.color;
    wcontext.fill();
  }
}
class Jiki {
  //　コンストラクタ宣言
  constructor(x, y){
    let optisons = {
      restitution: 1,
      friction: 0,
      density: 1,
      angle: 0,
      isStatic: true,
    };
    this.color = "blue";
    this.body = Bodies.trapezoid(x, y,20,30,0.6,optisons);
    Composite.add(world, this.body);
  }

  //　表示用メソッド
  show() {
      let vertices = this.body.vertices;
      wcontext.beginPath(); //パスの作成
      wcontext.moveTo(vertices[0].x, vertices[0].y);
      wcontext.lineTo(vertices[1].x, vertices[1].y);
      wcontext.lineTo(vertices[2].x, vertices[2].y);
      wcontext.lineTo(vertices[3].x, vertices[3].y);
      wcontext.closePath();
      wcontext.fillStyle = this.color;
      wcontext.fill();
  }
  up(){

  }
}

//キー入力
function keyDownHandler(e) {
    if (e.key === 'd') keyr = true;
    if (e.key === 'w') keyu = true;
    if (e.key === 's') keyd = true;
    if (e.key === 'a') keyl = true;
  }
function keyUpHandler(e) {
  if (e.key === 'd') {
    keyr = false;
  }
  if (e.key === 'w') {
    keyu = false;
  }
  if (e.key === 's') {
    keyd = false;
  }
if (e.key === 'a') {
    keyl = false;
  }
}
