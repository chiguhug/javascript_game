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
const commonCategory = 0x0001, // 共通オブジェクトのカテゴリ
jikiCategory = 0x0002, // 自機オブジェクトのカテゴリ
blockCategory = 0x0004, // 破壊可能ブロックオブジェクトのカテゴリ
bossCategory = 0x0008; // ボスオブジェクトのカテゴリ
const WIDTH  = 830;
const HEIGHT = 600;
let wall_left, wall_right, wall_top;
let jiki,boss;
let usecontext=false;
let stage = 1;
let substage = 1;
let maxstagetimer = 0;
let stagetimer = 0;
let bossstage = false;
var bossmovet = [0,0];
let bossstan = 0;
let setstage = true;
let grav=1;
let score = 0;
let jikix=400;
let jikiy=550;
let mousex=0;
let mousey=0;
let jikiangle=0;
let keyr = false;
let keyl = false;
let keyu = false;
let keyd = false;
let power = 4;
let ischarge=false;
let chargepower=0;
let refrectwait = 50;
let zanki = 3;
let respawnwait = 0;
let clear = true;
let clearMainstage=false;
let clearwait = 0;
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
let tact = 0;
var blocks = [];
var tamas = [];
var atacks = [];
var items = [];
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
const init = () => {
  //キャンバスの取得
  canvas = document.getElementById("myCanvas");  //キャンバスの取得
  world_canvas = document.getElementById("worldCanvas");  //キャンバスの取得
  context = canvas.getContext("2d");
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
      width: WIDTH,   //mattar用キャンバスの横幅に合わせる
      height: HEIGHT, //mattar用キャンバスの高さに合わせる
      showIds: false,  
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
  heavy=new BlockType(0.02,"#C83232","#800000");
  middle=new BlockType(0.012,"#32D232","#008000");
  light=new BlockType(0.005,"#78A0FF","#0075AD");
  
  // 物理世界を更新
  const runner = Runner.create();
  Runner.run(runner, engine);
  //衝突判定
  Matter.Events.on(engine, "collisionStart", function(event) {
    let pairs = event.pairs;
    pairs.forEach(function(pair) {//pairs配列をすべて見ていくループ
        if(pair.bodyA.item||pair.bodyB.item){
          if(pair.bodyA.item){
            getitem(pair.bodyA.itemtype,true);
            for(i=0;i<items.length;i++){
              if(items[i].body==pair.bodyA){
                items[i].removeFromWorld();
                items.splice(i,1);
              }
            }
          }else{
            if(pair.bodyB.item){
              getitem(pair.bodyB.itemtype,true);
              for(i=0;i<items.length;i++){
                if(items[i].body==pair.bodyB){
                  items[i].removeFromWorld();
                  items.splice(i,1);
                }
              }
            }
          }
        }else if(pair.bodyA.shield){
          Body.setVelocity( pair.bodyB,{x: Math.cos(pair.bodyA.angle-Math.PI/2)*30, y: Math.sin(pair.bodyA.angle-Math.PI/2)*30});
          pair.bodyB.damegeRate=2;
          if(pair.bodyB.bosstama){
            pair.bodyB.collisionFilter.mask=commonCategory|bossCategory|jikiCategory;
            pair.bodyB.damegeRate=4;
          }
        }else if (pair.bodyA.target) {
          if(pair.bodyA.jiki&&barrier){
            barrier=false;
            invincible=180;
            jiki.body.render.sprite.texture=jiki.body.render.sprite.muteki;
          }
          if(!pair.bodyA.jiki||!invincible>0){
            let blockangle=Math.atan2(pair.collision.tangent.x,pair.collision.tangent.y);
            let incidence=Math.atan2(pair.bodyB.position.y-pair.bodyB.positionPrev.y,pair.bodyB.position.x-pair.bodyB.positionPrev.x);
            let colangle=blockangle+incidence;
            let power=Math.cos(colangle);
            let damege=pair.bodyB.speed*pair.bodyB.mass*pair.bodyB.damegeRate*power;
            if(damege<0)damege=0;
              pair.bodyA.hp=pair.bodyA.hp-damege;
            // console.log(blockangle,incidence,colangle,power,damege);
            // console.log(pair.bodyB.positionPrev,pair.bodyB.position);
          if(!pair.bodyA.jiki)score=score+damege;
          if(pair.bodyA.boss){
            pair.bodyA.rage=pair.bodyA.rage+pair.bodyA.ragerate*damege;
            if(pair.bodyA.rage>100)pair.bodyA.rage=100;
          }
          if(pair.bodyA.hp<=0){
            if(pair.bodyA.jiki&&!miss){
              miss=true;
              pair.bodyA.render.sprite.texture=pair.bodyA.render.sprite.miss;
              misstimer=120;
              zanki--;
              if(zanki<0)gameover=true;
            }else if(!pair.bodyA.jiki&&!pair.bodyA.boss){
              Body.setStatic(pair.bodyA, false);
              Body.setDensity(pair.bodyA,pair.bodyA.densset);
              pair.bodyA.target=false;
              pair.bodyA.render.fillStyle=pair.bodyA.render.fillStyle2;
              Body.setVelocity( pair.bodyA,{x: Math.cos(-blockangle)*pair.bodyB.speed*0.8, y: Math.sin(-blockangle)*pair.bodyB.speed*0.8});
              pair.bodyA.collisionFilter.category=1;
              let refrectangle=pair.bodyB.angle+blockangle*2;
              Body.setVelocity( pair.bodyB,{x: -Math.cos(refrectangle)*pair.bodyB.speed*0.8, y: Math.sin(refrectangle)*pair.bodyB.speed*0.8});
              dropchance(pair.bodyA.position.x,pair.bodyA.position.y);
            }else if(pair.bodyA.boss){
              clear=true;
              clearMainstage=true;
              invincible=3000;
              jiki.body.render.sprite.texture=jiki.body.render.sprite.muteki;
              clearwait=200;
            }
          }
         }
        }

        if(pair.bodyA.item||pair.bodyB.item){

        }else if(pair.bodyB.shield){
          Body.setVelocity( pair.bodyA,{x: Math.cos(pair.bodyB.angle-Math.PI/2)*30, y: Math.sin(pair.bodyB.angle-Math.PI/2)*30});
          pair.bodyA.damegeRate=2;
          if(pair.bodyA.bosstama){
            pair.bodyA.collisionFilter.mask=commonCategory|bossCategory|jikiCategory;
            pair.bodyA.damegeRate=4;
          }
        }else if (pair.bodyB.target) {
          if(pair.bodyB.jiki&&barrier)
            {barrier=false;
              invincible=180;
              jiki.body.render.sprite.texture=jiki.body.render.sprite.muteki;
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
          if(pair.bodyB.boss){
            pair.bodyB.rage=pair.bodyB.rage+pair.bodyB.ragerate*damege;
            if(pair.bodyB.rage>100)pair.bodyB.rage=100;
          }
          if(pair.bodyB.hp<=0){
            if(pair.bodyB.jiki&&!miss){
              miss=true;
              pair.bodyB.render.sprite.texture=pair.bodyB.render.sprite.miss;
              misstimer=120;
              zanki--;
              if(zanki<0)gameover=true;
            }else if(!pair.bodyA.jiki&&!pair.bodyB.boss){
              Body.setStatic(pair.bodyB, false);
              Body.setDensity(pair.bodyB,pair.bodyB.densset);
              pair.bodyB.target=false;
              pair.bodyB.render.fillStyle=pair.bodyB.render.fillStyle2;
              Body.setVelocity( pair.bodyB,{x: Math.cos(-blockangle)*pair.bodyA.speed*0.8, y: Math.sin(-blockangle)*pair.bodyA.speed*0.8});
              pair.bodyB.collisionFilter.category=1;
              let refrectangle=pair.bodyA.angle+blockangle*2;
              Body.setVelocity( pair.bodyA,{x: -Math.cos(refrectangle)*pair.bodyA.speed/2, y: Math.sin(refrectangle)*pair.bodyA.speed/2});
              dropchance(pair.bodyB.position.x,pair.bodyB.position.y);
            }else if(pair.bodyB.boss){
              clear=true;
              clearMainstage=true;
              invincible=3000;
              jiki.body.render.sprite.texture=jiki.body.render.sprite.muteki;
              clearwait=200;
            }
          }
        }
      }
    });
  });

  canvas.addEventListener("contextmenu", event => {
    if(!usecontext){
      event.preventDefault();
    }
  });
  
  canvas.addEventListener("mousedown", event => {
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

  canvas.addEventListener("mouseup", event => {
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
      invincible=120;
      setblock();
      substage++;
    }else if(miss&&misstimer==0&&!gameover){
      jikix=400;
      jikiy=550;
      jiki = new Jiki(jikix,jikiy);
      miss=false;
      stagetimer=maxstagetimer;
      grav=1;
      world.gravity.y=grav;
      invincible=120;
    }else if(clear&&!gameover&&!clearMainstage&&clearwait<=0){
      substage++;
      setblock();
    }else if(clearMainstage&&clearwait<=0){
      score=score+stage*1000+jiki.body.hp*20;
      extendcheck();
      substage=1;
      stage++;
      invincible=20;
      jiki.body.hp=100;
      boss.removeFromWorld();
      setblock();
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
  canvas.addEventListener("mousemove", event => {
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
  if(!bossstage&&!clear){
    if(stagetimer>0){
      stagetimer--;
    }else{
      grav=grav+0.01;
      world.gravity.y=grav;
    }
  }
  if(bossstage&&!clear){
    if(boss.body.rageact>0){
      boss.body.rageact--;
      rageaction();
      if(boss.body.rageact==0)boss.body.rage=0;
    }else{
      boss.body.rage=boss.body.rage+boss.body.ragetimer;
      if(boss.body.rage<0)boss.body.rage=0;
      if(boss.body.rage>=100){
        boss.body.rage=100;
        boss.body.rageact=boss.body.rageactmax;
      }
    }
    boss.body.shotwait--;
    if(boss.body.shotwait<=0){
      for(i=0;i<boss.body.bosstype;i++){
        bossshot(boss.body.position.x,boss.body.position.y);
      }
      boss.body.shotwait=boss.body.shotinterval;
    }
  }
  
  if (clearwait>0)clearwait--;
  if (ischarge&&chargepower!=50){
    chargepower++;
    if(chargepower>50)chargepower=50;
  }
  extendcheck();
  move();
  draw();
  if (bossstage&&!clear)bossmv();
  window.requestAnimationFrame(main);
}
function extendcheck(){
  if(score>extend*2000){
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
  if(!clear){
    jikiy=jikiy+grav-1;
    jiki.body.hp=jiki.body.hp-(grav-1)/30;
    if(jiki.body.hp<=0&&!miss){
      miss=true;
      jiki.body.render.sprite.texture=jiki.body.render.sprite.miss;
      misstimer=120;
      zanki--;
      if(zanki<0)gameover=true;
    }
  }
  Matter.Body.setPosition(jiki.body, {x:jikix,y:jikiy});
  //自機の向きをマウスカーソルの方向にする処理
  jikiangle = Math.atan2(mousey-jikiy,mousex-jikix)
  Matter.Body.setAngle(jiki.body,jikiangle+Math.PI/2, [updateVelocity=false]);//90度分補正
}

function bossmv() {
//ボスの移動や待機の処理を行う
if (boss.body.move>0){
  Matter.Body.setPosition(boss.body, {x:boss.body.position.x+(bossmovet[0]-boss.body.position.x)/boss.body.move,y:boss.body.position.y+(bossmovet[1]-boss.body.position.y)/boss.body.move});
  boss.body.move--;
  if(boss.body.move==0)boss.body.movewait=boss.body.movewaitmax;
}else{
  boss.body.movewait--;
  if(boss.body.movewait<=0){
    boss.body.move=boss.body.movemax;
    if(boss.body.position.x<160){
      bossmovet[0]=60+Math.random()*(boss.body.position.x+40);
    }else if(boss.body.position.x>670){
      bossmovet[0]=boss.body.position.x-100+Math.random()*(870-boss.body.position.x);
    }else{
      bossmovet[0]=boss.body.position.x-100+Math.random()*200;
    }
    bossmovet[1]=50+Math.random()*50
  }
}
}
function rageaction() {
  switch(boss.body.bosstype){
    case 1:
      
      break;
  }
}
  //　描画関数
function draw() {
  //画面外に出た弾・ブロックの消滅
  for(i=0;i<tamas.length;){
    tamas[i].timer--;
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
  //ボスステージ以外では、ブロックと弾が全て消えれば(画面外に出れば)クリア判定
  if (blocks.length==0&&!bossstage){
    setstage=false;
    if(tamas.length==0&&!clear){
      if(miss&&zanki<0){}else{
        clear=true;
        clearwait=50;
      }
    }
  }

  //ミスタイマーとミスした自機削除処理
  if(miss&&misstimer>0){
    misstimer--;
    if(misstimer==0){
      jiki.removeFromWorld();
      power=Math.floor(power/2);
    }
  }
  
//シールドの持続時間管理と効果終了処理
if(shielddur>0){
  shielddur--;
  if(shielddur==0&&shield!=null){
    shield.removeFromWorld();
  }
}
if(scharge<150)scharge++;

context.clearRect(0,0,WIDTH,HEIGHT);
if (clear){
  clearimg = new Image();
  clearimg.src = "res/text_gameclear_e.png";
  context.drawImage(clearimg, 150, 160);
}
if(clearMainstage&&clearwait==100){
  clearblock();
  cleartama();
}
if(clearMainstage&&clearwait<=100){
  context.fillStyle = "white";
  context.font = "48px serif";
  context.fillText("STAGE  BONUS    "+stage*1000, 150, 350);
  if(clearwait<=50){
    context.fillText("LIFE  BONUS       "+Math.floor(jiki.body.hp*20), 158, 440);
  }
}
if (gameover&&misstimer==0){
  gameoverimg = new Image();
  gameoverimg.src = "res/text_gameover_e.png";
  context.drawImage(gameoverimg, 180, 180);
}

  //物理演算範囲外の描写
  context.clearRect(830, 30, 340, 270);
  context.clearRect(830, 310, 340, 260);
  context.fillStyle = "black";
  context.font = "48px serif";
  context.fillText("STAGE", 850, 80);
  context.fillText(stage+"-"+substage, 1020, 80);
  if(!bossstage){
    context.beginPath();
    context.arc(1000, 170, 80, 0,Math.PI*2, false);
    context.fillStyle = "green";
    context.fill();
    context.closePath();
    context.beginPath();
    context.moveTo(1000,170);
    context.arc(1000, 170, 80, -Math.PI/2,(maxstagetimer-stagetimer)/maxstagetimer*Math.PI*2-Math.PI/2, false);
    context.lineTo(1000,170);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
  }else{
    context.beginPath();
    context.rect(850, 90, 300,40 );
    context.strokeStyle = "red";
    context.stroke();
    context.fillStyle = "red";
    context.fill();
    context.closePath();
    if(boss.body.hp>=0){
      context.beginPath();
      context.rect(850, 90, boss.body.hp/boss.body.hpmax*300,40 );
      context.strokeStyle = "green";
      context.stroke();
      context.fillStyle = "green";
      context.fill();
      context.closePath();
    }
    context.beginPath();
    context.strokeStyle = "#008080";
    if(boss.body.rageact>0){
      context.rect(850, 130, boss.body.rageact/boss.body.rageactmax*300,30 );
    }else{
      context.rect(850, 130, boss.body.rage*3,30 );
    }
    context.stroke();
    context.fillStyle = "#008080";
    context.fill();
    context.closePath();
  
    
  }
  context.fillStyle = "black";
  context.fillText("Score", 850, 360);
  context.font = "40px serif";
  context.fillText(Math.floor(score), 980, 360);
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
  if(jiki.body.hp>=0){
    context.beginPath();
    context.rect(850, 420, jiki.body.hp*3,40 );
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
  powerimg = new Image();
  powerimg.src = "res/item_p.png";
  for(i=1;i<=power;i++)context.drawImage(powerimg, 800+i*50, 475);
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
  clearblock();
  cleartama();
  clearitem();
  jikix=400;
  jikiy=550;
  jiki = new Jiki(jikix,jikiy);
  miss=false;
  invincible=120;
  substage=1;
  bossstage=false;
  setblock();
  zanki=3;
  score=0;
  extend=1;
  power=0;
  scharge=150;
  gameover=false;
}


//自機の弾発射処理
function shot(shotpower) {
  let timer=50;
  if (stagetimer<=0)timer=10;
  tamas.push(new Tama(jikix,jikiy,jikiangle,shotpower,timer));
  switch(power){
    case 4:
      tamas.push(new Tama(jikix,jikiy,jikiangle+Math.PI/6,shotpower,timer));
    case 3:
      tamas.push(new Tama(jikix,jikiy,jikiangle-Math.PI/6,shotpower,timer));
    case 2:
      tamas.push(new Tama(jikix,jikiy,jikiangle+Math.PI/12,shotpower,timer));
    case 1:
      tamas.push(new Tama(jikix,jikiy,jikiangle-Math.PI/12,shotpower,timer));
  }
}
//ボスの弾発射処理
function bossshot(x,y) {
  tamas.push(new Bosstama(x,y,(Math.random()*6)/6*Math.PI,0.05));
}
function setblock() {
  switch(stage){
    case 1:
    case 2:
    case 4:
    for(i=1;i<=3;i++){
      for(y=0;y<4+substage;y++){
        if(i==1)blocks.push(new Block(Math.random()*742+44,Math.random()*150+250,light,Math.floor(Math.random()*(2+stage))+3,Math.random()*10+10,Math.random()*2-1));
        if(i==2)blocks.push(new Block(Math.random()*742+44,Math.random()*150+200,middle,Math.floor(Math.random()*(2+stage))+3,Math.random()*10+10,Math.random()*2-1));
        if(i==3)blocks.push(new Block(Math.random()*742+44,Math.random()*150+150,heavy,Math.floor(Math.random()*(2+stage))+3,Math.random()*10+10,Math.random()*2-1));
        setstage=true;
        clear=false;
        clearMainstage=false;
        maxstagetimer=4000+stage*1000;
        stagetimer=maxstagetimer;
        grav=1;
        world.gravity.y=grav;
        bossstage=false;
      }
    }
    if(substage==4){
      boss=new Boss(300,stage);
      bossstage=true;
      // bosswaitmax=100;
      // bossmovemax=100;
      // bosswait=bosswaitmax;
      // bossmove=0;
      // bossshotinterval=200;
      // bossshotwait=bossshotinterval;
    }
    break;
    case 3:
      for(i=1;i<=3;i++){
        for(y=0;y<8+substage;y++){
          if(i==1)blocks.push(new Block(y*742/(9+substage)+100,300,light,4,30,0));
          if(i==2)blocks.push(new Block(y*742/(9+substage)+100,250,middle,4,30,0));
          if(i==3)blocks.push(new Block(y*742/(9+substage)+100,200,heavy,4,30,0));
          setstage=true;
          clear=false;
          clearMainstage=false;
          maxstagetimer=4000+stage*1000;
          stagetimer=maxstagetimer;
          grav=1;
          world.gravity.y=grav;
          bossstage=false;
        }
      }
      if(substage==4){
        boss=new Boss(300,stage);
        bossstage=true;
        // bosswaitmax=100;
        // bossmovemax=100
        // bosswait=bosswaitmax;
        // bossmove=0;
        // bossshotinterval=200;
        // bossshotwait=bossshotinterval;
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
function clearitem() {
  items.forEach(function(item) {
    item.removeFromWorld();
  });
  items.splice(0,items.length);
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
  if (get)score=score+50;
  switch(type){
    case 1://スコアアイテム
      score=score+200;
      if (get)score=score+250;//直接獲得した時高得点
      break;
    case 2://パワーアップアイテム
      if(power<4){
        power++;
      }else{
        score=score+100;//最大パワー時ではスコアに変換
      }
    break;
    case 3://回復アイテム
      jiki.body.hp=jiki.body.hp+30;
      if (get)jiki.body.hp=jiki.body.hp+20;//直接獲得した時回復量UP
      if (jiki.body.hp>100){//余剰回復分をスコアに換算してhp100に補正
        score=score+2*(jiki.body.hp-100);
        jiki.body.hp=100;
      }
    break;
    case 4://バリアアイテム
      if (barrier||invincible>0){//バリアアイテム待機中もしくは効果時間中はスコアに変換
        score=score+100;
      }else{
        barrier=true;
        jiki.body.render.sprite.texture=jiki.body.render.sprite.shield;
      }
    break;
    case 5://残機アップアイテム
      zanki=zanki+1;
    break;

  }
}


  class Wall {
  //　コンストラクタ宣言
  constructor(x, y, w, h, a, s, c){
    let optisons = {
      target:false,
      restitution: 1,
      friction: 0,
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
  constructor(de, cl1, cl2){
    this.dens=de;
    this.coller1=cl1;
    this.coller2=cl2;
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
      hp:type.dens*(0.9+stage/10)*r*300,
      restitution: 1,
      friction: 0,
      densset: type.dens,
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
    this.body = Bodies.trapezoid(x, y,20,30,0.6,optisons);
    Composite.add(world, this.body);
  }
  removeFromWorld() {
    World.remove(world, this.body);
  }
}
class Boss {
  //　コンストラクタ宣言
  constructor(hp,type){
    let optisons = {
      target:true,
      boss:true,
      restitution: 1,
      hp:hp,
      hpmax:hp,
      rage:0,
      ragetimer:0.05,
      ragerate:3,
      rageact:0,
      rageactmax:30,
      move:0,
      movewait:100,
      movemax:100,
      movewaitmax:100,
      shotinterval:200,
      shotwait:200,
      bosstype:type,
      friction: 0,
      angle: 0,
      render: {
        fillStyle: "#ff69b4",
//        sprite: {
//          texture:'./res/jiki_inv.png'
//        }
      },
      collisionFilter: {
        category: bossCategory
      },
      isStatic: true,
    };
    this.body = Bodies.rectangle(400, 70,20,30,optisons);
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
      angle: jikiangle+Math.PI/2,
      render: {
        fillStyle: "#008080",
        opacity:0.5,
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
  constructor(x, y,ang,fce,time){
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
      force:{x:Math.cos(ang)*fce,y:Math.sin(ang)*fce},
      isStatic: false,
    };
    this.r = 10;
    this.timer=time;
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
class Bosstama {
  //　コンストラクタ宣言
  constructor(x, y,ang,fce){
    this.power=fce;
    let optisons = {
      target:false,
      jiki:false,
      shield:false,
      bosstama:true,
      damegeRate:6,
      restitution: 0.8,
      friction: 0,
      frictionAir: 0,
      angle: ang,
      render: {
        fillStyle: "red"
      },
      collisionFilter: {
        category: commonCategory,
        mask:commonCategory|jikiCategory
      },
      force:{x:Math.cos(ang)*fce,y:Math.sin(ang)*fce},
      isStatic: false,
    };
    this.timer=0;
    this.body = Bodies.circle(x, y, 20, optisons);
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
    this.body = Bodies.circle(x, y, 60, optisons);
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

//キー入力
function keyDownHandler(e) {
  if (e.key === 'd'||e.key === 'ArrowRight') keyr = true;
  if (e.key === 'w'||e.key === 'ArrowUp') keyu = true;
  if (e.key === 's'||e.key === 'ArrowDown') keyd = true;
  if (e.key === 'a'||e.key === 'ArrowLeft') keyl = true;
  if (e.code === 'ShiftRight') usecontext = true;
//  if (e.key === 'p') render.options.enabled = false;
//console.log(e);
}
function keyUpHandler(e) {
  if (e.key === 'd'||e.key === 'ArrowRight') keyr = false;
  if (e.key === 'w'||e.key === 'ArrowUp')    keyu = false;
  if (e.key === 's'||e.key === 'ArrowDown')  keyd = false;
  if (e.key === 'a'||e.key === 'ArrowLeft')  keyl = false;
  if (e.code === 'ShiftRight') usecontext = false;
//  if (e.key === 'p') render.options.enabled = true;
}
