var shape;
var cantShapes = 20;

var minRad;
var amp;

let def = function(v, p) {
  let def1 = map(sin(radians(v * 2.71828 * 2 * Math.PI)), -1, 1, 0.7, 1);
  let def2 = map(cos(radians(v * 3.14159 * 2 * Math.PI)), -1, 1, 0.7, 1);
  return def1 + def2;
}

function setup() {
  createCanvas(800, 600);
  frameRate(30);
  smooth(8);
  colorMode(HSB, 256);
  background(255);

  minRad = 10;
  amp = 2;

  shape = [];
  shape[0] = [];
  for(let i = 0; i < 180; i++) {
    shape[0][i] = minRad;
  }

  for(let i = 1; i < cantShapes; i++) {
    shape[i] = [];
    for(let j = 0; j < 180; j++) {
      shape[i][j] = shape[i-1][j]
      shape[i][j] += def(j, i) * amp * i;
    }
  }
  push();
  translate(width/2, height/2);
  for(let i = cantShapes - 1; i >= 0; i--) {
    drawShape(i);
  }
  pop();
}

function draw() {
  background(255);

  let t = map(frameCount, 0, 600, 0, 1);

  let rot = map(t, 0, 1, 0, 2 * Math.PI);
  amp = map(sin(rot * 20), -1, 1, 1.8, 3);

  for(let i = 1; i < cantShapes; i++) {
    shape[i] = [];
    for(let j = 0; j < 180; j++) {
      shape[i][j] = shape[i-1][j]
      shape[i][j] += def(j, i) * amp * i;
    }
  }

  push();
  translate(width/2, height/2);
  rotate(rot);
  for(let i = cantShapes - 1; i >= 0; i--) {
    drawShape(i, t * 256 * 4 % 256, 150);
  }
  pop();
}

function drawShape(index, hstart, camp) {
  stroke(0);
  let normHstart = hstart;
  fill(map(index, cantShapes, 0, normHstart, normHstart + camp) % 256, 255, 255);
  beginShape();
  for(let i = 0; i < 180; i++) {
    let ang = map(i, 0, 180, 0, 2*Math.PI);

    let px = shape[index][i] * cos(ang);
    let py = shape[index][i] * sin(ang);

    vertex(px, py);
  }
  endShape(CLOSE);
}
