var canvas
var soldier,soldierAni
var scenery,sceneryImg
var bullet,bulletGroup
var robotGroup
var ufo,ufoImg,ufoGroup,ufoBullet
var gameState = "start"

var lives = 5;
var firstAidCount = 0;
var score = 0;
var firstAid_Img,firstAidGroup
var bulletSound,robotDieSound,gameOverSound,livesSound,soldierHitSound,firstAidSound
var gameOverIMG,resetIMG


function preload()
{
  ufoImg = loadImage("images/ufo-1.PNG")
  soldierAni = loadAnimation("images/soldier-1.PNG","images/soldier-2.PNG","images/soldier-3.PNG")
  soldierSit = loadAnimation("images/soldierSitting.png")
  sceneryImg = loadImage("images/war_background.PNG")
  enemy_Ani = loadAnimation("images/enemy1.png","images/enemy2.png","images/enemy3.png","images/enemy4.png","images/enemy5.png")
  enemyStillIMG = loadAnimation("images/enemy4.png");
  firstAid_Img = loadImage("images/first aid.PNG")
  bulletImg = loadImage("images/bullet.png")
  fallenImg = loadImage("images/fallen IMG.png")
  ufoBullet = loadImage("images/bullet ufo.png")
  gameOverIMG = loadImage("images/gameOver.png")
  resetIMG = loadImage("images/reset.png")
  startIMG = loadImage("images/start.png")
  

  bulletSound = loadSound("sounds/BulletFromGun.mp3")
  robotDieSound = loadSound("sounds/bulletHitsRobot.mp3")
  gameOverSound = loadSound("sounds/gameover.mp3")
  livesSound = loadSound("sounds/livesIncrease.mp3")
  soldierHitSound = loadSound("sounds/attack.mp3")
  firstAidSound = loadSound("sounds/soldierTouchesFirstAid.mp3");
}
  

function setup()
{
  createCanvas(1200,600);

  scenery = createSprite(600,300)
  scenery.addImage(sceneryImg);
  scenery.scale = 4
  scenery.visible = false;
  

  soldier = createSprite(100,550,50,50);
  soldier.addAnimation("soldier",soldierAni);
  soldier.addAnimation("soldierSitting",soldierSit);
  soldier.addAnimation("soldierDying",fallenImg)
  soldier.debug = true;
  soldier.setCollider("rectangle",0,0,100,225)
  soldier.visible = false;

  ground = createSprite(600,590,1200,20)
  ground.visible = false;

  gameOver = createSprite(600,300)
  gameOver.addImage(gameOverIMG)
  gameOver.visible = false;

  restart = createSprite(600,400)
  restart.addImage(resetIMG)
  restart.visible = false;

  start = createSprite(600,500)
  start.scale = 2
  start.addImage(startIMG)
  //start.visible = true;;
 

  robotGroup = new Group()
  bulletGroup = new Group()
  firstAidGroup = new Group()
  ufoGroup = new Group();

}

function draw() {
  background(100);


  if (gameState === "start")
  {
    fill(255)
    textSize(30)
    text("If you touch a UFO or robot with the soldier you will lose a life ",20,40)
    text("Five first aid kits will be equal to one life",20,100)
    text("If you kill a robot with bullet you will get 5 points",20,160)
    text("If you kill a UFO with bullet you will get 10 points",20,220)
    text("Press SPACE KEY to jump",20,280)
    text("Press RIGHT ARROW KEY to release a bullet",20,340)
    text("Press DOWN ARROW to make the soldier sit and then hit a UFO or robot",20,400)
    text("Press RESET button to restart the game",20,4620)

    

    if(mousePressedOver(start))
    {
      gameState = "play"
    }

    drawSprites();

  }
  

  if(gameState === "play"){

    start.visible = false;

    soldier.visible = true;
    scenery.visible = true;
      if(scenery.x <= 0){
      scenery.x = 600;
    }

    scenery.velocityX = -(6 + frameCount/500)

     if(keyDown("space") && soldier.y >= 467){
      soldier.velocityY = -15
    }

    soldier.velocityY = soldier.velocityY + 0.5;

    if(keyWentDown(DOWN_ARROW)){
      soldier.changeAnimation("soldierSitting")
    }
    if(keyWentUp(DOWN_ARROW)){
      soldier.changeAnimation("soldier")
    }
  
      if(keyWentDown(RIGHT_ARROW)){
      spawnBullets();
      bulletSound.play();
    }

      
    if(bulletGroup.isTouching(robotGroup)){
      robotGroup.destroyEach();
      bulletGroup.destroyEach();
      score += 5
      robotDieSound.play()
    }

    for(var i = 0;i<ufoGroup.length;i++)
    {
      if(ufoGroup.get(i).isTouching(bulletGroup)){
        ufoGroup.get(i).destroy();
        bulletGroup.destroyEach();
        score += 10
        robotDieSound.play()
      }
    }

    if(robotGroup.isTouching(soldier)){
      lives -= 1
      robotGroup.destroyEach()
      soldierHitSound.play();
    }

    for(var i = 0;i<ufoGroup.length;i++)
    {
      if(ufoGroup.get(i).isTouching(soldier)){
        lives -= 1
        ufoGroup.get(i).destroy()
        soldierHitSound.play();
      }
    }

    if(firstAidGroup.isTouching(soldier)){
      firstAidCount += 1
      firstAidGroup.destroyEach()
      firstAidSound.play();
    }

      if(firstAidCount === 5){
      livesSound.play();
      lives += 1
      firstAidCount = 0
    }

    spawnRobot()
    spawnFirstAid()
    spawnUfo();

    if(lives === 0){
      gameState = "end"
    }

    drawSprites();

    textSize(30)
  fill(255)
  text("Lives: " + lives,1000,50)

  text("First Aid: " + firstAidCount,100,50)
  text("Score: " + score,500,50)
  }

  

  else if(gameState === "end"){

    scenery.velocityX = 0;
    robotGroup.setVelocityXEach(0);
    ufoGroup.setVelocityXEach(0);
    firstAidGroup.setVelocityXEach(0);

    robotGroup.setLifetimeEach(-1);
    ufoGroup.setLifetimeEach(-1);
    firstAidGroup.setLifetimeEach(-1);

    soldier.setCollider("rectangle",0,0,100,50)
    soldier.scale = 1.5
    soldier.changeAnimation("soldierDying")
    
    //robot.changeAnimation("enemyStill")
    //ground.visible = true;
    soldier.velocityY = soldier.velocityY + 0.5;

    

    restart.visible = true;
    gameOver.visible = true;

    if(mousePressedOver(restart))
    {
      reset()
    }

    drawSprites();

    textSize(30)
    fill(255)
    text("Lives: " + lives,1000,50)

    text("First Aid: " + firstAidCount,100,50)
    text("Score: " + score,500,50)
    
  }
  
  soldier.collide(ground)
}

function reset()
  {
    gameState = "play"

    robotGroup.destroyEach();
    ufoGroup.destroyEach();
    firstAidGroup.destroyEach();

    restart.visible = false;
    gameOver.visible = false;

    soldier.scale = 1
    soldier.changeAnimation("soldier")
    soldier.setCollider("rectangle",0,0,100,225)
    soldier.y = 550
    

    lives = 5;
    score = 0;
    firstAidCount = 0;
  }

function spawnUfo()
{
   if(frameCount % 100 === 0)
   {
     var ufo = createSprite(1200,random(120,500))
     ufo.addImage(ufoImg)
     ufo.velocityX = -(6 + frameCount/500)

     //ufo.debug = true;
     ufo.setCollider("rectangle",0,0,100,50)

     ufo.lifetime = 400

     ufoGroup.add(ufo)

   }
}


function spawnRobot()
  {
    if(frameCount % 200 === 0)
    {
      var robot = createSprite(1200,500)
      robot.addAnimation("enemy",enemy_Ani)
      robot.addAnimation("enemyStill",enemyStillIMG);
     // robot.scale = 4
     robot.velocityX = -(6 + frameCount/500)

      //robot.debug = true;
      robot.setCollider("rectangle",15,20,75,200)

      robot.lifetime = 400

      robotGroup.add(robot)
      
    }
  }

  function spawnFirstAid()
  {
    if(frameCount % 500 === 0)
    {
      var firstAid = createSprite(1200,random(200,300))
      firstAid.addImage(firstAid_Img)
      firstAid.scale = 0.2

      firstAid.velocityX = -(6 + frameCount/500)

      firstAid.lifetime = 400;

      firstAidGroup.add(firstAid);
    }
  }

  function spawnBullets()
  {
    bullet = createSprite(soldier.x+60,soldier.y-40,20,20)
    bullet.addImage(bulletImg)
    bullet.scale =  0.2
    bullet.velocityX = 5

    bullet.lifetime = 240

    bulletGroup.add(bullet)
  }

  