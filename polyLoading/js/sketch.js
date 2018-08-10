const animationFrames = 210;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('loading-container');
    frameRate(30);
}

function draw() {
  background(0);

  let time = map(frameCount % animationFrames, 0, animationFrames, 0, 1);

  push();
      translate(width/2, height/2)
      center(50, time);

      orbit(100, 40);

      asteroid(25, 100, time);
  pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function asteroid(r, rOrbit, t) {

    stroke(255, 255, 0);
    noFill();

    let orbitAng = map(t, 0, 1, 0, 4 * Math.PI);
    let orbitX = rOrbit * cos(orbitAng);
    let orbitY = rOrbit * sin(orbitAng);

    let rotation = map(t, 0, 1, 0, 2 * Math.PI);
    push();
        translate(orbitX, orbitY);

        rotate(-rotation);

        // Triangle pointing up
        beginShape();
            let ang = 30;
            let px = r * cos(radians(ang));
            let py = r * sin(radians(ang));
            vertex(px, py);

            ang += 120;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);

            ang += 120;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);
        endShape(CLOSE);

        // Triangle pointing down
        beginShape();
            ang = -30;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);

            ang -= 120;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);

            ang -= 120;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);
        endShape(CLOSE);

        // Lines from center to triangle vertices
        for(let i = 0; i < 6; i++) {
            let a = map(i, 0, 5, radians(30), radians(330));
            let x = r * cos(a);
            let y = r * sin(a);

            line(0, 0, x, y);
        }

        // Hexagon
        beginShape();
            ang = 30;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));

            for(let i = 0; i < 6; i++) {
                vertex(px, py);
                ang += 60;
                px = r * cos(radians(ang));
                py = r * sin(radians(ang));
            }
        endShape(CLOSE);
    pop();
}

function orbit(r, strokes) {

    stroke(255);
    noFill();

    let strokeToGapRatio = 0.5; // 1 means no gap, 0 means no stroke.

    let strokeGapAng = 360 / strokes;

    for(let ang = 0; ang < 360; ang += strokeGapAng) {
        let vang = ang + strokeGapAng * strokeToGapRatio;
        let x1 = r * cos(radians(ang));
        let y1 = r * sin(radians(ang));
        let x2 = r * cos(radians(vang));
        let y2 = r * sin(radians(vang));

        line(x1, y1, x2, y2);
    }
}

function center(r, t) {
    
    stroke(255, 0, 0);
    noFill();

    let rotation = map(t, 0, 1, 0, 2 * Math.PI);

    push();
        rotate(-rotation);
        // Triangle pointing up
        beginShape();
            let ang = 30;
            let px = r * cos(radians(ang));
            let py = r * sin(radians(ang));
            vertex(px, py);

            ang += 120;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);

            ang += 120;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);
        endShape(CLOSE);

        // Triangle pointing down
        beginShape();
            ang = -30;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);

            ang -= 120;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);

            ang -= 120;
            px = r * cos(radians(ang));
            py = r * sin(radians(ang));
            vertex(px, py);
        endShape(CLOSE);

        // Lines from center to triangle vertices
        for(let i = 0; i < 6; i++) {
            let a = map(i, 0, 5, radians(30), radians(330));
            let x = r * cos(a);
            let y = r * sin(a);

            line(0, 0, x, y);
        }
    pop();

    push();
        rotate(rotation);
        // Hexagon
        beginShape();
            ang = 30;
            px = r * 0.15 * cos(radians(ang));
            py = r * 0.15 * sin(radians(ang));

            for(let i = 0; i < 6; i++) {
                vertex(px, py);
                ang += 60;
                px = r * 0.15 * cos(radians(ang));
                py = r * 0.15 * sin(radians(ang));
            }
        endShape(CLOSE);
    pop();
        
}

function stopLoading() {
    noLoop();
}

function startLoading() {
    loop();
}