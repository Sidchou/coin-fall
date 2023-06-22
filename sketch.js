let overAllTexture = [];
let texture = 0;
let p = [];
let size = 50;
let amount = 1/1200
let colors = ["#f5dc23","#dcc61f","#c4b01c","#ab9a18"];
function setupGraphic() {
    
    overAllTexture = createGraphics(width, height);
    overAllTexture.loadPixels();
    let d = pixelDensity();
    for (var i = 0; i < width * d; i++) {
      for (var o = 0; o < height * d; o++) {
        overAllTexture.set(
          i,
          o,
          color(255, noise(i / 3, o / 3, (i * o) / 50) * random([0, 20, 40]))
        );
      }
    }
    overAllTexture.updatePixels();
}

function updateGraphic() {
  push();
  blendMode(BLEND)
  image(overAllTexture, 0, 0); 
  pop();
}
function newParticles(num){
  
   
  for (let i = 0; i < num; i++) {
    p.push(new Particles(random(0, width), random(0, -200), 100, size));
  }
  p.sort((a,b) => b.distant - a.distant);
  }

function showDebug()
{  
  fill(0);
  text("fps" + floor(frameRate()), 5, 10);
  text("size" + p.length, 5, 20); 
}
////-- P5 --////
function setup() {
  size = min(windowHeight,windowWidth) /15;
  createCanvas(windowWidth, windowHeight);
  newParticles(width * amount * 6)
  setupGraphic();
  //nsole.log(size);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0,100);  
  newParticles(width * amount )

  for (let i = 0; i < p.length; i++) {

    p[i].rotation();
    p[i].gravity(false);
    p[i].resistant();
    p[i].update();
    p[i].render();
    if (p[i].del == true) {
      p.splice(i, 1);
    }
  }
  
  //filter(POSTERIZE, 3);
  updateGraphic();
  
  //owDebug();
}

function mousePressed() {
  p.push(new Particles(mouseX, mouseY, 100, size));
  //console.log(p);
}

////--Class--////

class Particles {
  constructor(x, y, mass, size) {
    this.distant = random(1, 10);

    this.pos = createVector(x, y);
    this.r = size - this.distant;
    this.m = mass;
    this.angle = 0;
    this.row = 1;

    this.rowSpeed = random(1, 10);
    this.angSpeed = random(1, 5);

    this.v = createVector(0, 0);
    this.a = createVector(0, 0);
    this.w = 0;
    this.bounce = false;

    this.c = color(colors[floor(this.distant/2.5)]);
    this.c.setAlpha(220);

    this.del = false;
    //console.log(floor(this.distant/3));
  }

  rotation() {
    this.row = sin(millis() * 0.001 * this.rowSpeed);
    this.angle = millis() * 0.001 * this.angSpeed;
  }

  gravity(bounce) {
    let g = createVector(0, 0.01);
    this.a.add(g);

    if (bounce) {
      this.bounce = bounce;
    }
  }

  resistant() {
    let r = this.v.copy();

    r.mult(-0.001 * (1 + 0.1 * (noise(this.pos.x,this.pos.y) -abs(this.angle))));
    this.a.add(r);
  }

  update() {
    this.v.add(this.a);

    let h = this.pos.y + this.r / 2;

    if (height - h < 5 && this.v.y > 0) {
      if (this.bounce) {
        this.v.y *= -0.5;

        // if ( abs(this.v.y) <0.5) {
        //   this.v.y = 0;
        // }
        this.pos.y = h - this.r / 2;
      } else {
        this.del = true;
      }
    }

    this.v.mult(1 - this.distant * 0.0001);
    if (this.v.mag() > 10)
      {this.v.setMag(10)}
    this.pos.add(this.v);

    this.a = createVector(0, 0);
  }

  render() {
    noStroke();
    fill(this.c);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    ellipse(0, 0, this.r * this.row, this.r);
    pop();
  }
}
