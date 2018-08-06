var chosen;
var angs;
var angVels;

var circs;

function setup() {
  createCanvas(800, 600);
  smooth(8);
  frameRate(30);
  colorMode(HSB, 256);

  circs = 40;
  chosen = [];
  angs = [];
  angVels = [];

  for(let i = 0; i < circs; i++) {
    chosen.push(Math.floor(Math.random() * 7));
    angs.push(0);
    angVels.push((Math.random() - 0.5) * 0.02);
  }
}

function draw() {
  background(255);

  updateCircs();

  push();
  translate(width/2, height/2);
  mand(circs, 0, 600);
  pop();
}

function updateCircs() {
  for(let i = 0; i < circs; i++) {
    angs[i] += angVels[i];
  }
}

function mand(cant, minRad, maxRad) {
  let color = 0;

  for(let i = cant-1; i > 0; i--) {
    let r1 = map(i, 0, cant, minRad, maxRad);
    let r2 = map(i+0.5, 0, cant, minRad, maxRad);
    let h = map(i, 0, cant, 0, 256 * 2) % 100;
    push();
    rotate(angs[i]);
    switch(chosen[i]) {
      case 0:
      commonCircle(r2, color);
      color = color == 0 ? 255 : 0;
      break;

      case 1:
      let wobs1 = Math.floor(map(r1, minRad, maxRad, 4, 20));
      wobbleCircle(r1, r2, wobs1, color);
      color = color == 0 ? 255 : 0;
      break;

      case 2:
      let wobs2 = Math.floor(map(r1, minRad, maxRad, 10, 50));
      wobbleCircle(r1, r2, wobs2, color);
      color = color == 0 ? 255 : 0;
      break;

      case 3:
      dottedCircle(r2, color);
      break;

      case 4:
      bubbleCircle(r2, 90, 5, color);
      break;

      case 5:
      solcito(r1, r2, 90, color);
      break;

      case 6:
      triangs(r1, r2, 90, color);
      color = color == 0 ? 255 : 0;
      break;
    }
    pop();
  }
}

function commonCircle(rad, f) {
  // Circulo comunacho de radio -rad-
  fill(f);
  noStroke();
  beginShape();
  for(let i = 0; i < 360; i++) {
    let ang = map(i, 0, 360, 0, 2 * Math.PI);

    let px = rad * cos(ang);
    let py = rad * sin(ang);

    vertex(px, py);
  }
  endShape(CLOSE);
}

function wobbleCircle(rad0, rad1, wobbles, f) {
  // Wobbly circle de -rad0- a -brad1-
  fill(f);
  noStroke();
  beginShape();
  for(let i = 0; i < 360; i++) {
    let ang = map(i, 0, 360, 0, 2 * Math.PI);
    let wobl = map(i, 0, 360, 0, 2 * Math.PI * wobbles);
    let r = map(sin(wobl), -1, 1, rad0, rad1);
    let px = r * cos(ang);
    let py = r * sin(ang);

    vertex(px, py);
  }
  endShape(CLOSE);
}

function dottedCircle(rad, s) {
  // Circulo comunacho de radio -rad-
  noFill();
  strokeWeight(2);
  stroke(s);
  for(let i = 0; i < 360; i += 4) {
    let ang = map(i, 0, 360, 0, 2 * Math.PI);
    let ang2 = map(i + 2, 0, 360, 0, 2 * Math.PI);

    let px1 = rad * cos(ang);
    let py1 = rad * sin(ang);

    let px2 = rad * cos(ang2);
    let py2 = rad * sin(ang2);

    line(px1, py1, px2, py2);
  }
}

function bubbleCircle(rad, bubbles, bubSz, f) {
  fill(f);
  noStroke();
  for(let i = 0; i < bubbles; i++) {
    let ang = map(i, 0, bubbles, 0, 2 * Math.PI);

    let px1 = rad * cos(ang);
    let py1 = rad * sin(ang);

    ellipse(px1, py1, bubSz);
  }
}

function solcito(rad1, rad2, rayos, s) {
  stroke(s);
  strokeWeight(2);
  for(let i = 0; i < rayos; i++) {
    let ang = map(i, 0, rayos, 0, 2 * Math.PI);

    let px1 = rad1 * cos(ang);
    let py1 = rad1 * sin(ang);
    let px2 = rad2 * cos(ang);
    let py2 = rad2 * sin(ang);

    line(px1, py1, px2, py2);
  }
}

function triangs(rad1, rad2, cant, c) {
  noStroke();
  fill(c);
  beginShape();
  for(let i = 0; i < cant; i++) {
    let ang1 = map(i, 0, cant, 0, 2 * Math.PI);
    let ang2 = map(i + 0.5, 0, cant, 0, 2 * Math.PI);

    let px1 = rad1 * cos(ang1);
    let py1 = rad1 * sin(ang1);
    let px2 = rad2 * cos(ang2);
    let py2 = rad2 * sin(ang2);

    vertex(px1, py1);
    vertex(px2, py2);
  }
  endShape(CLOSE);
}
