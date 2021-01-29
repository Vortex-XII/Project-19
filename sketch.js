var PLAY = 1;
var END = 0;
var gameState = PLAY;

var harry,harry_Image;
var background1, invisibleGround, backgroundImage;

var cloudsGroup, cloudImage;
var voldamort,voldamortImage;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound,theme;

var highScore;

function preload(){
  harry_Image = loadImage("harry potter.png");
  
  backgroundImage = loadImage("hp-f1-hogwarts-boats-firstyear-square.jpg");
  
  cloudImage = loadImage("cloud 1.png");
  
  spiderImage = loadImage("1bc3416d0a30b8d0b9261ecadf060faf-removebg-preview.png"
);
  
  restartImg = loadImage("reset.png")
  gameOverImg = loadImage("Game over.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  theme= loadSound("Harry potter theme.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  score = 0;
  highScore= 0;
  
  background1 = createSprite(200,180,400,20);
  background1.addImage("background",backgroundImage);
  background1.x = background1.width /2;
  background1.scale=2.5;
  
  harry = createSprite(50,160,20,50);
  harry.addImage("harry",harry_Image); 
  

  harry.scale = 0.2;
  
  
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create spider and Cloud Groups
  monstersGroup = new Group();
  cloudsGroup = new Group();

  
  harry.setCollider("circle",0,0,30);
  harry.debug = true
  
}

function draw() {
  
  background(180);
  //displaying score
  
 
  
  if(gameState === PLAY){
    
    theme.play(true);
    
    gameOver.visible = false;
    restart.visible = false;
    
    background1.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    if(score>highScore){
       highScore = score;
    }
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (background1.x < 0){
      background1.x = background1.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& harry.y >= 160) {
        harry.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    harry.velocityY = harry.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn spiders on the ground
    spawnMonster();
    
    if(monstersGroup.isTouching(harry)){
        
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     harry.addImage(harry_Image);
    
     
     
      background1.velocityX = 0;
      harry.velocityY = 0
      
     
    monstersGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     
     monstersGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  
  harry.collide(invisibleGround);
  
  if(mousePressedOver(restart) && gameState == END) {
      reset();
    }
  
  text("Score: "+ score, 500,50);
  text("High Score: "+ highScore,300,50);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible=false;
  restart.visible=false;
  monstersGroup.destroyEach();
  cloudsGroup.destroyEach();
  harry.changeImage();
  score=0;
}


function spawnMonster(){
 if (frameCount % 50 === 0){
   var voldamort = createSprite(600,180,10,40);
   voldamort.velocityX = -(6 + score/100);
   voldamort.addImage(spiderImage)
        
    voldamort.scale = 0.1;
    voldamort.lifetime = 300;
   
    monstersGroup.add(voldamort);
 }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(40,80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.15;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = harry.depth;
    harry.depth = harry.depth + 1;
    cloudsGroup.add(cloud);
  }
}

