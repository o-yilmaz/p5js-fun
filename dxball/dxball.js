var ballSpeed = {
  x: 0,
  y: 5
}
var ballPos = {
  x: 0,
  y: 0
}
var stickLength = 120;
var stickBottomMargin = 80;
var speedIncrement = 0.5;
var bounceCount = 0;
var blocks = [];
class Block {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.hp = 2;
    this.size = 90;
  }
};

function setup() {
  createCanvas(1000, 600);
  for (var i = 1; i < 9; i++) {
    blocks.push(new Block(i * 100, 200));
  }
  ballPos.x = width / 2;
  ballPos.y = height / 2;
}

function draw() {
  background(0);
  ellipse(ballPos.x, ballPos.y, 15, 15);
  fill(200, 0, 0);
  noStroke();
  rect(mouseX - stickLength / 2, height - stickBottomMargin, stickLength, 15);
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    rect(b.posX, b.posY, b.size, 20);
    if (ballPos.y < b.posY + 28 && ballPos.y > b.posY - 8) {
      if (ballPos.x < b.posX + b.size + 10 && ballPos.x > b.posX) {
        b.hp -= 1;
        b.size -= 45;
        if (b.hp == 0) {
          blocks.splice(i, 1);
        }
        ballSpeed.y = -ballSpeed.y;
      }
    }
  }
  if (blocks.length == 0) {
    ballSpeed.x = 0;
    ballSpeed.y = 0;
  }
  ballPos.x += ballSpeed.x;
  ballPos.y += ballSpeed.y;

  //sağdan soldan sekme
  if (ballPos.x > width || ballPos.x < 0) {
    ballSpeed.x = -ballSpeed.x;
  }
  //üstten sekme
  if (ballPos.y < 0) {
    ballSpeed.y = -ballSpeed.y;
  }
  //çubuktan sekme
  if (ballPos.y > height - stickBottomMargin && ballPos.y < height - stickBottomMargin + 20) {
    if (ballPos.x < mouseX + stickLength / 2 && ballPos.x > mouseX - stickLength / 2) {
      bounceCount++;
      // if (bounceCount % 5 == 0) {
      //   stickLength -= 10;
      // }
      ballSpeed.y += speedIncrement;
      ballSpeed.x = map(ballPos.x, mouseX - stickLength / 2, mouseX + stickLength / 2, -ballSpeed.y, ballSpeed.y)
      ballSpeed.y = -ballSpeed.y;
    }
  }
  //en alta değme durumu
  if (ballPos.y > height) {
    speed.x = 0;
    speed.y = 0;
  }
}