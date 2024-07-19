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
const commonCategory = 0x0001, // 全オブジェクト共通のカテゴリ
jikiCategory = 0x0002, // 自機オブジェクトのカテゴリ
blockCategory = 0x0004, // 破壊可能ブロックオブジェクトのカテゴリ
bossCategory = 0x0008; // ボスオブジェクトのカテゴリ
const WIDTH  = 830;
let wall_left, wall_right, wall_top;
let stage = 1;
let substage = 0;
let setstage = true;
let score = 0;
let jikix=400;
let jikiy=550;
let jikihp=100;
let mousex=0;
let mousey=0;
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
let misstimer = 0;
let gameover = false;
let extend = 0;
let shield = false;
let invincible = 120;
let retflag = false;
let collision_id = null;
let tact = 0;
var blocks = [];
var tamas = [];
var atacks = [];

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
  wall_left = new Wall(15, 300, 30, 600, 0, true, "red");
  wall_right = new Wall(815, 300, 30, 600, 0, true, "red");
  wall_top = new Wall(415, 15, 770, 30, 0, true, "red");
  jiki = new Jiki(jikix,jikiy);
  
  //ブロックの種類を設定
  heavy=new BlockType(2,"#C83232","#800000",50);
  middle=new BlockType(1.6,"#32D232","#008000",30);
  light=new BlockType(1.2,"#78A0FF","#0075AD",10);
  
  // 物理世界を更新
  const runner = Runner.create();
  Runner.run(runner, engine);
  //衝突判定
  Matter.Events.on(engine, "collisionStart", function(event) {
    let pairs = event.pairs;
    pairs.forEach(function(pair) {//pairs配列をすべて見ていくループ
        
        if (pair.bodyA.target) {
          if(pair.bodyA.jiki&&shield)
            {shield=false;
              invincible=180;
            }
          if(!pair.bodyA.jiki||!invincible>0){
            let blockangle=Math.atan2(pair.collision.tangent.x,pair.collision.tangent.y);
            let incidence=Math.PI/2-blockangle+pair.bodyB.angle;
            let reflectionangle=Math.PI-incidence;
            let power=Math.cos(incidence-reflectionangle)+1;
            let damege=pair.bodyB.speed*pair.bodyB.mass*pair.bodyB.damegeRate*power;
            pair.bodyA.hp=pair.bodyA.hp-damege;
            console.log(pair.collision.tangent.x,pair.collision.tangent.y);
            console.log(blockangle,pair.bodyB.angle,incidence,reflectionangle,power,damege);
          if(!pair.bodyA.jiki)score=score+damege;
          if(pair.bodyA.jiki)jikihp=pair.bodyA.hp;
          if(pair.bodyA.hp<=0){
            if(pair.bodyA.jiki){
              miss=true;
              pair.bodyA.render.sprite.texture=pair.bodyA.render.sprite.miss;
              misstimer=120;
            }else{
              Body.setStatic(pair.bodyA, false);
              Body.setMass(pair.bodyA,pair.bodyA.massset);
              pair.bodyA.target=false;
              pair.bodyA.render.fillStyle=pair.bodyA.render.fillStyle2;
              Body.setVelocity( pair.bodyA,{x: Math.cos(incidence)*damege/2, y: Math.sin(incidence)*damege/2});
              console.log(Math.cos(incidence),Math.sin(incidence),pair.bodyA.velocity);
            }
          }
         }

        }
        if (pair.bodyB.target) {
          if(pair.bodyB.jiki&&shield)
            {shield=false;
              invincible=180;
            }
          if(!pair.bodyB.jiki||!invincible>0){
            let blockangle=Math.tan(pair.collision.tangent.x,pair.collision.tangent.y);
            let incidence=blockangle-pair.bodyA.angle+Math.PI/2;
            let reflectionangle=Math.PI-incidence;
            let power=Math.cos(incidence-reflectionangle)+1;
            let damege=pair.bodyA.speed*pair.bodyA.mass*pair.bodyA.damegeRate*power;
            pair.bodyB.hp=pair.bodyB.hp-damege;
//            console.log(power,damege);
          if(!pair.bodyB.jiki)score=score+damege;
          if(pair.bodyA.jiki)jikihp=pair.bodyB.hp;
          if(pair.bodyB.hp<=0){
            if(pair.bodyA.jiki){
              miss=true;
              pair.bodyB.render.sprite.texture=pair.bodyB.render.sprite.miss;
              misstimer=120;
            }else{
              Matter.Body.setStatic(pair.bodyB, false);
              Body.setMass(pair.bodyB,pair.bodyB.massset)
              pair.bodyB.target=false;
              pair.bodyB.render.fillStyle=pair.bodyB.render.fillStyle2;
            }
          }
          }
        }

 //       console.log(pair.bodyB.angle,blockangle,incidence,reflectionangle,power); //これで何がぶつかっているかがわかる
    });
  });

  
  world_canvas.addEventListener("click", event => {
    //  console.log(event.offsetX, event.offsetY);
    //  console.log(Math.sqrt(Math.pow(event.offsetX - jikix, 2) + Math.pow(event.offsetY - jikiy, 2)));
    if(shotwait<=0&&!miss){
      shot(Math.sqrt(Math.pow(event.offsetX - jikix, 2) + Math.pow(event.offsetY - jikiy, 2)));
      shotwait=10;
    }else if(miss&&misstimer==0){
      jikix=400;
      jikiy=550;
      jiki = new Jiki(jikix,jikiy);
      miss=false;
      jikihp=100;
      invincible=120;
    }
  });
  
  // マウスカーソルの位置の取得
  world_canvas.addEventListener("mousemove", event => {
    mousey=event.offsetY;
    mousex=event.offsetX;
  });
  //物理演算範囲外の描写
  context.beginPath();
  context.rect(830, 0, 470,600 );
  context.strokeStyle = "red";
  context.stroke();
  context.fillStyle = "red";
  context.fill();
  context.closePath();
  main();
}
//　Main関数

function main() {
  shotwait--;
  if(invincible>0){
    invincible--;
    if(invincible==0){
      jiki.body.render.sprite.texture=jiki.body.render.sprite.nomal;
    }
  }
  move();
  draw();
  window.requestAnimationFrame(main);
}
function move() {
  //キー入力状況に応じた自機の上下左右移動
  if (keyr&&!miss)jikix=jikix+3;
  if (keyl&&!miss)jikix=jikix-3;
  if (keyd&&!miss)jikiy=jikiy+3;
  if (keyu&&!miss)jikiy=jikiy-3;
  if (jikix<44)jikix=44;
  if (jikix>786)jikix=786;
  if (jikiy>586)jikiy=586;
  if (jikiy<400)jikiy=400;
  Matter.Body.setPosition(jiki.body, {x:jikix,y:jikiy});
  //自機の向きをマウスカーソルの方向にする処理
  jikiangle = Math.atan2(mousey-jikiy,mousex-jikix)
  Matter.Body.setAngle(jiki.body,jikiangle+Math.PI/2, [updateVelocity=false]);//90度分補正
}

//　描画関数
function draw() {
  if(!setstage){
    setblock(1);
    setstage=true;
  }
  //画面外に出た弾・ブロックの消滅
  for(i=0;i<tamas.length;){
    tamas[i].timer--
    if (tamas[i].timer==0) {
      tamas[i].body.collisionFilter.mask=commonCategory|blockCategory|bossCategory|jikiCategory;
    }
    if (tamas[i].isOffScreen()) {
      tamas[i].removeFromWorld();
      tamas.splice(i,1);
    }else{
      i++;
    }
  }
  for(i=0;i<blocks.length;){
    if (blocks[i].isOffScreen()) {
      blocks[i].removeFromWorld();
      blocks.splice(i,1);
    }else{
      i++;
    }
  }
  // console.log(blocks.length);
  if (blocks.length==0){
    setstage=false;
    substage++;
  }
  //ミスタイマーとミスした自機削除処理
  if(miss&&misstimer>0){
    misstimer--;
    if(misstimer==0){
      jiki.removeFromWorld();
    }
  }

  //物理演算範囲外の描写
  context.clearRect(830, 30, 340, 270);
  context.clearRect(830, 310, 340, 260);
  context.fillStyle = "black";
  context.font = "48px serif";
  context.fillText("STAGE", 850, 80);
  context.fillText(String(stage)+"-"+(substage), 1020, 80);
  context.fillText("Score", 850, 360);
  context.font = "40px serif";
  context.fillText(String(Math.floor(score)), 980, 360);
  context.beginPath();
  context.rect(850, 420, 300,40 );
  context.strokeStyle = "red";
  context.stroke();
  context.fillStyle = "red";
  context.fill();
  context.closePath();
  if(jikihp>=0){
    context.beginPath();
    context.rect(850, 420, jikihp*3,40 );
    context.strokeStyle = "green";
    context.stroke();
    context.fillStyle = "green";
    context.fill();
    context.closePath();
  }
  
}
//自機の弾発射処理
function shot(renge) {
  tamas.push(new Tama(jikix,jikiy,jikiangle,renge/30000))
}
function setblock(stage) {
  switch(stage){
    case 1:
    for(i=1;i<=3;i++){
      for(y=0;y<5;y++){
//        if(i==1)blocks.push(new Block(Math.random()*742+44,Math.random()*256+144,light,Math.floor(Math.random()*3)+3,Math.random()*10+10,Math.random()*2-1));
        if(i==1)blocks.push(new Block(Math.random()*742+44,400,light,4,30,Math.PI/4));
        if(i==2)blocks.push(new Block(Math.random()*742+44,Math.random()*256+144,middle,Math.floor(Math.random()*3)+3,Math.random()*10+10,Math.random()*2-1));
        if(i==3)blocks.push(new Block(Math.random()*742+44,Math.random()*256+144,heavy,Math.floor(Math.random()*3)+3,Math.random()*10+10,Math.random()*2-1));
      }
    }
  }
}
class Wall {
  //　コンストラクタ宣言
  constructor(x, y, w, h, a, s, c){
    let optisons = {
      target:false,
      restitution: 1,
      friction: 0,
      density: 1,
      angle: a,
      isStatic: s,
      render: {
        fillStyle: c
      },
      collisionFilter: {
        category: commonCategory
      },
    };
    this.body = Bodies.rectangle(x, y, w, h, optisons);
    Composite.add(world, this.body);
  }
}
class BlockType{
  constructor(ma, cl1, cl2,hp){
    this.mass=ma;
    this.coller1=cl1;
    this.coller2=cl2;
    this.hp=hp;
  }
}
class Block {
  //　コンストラクタ宣言
  constructor(x, y, type,hen, r, a){
    this.type=type;
    let optisons = {
      target:true,
      jiki:false,
      damegeRate:1,
      hp:type.hp,
      restitution: 1,
      friction: 0,
      massset: type.mass,
      angle: a,
      isStatic: true,
      render: {
        fillStyle: type.coller1,
        fillStyle2: type.coller2
      },
      collisionFilter: {
        category: blockCategory,
      },
    };
    this.body = Bodies.polygon(x, y, hen, r, optisons);
    Composite.add(world, this.body);
  }
  isOffScreen() {
    let pos = this.body.position;
    return ((pos.x < 0) || (pos.x > WIDTH) || (pos.y < 0) || (pos.y > 700));
  }
  removeFromWorld() {
    World.remove(world, this.body);
  }
}
class Jiki {
  //　コンストラクタ宣言
  constructor(x, y){
    let optisons = {
      target:true,
      jiki:true,
      restitution: 1,
      hp:100,
      friction: 0,
      density: 1,
      angle: 0,
      render: {
        fillStyle: "#2020ff",
        sprite: {
          texture:'./res/jiki_inv.png',
          nomal:'./res/jiki.png',
          muteki:'./res/jiki_inv.png',
          miss:'./res/jiki_miss.png',
          shield:'./res/jikib.png'
        }
      },
      collisionFilter: {
        category: jikiCategory
      },
      isStatic: true,
    };
    this.color = "blue";
    this.body = Bodies.trapezoid(x, y,20,30,0.6,optisons);
    Composite.add(world, this.body);
  }
  removeFromWorld() {
    World.remove(world, this.body);
  }
}
class Tama {
  //　コンストラクタ宣言
  constructor(x, y,ang,fce){
    let optisons = {
      target:false,
      damegeRate:4,
      restitution: 0.8,
      friction: 0,
      frictionAir: 0,
      angle: ang,
      render: {
        fillStyle: "#ffffff"
      },
      collisionFilter: {
        category: commonCategory,
        mask:commonCategory|blockCategory|bossCategory
      },
      force:{x:Math.cos(jikiangle)*fce,y:Math.sin(jikiangle)*fce},
      isStatic: false,
    };
    this.r = 10;
    this.timer=50;
    this.body = Bodies.circle(x, y, this.r, optisons);
    Composite.add(world, this.body);
  }
  
  //　ボールが画面外にはみ出たかを判定するメソッド
  isOffScreen() {
    let pos = this.body.position;
//    console.log(pos,this.body.speed,this.body);
    return ((pos.x < 0) || (pos.x > WIDTH) || (pos.y < 0) || (pos.y > 700));
  }
  
  removeFromWorld() {
    World.remove(world, this.body);
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
