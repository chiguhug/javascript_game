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
let substage = 1;
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
let ischarge=false;
let chargepower=0;
let refrectwait = 50;
let zanki = 3;
let respawnwait = 0;
let clear = true;
let miss = false;
let misstimer = 0;
let gameover = false;
let extend = 1;
let barrier=false;
let shield = null;
let shielddur=0;
let scharge = 150;
let invincible = 120;
let retflag = false;
let collision_id = null;
let tact = 0;
var blocks = [];
var tamas = [];
var atacks = [];
var items = [];
let cleartext=null;
let gameovertext=null;
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
        if(pair.bodyA.item||pair.bodyB.item){
          console.log("item!");
        }else if(pair.bodyA.shield){
          Body.setVelocity( pair.bodyB,{x: Math.cos(pair.bodyA.angle-Math.PI/2)*30, y: Math.sin(pair.bodyA.angle-Math.PI/2)*30});
        }else if (pair.bodyA.target) {
          if(pair.bodyA.jiki&&barrier)
            {barrier=false;
              invincible=180;
            }
          if(!pair.bodyA.jiki||!invincible>0){
            let blockangle=Math.atan2(pair.collision.tangent.x,pair.collision.tangent.y);
            let incidence=Math.atan2(pair.bodyB.position.y-pair.bodyB.positionPrev.y,pair.bodyB.position.x-pair.bodyB.positionPrev.x);
            let colangle=blockangle+incidence;
            let power=Math.cos(colangle);
            let damege=pair.bodyB.speed*pair.bodyB.mass*pair.bodyB.damegeRate*power;
            if(damege<0)damege=0;
              pair.bodyA.hp=pair.bodyA.hp-damege;
            console.log(blockangle,incidence,colangle,power,damege);
            // console.log(pair.bodyB.positionPrev,pair.bodyB.position);
          if(!pair.bodyA.jiki)score=score+damege;
          if(pair.bodyA.jiki)jikihp=pair.bodyA.hp;
          if(pair.bodyA.hp<=0){
            if(pair.bodyA.jiki&&!miss){
              miss=true;
              pair.bodyA.render.sprite.texture=pair.bodyA.render.sprite.miss;
              misstimer=120;
              zanki--;
              if(zanki<0)gameover=true;
            }else if(!pair.bodyA.jiki){
              Body.setStatic(pair.bodyA, false);
              Body.setMass(pair.bodyA,pair.bodyA.massset);
              pair.bodyA.target=false;
              pair.bodyA.render.fillStyle=pair.bodyA.render.fillStyle2;
              Body.setVelocity( pair.bodyA,{x: Math.cos(-blockangle)*pair.bodyB.speed*0.8, y: Math.sin(-blockangle)*pair.bodyB.speed*0.8});
              let refrectangle=pair.bodyB.angle+blockangle*2;
              Body.setVelocity( pair.bodyB,{x: -Math.cos(refrectangle)*pair.bodyB.speed*0.8, y: Math.sin(refrectangle)*pair.bodyB.speed*0.8});
              dropchance(pair.bodyA.position.x,pair.bodyA.position.y);
            }
          }
         }
        }

        if(pair.bodyA.item||pair.bodyB.item){

        }else if(pair.bodyB.shield){
          Body.setVelocity( pair.bodyA,{x: Math.cos(pair.bodyB.angle-Math.PI/2)*30, y: Math.sin(pair.bodyB.angle-Math.PI/2)*30});
        }else if (pair.bodyB.target) {
          if(pair.bodyB.jiki&&barrier)
            {barrier=false;
              invincible=180;
            }
          if(!pair.bodyB.jiki||!invincible>0){
            let blockangle=Math.atan2(-pair.collision.tangent.x,-pair.collision.tangent.y);
            let incidence=Math.atan2(pair.bodyA.position.y-pair.bodyA.positionPrev.y,pair.bodyA.position.x-pair.bodyA.positionPrev.x);
            let colangle=blockangle+incidence;
            let power=Math.cos(colangle);
            let damege=pair.bodyA.speed*pair.bodyA.mass*pair.bodyA.damegeRate*power;
            // console.log(blockangle,incidence,colangle,power,damege);
            if(damege<0)damege=0;
              pair.bodyB.hp=pair.bodyB.hp-damege;
          if(!pair.bodyB.jiki)score=score+damege;
          if(pair.bodyB.jiki)jikihp=pair.bodyB.hp;
          if(pair.bodyB.hp<=0){
            if(pair.bodyB.jiki&&!miss){
              miss=true;
              pair.bodyB.render.sprite.texture=pair.bodyB.render.sprite.miss;
              misstimer=120;
              zanki--;
              if(zanki<0)gameover=true;
            }else if(!pair.bodyA.jiki){
              Matter.Body.setStatic(pair.bodyB, false);
              Body.setMass(pair.bodyB,pair.bodyB.massset);
              pair.bodyB.target=false;
              pair.bodyB.render.fillStyle=pair.bodyB.render.fillStyle2;
              Body.setVelocity( pair.bodyB,{x: Math.cos(-blockangle)*pair.bodyA.speed*0.8, y: Math.sin(-blockangle)*pair.bodyA.speed*0.8});
              let refrectangle=pair.bodyA.angle+blockangle*2;
              Body.setVelocity( pair.bodyA,{x: -Math.cos(refrectangle)*pair.bodyA.speed/2, y: Math.sin(refrectangle)*pair.bodyA.speed/2});
              dropchance(pair.bodyB.position.x,pair.bodyB.position.y);
            }
          }
          }
        }
    });
  });

  world_canvas.addEventListener("contextmenu", event => {
    event.preventDefault();
  });
  
  world_canvas.addEventListener("mousedown", event => {
//    console.log(event.button);//event.buttonが0：左クリック　2右クリック　1ホイールクリック
    if(!miss&&setstage&&!clear&&event.button==0){
      ischarge=true;
      chargepower=0;
    }else if(event.button==2&&scharge==150&&!clear&&!miss){
      shield=new Shield();
      shielddur=30;
      scharge=0;
    }
    });

  world_canvas.addEventListener("mouseup", event => {
    if(!miss&&setstage&&!clear&&ischarge){
      shot(chargepower/2000);
    }else if(gameover&&misstimer==0){
      ischarge=false;
      restart();
    }else if(miss&&misstimer==0&&clear&&!gameover){
      jikix=400;
      jikiy=550;
      jiki = new Jiki(jikix,jikiy);
      miss=false;
      jikihp=100;
      invincible=120;
      setblock();
      substage++;
      cleartext.removeFromWorld();
    }else if(miss&&misstimer==0&&!gameover){
      jikix=400;
      jikiy=550;
      jiki = new Jiki(jikix,jikiy);
      miss=false;
      jikihp=100;
      invincible=120;
    }else if(clear&&!gameover){
      setblock();
      substage++;
      cleartext.removeFromWorld();
    }
    ischarge=false;
  });

  // world_canvas.addEventListener("click", event => {
  //   if(!miss&&setstage&&!clear){
  //     shot(Math.sqrt(Math.pow(event.offsetX - jikix, 2) + Math.pow(event.offsetY - jikiy, 2)));
  //   }else if(gameover&&misstimer==0){
  //     restart();
  //   }else if(miss&&misstimer==0&&clear&&!gameover){
  //     jikix=400;
  //     jikiy=550;
  //     jiki = new Jiki(jikix,jikiy);
  //     miss=false;
  //     jikihp=100;
  //     invincible=120;
  //     setblock();
  //     substage++;
  //     cleartext.removeFromWorld();
  //   }else if(miss&&misstimer==0&&!gameover){
  //     jikix=400;
  //     jikiy=550;
  //     jiki = new Jiki(jikix,jikiy);
  //     miss=false;
  //     jikihp=100;
  //     invincible=120;
  //   }else if(clear&&!gameover){
  //     setblock();
  //     substage++;
  //     cleartext.removeFromWorld();
  //   }
  // });

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
  setblock();
  main();
}
//　Main関数

function main() {
  if(invincible>0){
    invincible--;
    if(invincible==0){
      jiki.body.render.sprite.texture=jiki.body.render.sprite.nomal;
    }
  }
  if (ischarge&&chargepower<50){
    chargepower++;
  }
  extendcheck();
  move();
  draw();
  window.requestAnimationFrame(main);
}
function extendcheck(){
  if(score>extend*1000){
    zanki++;extend++;
  }
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
  for(i=0;i<items.length;){
    if (items[i].isOffScreen()) {
      getitem(items[i].body.itemtype,false);
      items[i].removeFromWorld();
      items.splice(i,1);
    }else{
      i++;
    }
  }
  // console.log(blocks.length);
  if (blocks.length==0){
    setstage=false;
    if(tamas.length==0&&!clear){
      clear=true;
      if(miss&&zanki<0){}else{
        cleartext=new Cleartext();
        }
    }
  }

  //ミスタイマーとミスした自機削除処理
  if(miss&&misstimer>0){
    misstimer--;
    if(misstimer==0){
      jiki.removeFromWorld();
      if(gameover){
        gameovertext=new Gameovertext();
      }
    }
  }
//シールドの持続時間管理と効果終了処理
if(shielddur>0){
  shielddur--;
  if(shielddur==0&&shield!=null){
console.log
    shield.removeFromWorld();
  }
}
if(scharge<150)scharge++;

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
  context.beginPath();
  if(zanki>=0&&zanki<=5){
    context.beginPath();
    for(i=1;i<=zanki;i++)context.fillText("💙", 800+i*50, 400);
    context.closePath();
  }else if(zanki>=6){
    context.fillText("💙", 850, 400)
    context.fill();
    context.fillStyle = "black";
    context.fillText("✖ "+zanki, 910, 400)
  }
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
  if(ischarge){
    context.beginPath();
    context.rect(850, 460, chargepower*6,5 );
    context.strokeStyle = "red";
    context.stroke();
    context.fillStyle = "red";
    context.fill();
    context.closePath();
  }
    context.beginPath();
    context.rect(850, 480, 300,40 );
    context.beginPath();
    context.rect(850, 520, scharge*2,40 );
    context.stroke();
    context.fillStyle = "#008080";
    context.fill();
    context.closePath();
}
function restart() {
  gameovertext.removeFromWorld();
  clearblock();
  cleartama();
  jikix=400;
  jikiy=550;
  jiki = new Jiki(jikix,jikiy);
  miss=false;
  jikihp=100;
  invincible=120;
  setblock();
  substage=1;
  zanki=3
  score=0
  extend=1
  scharge=300;
  gameover=false;
}

//自機の弾発射処理
function shot(power) {
  tamas.push(new Tama(jikix,jikiy,jikiangle,power));
}
function setblock() {
  switch(stage){
    case 1:
    for(i=1;i<=3;i++){
      for(y=0;y<5;y++){
        if(i==1)blocks.push(new Block(Math.random()*742+44,Math.random()*256+144,light,Math.floor(Math.random()*3)+3,Math.random()*10+10,Math.random()*2-1));
        if(i==2)blocks.push(new Block(Math.random()*742+44,Math.random()*256+144,middle,Math.floor(Math.random()*3)+3,Math.random()*10+10,Math.random()*2-1));
        if(i==3)blocks.push(new Block(Math.random()*742+44,Math.random()*256+144,heavy,Math.floor(Math.random()*3)+3,Math.random()*10+10,Math.random()*2-1));
        setstage=true;
        clear=false;
      }
    }
  }
}
function clearblock() {
  blocks.forEach(function(block) {
    block.removeFromWorld();
  });
  blocks.splice(0,blocks.length);
}
function cleartama() {
  tamas.forEach(function(tama) {
    tama.removeFromWorld();
  });
  tamas.splice(0,tamas.length);
}
function dropchance(x, y){
  let rate = Math.random()*100;  //アイテムの抽選
  if (rate < 1) {  //抽選結果が1より小さいとき
     items.push(new Item(x,y,5,'./res/item_ex.png')); //1機アップアイテムをセット
  } else if (rate < 5) {  //抽選結果が5より小さいとき
    items.push(new Item(x,y,4,'./res/item_sh.png')); //バリアアイテムをセット
  } else if (rate < 10) {  //抽選結果が10より小さいとき
    items.push(new Item(x,y,3,'./res/item_r.png')); //回復アイテムをセット
  } else if (rate < 20) {  //抽選結果が20より小さいとき
    items.push(new Item(x,y,2,'./res/item_p.png')); //パワーアップアイテムをセット
  } else if (rate < 40) { //抽選結果が40より小さいとき（40%の確率でアイテムを落とす）
    items.push(new Item(x,y,1,'./res/item_s.png')); //スコアアップアイテムをセット
  }
}
function getitem(type, get){
console.log(type,get);
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
      shield:false,
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
      shield:false,
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
class Shield {
  constructor(){
    let optisons = {
      target:false,
      shield:true,
      jiki:false,
      restitution: 1,
      friction: 0,
      density: 1,
      angle: jikiangle+Math.PI/2,
      render: {
        fillStyle: "#008080",
//        sprite: {
//          texture:'./res/jiki_inv.png'
//        }

      },
      collisionFilter: {
        category: jikiCategory
      },
      isStatic: true,
      isSensor: true,
    };
    this.body = Bodies.rectangle(jikix+Math.cos(jikiangle)*40, jikiy+Math.sin(jikiangle)*40, 60, 20, optisons);;
    Composite.add(world, this.body);
  }
  removeFromWorld() {
    World.remove(world, this.body);
  }
}
class Tama {
  //　コンストラクタ宣言
  constructor(x, y,ang,fce){
    this.power=fce;
    let optisons = {
      target:false,
      jiki:false,
      shield:false,
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
    this.body = Bodies.circle(jikix, jikiy, this.r, optisons);
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
class Item {
  //　コンストラクタ宣言
  constructor(x, y, type,img){
    let optisons = {
      target:false,
      jiki:false,
      shield:false,
      item:true,
      itemtype:type,
      restitution: 0.8,
      friction: 0,
      frictionAir: 0.1,
      angle: 0,
      render: {
        fillStyle: "#ffffff",
        sprite: {
          texture:img,
        }
      },
      collisionFilter: {
        category: commonCategory,
        mask:jikiCategory
      },
      isStatic: false,
      isSensor: true,
    };
    this.body = Bodies.circle(x, y, 40, optisons);
    Composite.add(world, this.body);
  }
  isOffScreen() {
    let pos = this.body.position;
    return ((pos.x < 0) || (pos.x > WIDTH) || (pos.y < 0) || (pos.y > 900));
  }
  removeFromWorld() {
    World.remove(world, this.body);
  }
}

class Cleartext{
  constructor(){
    let optisons = {
      isStatic: true,
      render: {
        fillStyle: "#2020ff",
        sprite: {
          texture:'./res/text_gameclear_e.png'
        }
      }
    }
    this.body = Bodies.circle(400, 300, 10, optisons);
    Composite.add(world, this.body);
  }
  removeFromWorld() {
    World.remove(world, this.body);
  }
}
class Gameovertext{
  constructor(){
    let optisons = {
      isStatic: true,
      render: {
        fillStyle: "#2020ff",
        sprite: {
          texture:'./res/text_gameover_e.png'
        }
      }
    }
    this.body = Bodies.circle(400, 300, 10, optisons);
    Composite.add(world, this.body);
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
