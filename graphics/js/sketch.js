var GRAPH = {};
var gra;

function setup() {
  createCanvas(600, 600);
  frameRate(30); //Si es necesario animar, a 30 fps.
  colorMode(HSB, 100);

  gra = new GRAPH.pieGraph(100, 150);
  gra.setPosition(300, 300);
  gra.setValues([ {'name': 'perros', 'val': 33.3},
                  {'name': 'tortugas', 'val': 6.6},
                  {'name': 'peces', 'val': 10},
                  {'name': 'gatos', 'val': 30},
                  {'name': 'hamsters', 'val': 20} ]);

}

// Loop de animación.
function draw() {
  background(0, 0, 100);
  gra.graph();
  gra.interact();
}

/*
  Gráfico de torta.
  Dado un arreglo de valores [val1, val2, ...]
  Normaliza todos los valores para que sum(arr) = 1;
  Grafica un arco de radio interno inner y radio externo outer.
  TODO: qué hacer si me llega un valor 0.
  TODO: recibir un objeto con {name: n, val: v} para mostrar nombres.
*/
GRAPH = {}
GRAPH.pieGraph = function(inner, outer) {
  this.innerRad = inner;
  this.outerRad = outer;
  this.values = [];
  this.position = createVector(0, 0);

  this.setPosition = function( x, y ) {
    this.position.set(x, y);
  }

  this.setValues = function( vals ) {
    this.values = [];

    let total = 0;
    for(let i = 0; i < vals.length; i++) {
      total += vals[i].val;
    }
    for(let i = 0; i < vals.length; i++) {
      this.values.push({'name': vals[i].name, 'val': vals[i].val / total});
    }

    return;
  }

  this.resize = function(ninner, nouter) {
    this.innerRad = inner;
    this.outerRad = outer;
  }

  this.graph = function() {
    let ang = 0;
    let dots = 180;
    push();
    translate(this.position.x, this.position.y);
    for(let i = 0; i < this.values.length; i++) {
      let angularSpan = 2 * Math.PI * this.values[i].val;
      let endAng = ang + angularSpan;
      let dotsToDraw = Math.floor(dots * this.values[i].val);

      let hue = map(i, 0, this.values.length, 0, 100);
      fill(hue, 75, 80);
      let intractSection = this.onGraph ? (isBetween(this.ang, ang, endAng) ? 0 : 20) ? : 20;
      stroke(0, 0, 20);
      ringSection(this.innerRad, this.outerRad, ang, endAng, dotsToDraw);

      ang = endAng;
    }
    pop();
  }

  this.interact = function(){
    let mouseV = createVector(mouseX, mouseY);

    let ang;
    let dist = mouseV.dist(this.position);
    if( dist < this.outerRad && dist > this.innerRad ) {
      let v0 = createVector(1, 0);
      let v1 = mouseV.sub(this.position);
      ang = v0.angleBetween(v1);
      if(mouseY < this.position.y)
        ang = 2 * Math.PI - ang;

      let ppx = this.innerRad * cos(ang) + this.position.x;
      let ppy = this.innerRad * sin(ang) + this.position.y;

      ellipse(ppx, ppy, 10, 10);
    }
  }
}



function ringSection(inner, outer, start, end, dots) {
  beginShape();
  // Parte externa
  for(let i = 0; i < dots; i++) {
    let pang = map(i, 0, dots - 1, start, end);
    let px = outer * cos(pang);
    let py = outer * sin(pang);
    vertex(px, py);
  }

  // Parte interna
  for(let i = 0; i < dots; i++) {
    let pang = map(i, 0, dots - 1, end, start);
    let px = inner * cos(pang);
    let py = inner * sin(pang);
    vertex(px, py);
  }
  endShape(CLOSE);
}
