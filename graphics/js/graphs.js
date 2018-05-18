

function createPieGraph(title, data, id) {

  var s = function( p ) {
    var gra;
    var parentElem;

    let $p = $("#" + id);
    let w = $p.width();
    let h = $p.height();
    let mSz = Math.min(w, h);

    p.setup = function() {
      p.createCanvas(w, h);
      p.smooth(8);
      p.frameRate(30);
      p.colorMode(p.HSB, 100);

      parentElem = p.select("#" + id);

      gra = new pieGraph(p, mSz * 0.25, mSz * 0.45, data);
      gra.setPosition(w/2, h/2);
      gra.setTitle(title);
      //gra.setValues(data);
      p.resize();

    };

    p.draw = function() {
      p.clear();
      let t = Easing.easeOutQuad(p.constrain(p.map(p.frameCount, 0, 20, 0, 1), 0, 1));
      gra.graph(t * 2 * Math.PI);
      gra.interact();
    };

    p.windowResized = function() {
      p.resize();
    }

    p.mouseClicked = function() {
      console.log("puede ser...");
    }

    p.resize = function() {
      let nw = parentElem.size().width;
      let nh = parentElem.size().height;
      let minSz = Math.min(nw, nh);

      p.resizeCanvas(nw, nh);
      gra.setPosition(nw / 2, nh / 2);
      gra.reSz(minSz * 0.25, minSz * 0.45);
    }
  };

  var myp5 = new p5(s, id);
}

pieGraph = function(elem, inner, outer, data) {
  /*
    Gráfico de torta.
    Toma data de la forma [{name: n, val: v}, ...]
    Normaliza todos los valores para que sum(valores) = 1;
    Grafica un arco de radio interno inner y radio externo outer.
    TODO: qué hacer si me llega un valor 0.
  */

  this.p = elem;
  this.innerRad = inner;
  this.outerRad = outer;
  this.values = [];
  this.position = this.p.createVector(0, 0);
  this.ongraph = false;
  this.ang = 0;
  this.title = "";
  this.shownText = this.title;

  this.setPosition = function( x, y ) {
    this.position.set(x, y);
  }

  this.setValues = function() {
    this.values = [];

    let total = 0;
    for(let i = 0; i < data.length; i++) {
      total += data[i].val;
    }
    for(let i = 0; i < data.length; i++) {
      this.values.push({'name': data[i].name, 'val': data[i].val / total});
    }

    return;
  }

  this.setTitle = function(title) {
    this.title = title;
  }

  this.reSz = function(ninner, nouter) {
    this.innerRad = ninner;
    this.outerRad = nouter;
  }

  this.graph = function(totalSpan) {
    this.setValues();

    this.p.push();
    this.p.translate(this.position.x, this.position.y);

    let ang = 0;
    let dots = 180;

    for(let i = 0; i < this.values.length; i++) {
      let angularSpan = totalSpan * this.values[i].val;
      let endAng = ang + angularSpan;
      let dotsToDraw = Math.floor(dots * this.values[i].val);

      let hue = this.p.map(i, 0, this.values.length, 0, 100);
      this.p.fill(hue, 90, 90);
      this.p.strokeWeight(1);
      this.p.stroke(0, 0, 20);
      this.ringSection(this.innerRad, this.outerRad, ang, endAng, dotsToDraw);

      ang = endAng;
    }

    if(this.onGraph) {
      ang = 0;
      for(let i = 0; i < this.values.length; i++) {
        let angularSpan = 2 * Math.PI * this.values[i].val;
        let endAng = ang + angularSpan;

        if(this.ang > ang && this.ang < endAng) {
          let dotsToDraw = Math.floor(dots * this.values[i].val);
          this.p.strokeWeight(3);
          this.p.stroke(0, 0, 20);
          let hue = this.p.map(i, 0, this.values.length, 0, 100);
          this.p.fill(hue, 100, 100);
          this.ringSection(this.innerRad, this.outerRad, ang, endAng, dotsToDraw);
          this.shownText = this.values[i].name + "\n" + (this.values[i].val * 100).toFixed(2) + "%";
          break;
        }
        ang = endAng;
      }
    } else {
      this.shownText = this.title;
    }

    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.fill(0, 0, 20);
    this.p.noStroke();
    this.p.textSize(this.p.constrain(this.p.map(this.innerRad, 50, 200, 14, 30), 14, 30));
    this.p.text(this.shownText, 0, 0);

    this.p.pop();
  }

  this.interact = function() {
    let mouseV = this.p.createVector(this.p.mouseX, this.p.mouseY);

    let ang;
    let dist = mouseV.dist(this.position);
    if( dist < this.outerRad && dist > this.innerRad ) {
      this.onGraph = true;
      let v0 = this.p.createVector(1, 0);
      let v1 = mouseV.sub(this.position);
      ang = v0.angleBetween(v1);
      if(this.p.mouseY < this.position.y)
        ang = 2 * Math.PI - ang;

      this.ang = ang;
    }
    else {
      this.onGraph = false;
    }

  }

  this.ringSection = function(inner, outer, start, end, dots) {
    this.p.beginShape();
    // Parte externa
    for(let i = 0; i < dots; i++) {
      let pang = this.p.map(i, 0, dots - 1, start, end);
      let px = outer * this.p.cos(pang);
      let py = outer * this.p.sin(pang);
      this.p.vertex(px, py);
    }

    // Parte interna
    for(let i = 0; i < dots; i++) {
      let pang = this.p.map(i, 0, dots - 1, end, start);
      let px = inner * this.p.cos(pang);
      let py = inner * this.p.sin(pang);
      this.p.vertex(px, py);
    }
    this.p.endShape(this.p.CLOSE);
  }
}


function createSimpleBarGraph(title, data, id) {
  var s = function( p ) {
    var gra;
    var parentElem;

    let $p = $("#" + id);
    let w = $p.width();
    let h = $p.height();
    let mSz = Math.min(w, h);

    p.setup = function() {
      p.createCanvas(w, h);
      p.smooth(8);
      p.frameRate(30);
      p.colorMode(p.HSB, 100);

      parentElem = p.select("#" + id);

      gra = new simpleBarGraph(p, w, h, data);
      gra.setTitle(title);
      p.resize();
    };

    p.draw = function() {
      p.clear();
      let t = Easing.easeInOutCubic(p.constrain(p.map(p.frameCount, 0, 20, 0, 1), 0, 1));
      gra.graph(t);
    };

    p.windowResized = function() {
      p.resize();
    }

    p.mouseClicked = function() {
      console.log("puede ser...");
    }

    p.resize = function() {
      let nw = parentElem.size().width;
      let nh = parentElem.size().height;
      let minSz = Math.min(nw, nh);

      p.resizeCanvas(nw, nh);
      gra.reSz(nw, nh);
    }
  };

  var myp5 = new p5(s, id);
}

simpleBarGraph = function(elem, wd, ht, data) {
  /*
    Gráfico de barras.
    Dado un arreglo de valores [{name: n, val: v}, ...]
    Normaliza todos los valores para que max(valores) = 1;
    Muestra un gráfico de barras simple.
    TODO: qué hacer si me llega un valor 0.
  */

  this.p = elem;
  this.w = wd;
  this.h = ht;
  this.values = [];
  this.maxVal = 100;
  this.title = "";

  this.reSz = function(nw, nh) {
    this.w = nw;
    this.h = nh;
  }

  this.setTitle = function(title) {
    this.title = title;
  }

  this.setValues = function() {
    this.values = [];

    this.maxVal = 0;
    for(let i = 0; i < data.length; i++) {
      this.values.push({'name': data[i].name, 'val': data[i].val});
      if(data[i].val > this.maxVal)
        this.maxVal = data[i].val;
    }

    return;
  }

  this.graph = function(vertSpan) {
    this.setValues();

    let paddingX = this.w / 8;
    let paddingY = this.h / 8;
    let pos0 = this.p.createVector(paddingX, paddingY);
    let posX = this.p.createVector(this.w - paddingX, paddingY);
    let posY = this.p.createVector(paddingX, this.h - paddingY);

    this.p.push();
    this.p.translate(0, this.h);
    this.p.applyMatrix(1, 0, 0, -1, 0, 0);

    // Show title
    this.p.noStroke();
    this.p.fill(0);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(this.p.constrain(this.p.map(this.w, 50, 800, 12, 30), 12, 30));
    this.p.push();
    this.p.translate(this.w / 2, this.h - paddingY / 2);
    this.p.applyMatrix(1, 0, 0, -1, 0, 0);
    this.p.text(this.title, 0, 0);
    this.p.pop();

    // Draw the guide lines
    let guideLines = 10;
    for(let i = 0; i < guideLines; i++) {
      let py = this.p.map(i, 0, guideLines - 1, pos0.y, posY.y);

      this.p.stroke(0, 0, 80);
      this.p.strokeWeight(1);
      this.p.line(pos0.x - this.p.constrain(paddingX / 6, 8, 1000), py, posX.x, py);
    }

    // Graph each bar
    let totalXSpace = this.w - 2 * paddingX;
    let xSpace = totalXSpace / this.values.length;
    let ySpace = this.h - 2 * paddingY;
    let spacing = 0.5;

    let px = paddingX;
    let overGraph = false;
    for(let i = 0; i < this.values.length; i++) {
      let bx = px + xSpace * spacing * 0.5;
      let by = paddingY;
      let ty = this.p.map(this.values[i].val * vertSpan, 0, this.maxVal, 0, ySpace);

      let hue = this.p.map(i, 0, this.values.length, 0, 100);
      this.p.fill(hue, 90, 90);
      this.p.noStroke();
      if(this.p.mouseX > bx && this.p.mouseX < bx + xSpace * (1 - spacing) && this.h - this.p.mouseY > by && this.h - this.p.mouseY < by + ty) {

        // Draw dotted line
        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.dottedLine(pos0.x - this.p.constrain(paddingX / 6, 8, 1000), bx, by + ty);

        // Draw value
        let px = pos0.x - this.p.constrain(paddingX / 6, 8, 1000);
        let val = this.formatNumber(this.values[i].val);

        this.p.noStroke();
        this.p.fill(0, 0, 20);
        this.p.textAlign(this.p.RIGHT, this.p.CENTER);
        this.p.textSize(this.p.constrain(this.p.map(xSpace, 50, 500, 11, 30), 11, 30));
        this.p.push();
        this.p.translate(px, by + ty);
        this.p.applyMatrix(1, 0, 0, -1, 0, 0);
        this.p.text(val, 0, 0);
        this.p.pop();

        overGraph = true;

        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.p.fill(hue, 100, 100);
      }
      this.p.rect(bx, by, xSpace * (1 - spacing), ty );

      // Text under
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(this.p.constrain(this.p.map(xSpace, 50, 500, 12, 40), 12, 40));
      this.p.noStroke();
      this.p.fill(0, 0, 20);
      this.p.push();
      this.p.translate(px + xSpace * 0.5, paddingY * 0.5);
      this.p.applyMatrix(1, 0, 0, -1, 0, 0);
      this.p.text(this.values[i].name, 0, 0);
      this.p.pop();
      px += xSpace;
    }

    // Draw some reference values
    this.p.textAlign(this.p.RIGHT, this.p.CENTER);
    this.p.textSize(this.p.constrain(this.p.map(xSpace, 50, 500, 11, 30), 11, 30));
    if(!overGraph) {
      for(let i = 0; i < guideLines; i++) {
        let px = pos0.x - this.p.constrain(paddingX / 6, 8, 1000);
        let py = this.p.map(i, 0, guideLines - 1, pos0.y, posY.y);
        let val = this.formatNumber(this.p.map(i, 0, guideLines-1, 0, this.maxVal));
        this.p.push();
        this.p.translate(px, py);
        this.p.applyMatrix(1, 0, 0, -1, 0, 0);
        this.p.text(val, 0, 0);
        this.p.pop();
      }
    }

    // Last the axes
    this.p.stroke(0, 0, 0);
    this.p.strokeWeight(2);
    this.p.line(pos0.x, pos0.y, posX.x, posX.y);
    this.p.line(pos0.x, pos0.y, posY.x, posY.y);

    this.p.pop();
  }

  this.dottedLine = function(x1, x2, y) {
    let lw = 5;
    let pos = x1;
    while(pos < x2) {
      let px2 = pos + lw < x2 ? pos + lw : x2;

      this.p.line(pos, y, px2, y);
      pos += lw * 2;
    }

    return;
  }

  this.formatNumber = function(n) {
    if(n < 1000) {
      return n.toFixed(1);
    } else if(n < 1000000) {
      return (n / 1000).toFixed(1) + "K";
    } else {
      return (n / 1000000).toFixed(1) + "M"
    }
  }
}

function createSlidingGraph(title, data, id) {
  var s = function( p ) {
    var gra;
    var parentElem;

    let $p = $("#" + id);
    let w = $p.width();
    let h = $p.height();
    let mSz = Math.min(w, h);

    p.setup = function() {
      p.createCanvas(w, h);
      p.smooth(8);
      p.frameRate(30);
      p.colorMode(p.HSB, 100);

      parentElem = p.select("#" + id);

      gra = new slidingGraph(p, w, h, data);
      gra.setTitle(title);
      p.resize();
    };

    p.draw = function() {
      p.clear();
      let t = Easing.easeInOutCubic(p.constrain(p.map(p.frameCount, 0, 20, 0, 1), 0, 1));
      gra.graph(t);
    };

    p.windowResized = function() {
      p.resize();
    }

    p.mouseClicked = function() {
      console.log("puede ser...");
    }

    p.resize = function() {
      let nw = parentElem.size().width;
      let nh = parentElem.size().height;
      let minSz = Math.min(nw, nh);

      p.resizeCanvas(nw, nh);
      gra.reSz(nw, nh);
    }
  };

  var myp5 = new p5(s, id);
}

slidingGraph = function(elem, wd, ht, data) {
  this.p = elem;
  this.w = wd;
  this.h = ht;
  this.values = [];
  this.totalValues = 200;
  for(let i = 0; i < this.totalValues; i++)
    this.values[i] = data.hist[i];

  this.basePointer = 200;
  this.maxVal = 0;
  this.title = "";

  this.reSz = function(nw, nh) {
    this.w = nw;
    this.h = nh;
  }

  this.setTitle = function(title) {
    this.title = title;
  }

  this.setValues = function() {

    this.values[this.basePointer] = data.newVal;
    this.basePointer = (this.basePointer + 1) % this.totalValues;

    this.maxVal = 0;
    for(let i = 0; i < this.values.length; i++) {
      if(this.values[i] > this.maxVal)
        this.maxVal = this.values[i];
    }

    return;
  }

  this.graph = function(horizSpan) {
    if(this.p.frameCount % 30 == 1)
      this.setValues();

    let paddingX = this.w / 12;
    let paddingY = this.h / 4;
    let pos0 = this.p.createVector(paddingX, paddingY);
    let posX = this.p.createVector(this.w - paddingX, paddingY);
    let posY = this.p.createVector(paddingX, this.h - paddingY);

    this.p.push();
    this.p.translate(0, this.h);
    this.p.applyMatrix(1, 0, 0, -1, 0, 0);

    // Show title
    this.p.noStroke();
    this.p.fill(0);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(this.p.constrain(this.p.map(this.h, 50, 400, 15, 25), 15, 25));
    this.p.push();
    this.p.translate(this.w / 2, paddingY / 2);
    this.p.applyMatrix(1, 0, 0, -1, 0, 0);
    this.p.text(this.title, 0, 0);
    this.p.pop();

    // Draw the guide lines
    let guideLines = 4;
    for(let i = 0; i < guideLines; i++) {
      let py = this.p.map(i, 0, guideLines - 1, pos0.y, posY.y);

      this.p.stroke(0, 0, 80);
      this.p.strokeWeight(1);
      this.p.line(pos0.x - this.p.constrain(paddingX / 10, 8, 1000), py, posX.x, py);
    }

    ////// GRAPH
    // Stroke
    this.p.noFill();
    this.p.stroke(0, 90, 90);
    this.p.strokeWeight(2);
    this.p.beginShape();
    for(let i = 0; i < this.totalValues * horizSpan; i++) {
      let px = this.p.map(i, 0, this.totalValues-1, paddingX, this.w - paddingX);
      let val = this.values[((this.basePointer + i) % this.totalValues)];
      let py = this.p.map(val, 0, this.maxVal, paddingY, this.h - paddingY);
      this.p.vertex(px, py);
    }
    this.p.endShape();

    // Fill
    this.p.fill(0, 90, 90, 20);
    this.p.noStroke();
    this.p.beginShape();
    this.p.vertex(paddingX, paddingY);
    for(let i = 0; i < this.totalValues * horizSpan; i++) {
      let px = this.p.map(i, 0, this.totalValues-1, paddingX, this.w - paddingX);
      let val = this.values[((this.basePointer + i) % this.totalValues)];
      let py = this.p.map(val, 0, this.maxVal, paddingY, this.h - paddingY);
      this.p.vertex(px, py);
    }
    this.p.vertex(this.p.map(horizSpan, 0, 1, paddingX, this.w - paddingX), paddingY);
    this.p.endShape(this.p.CLOSE);

    let overGraph = false;
    for(let i = 0; i < this.totalValues * horizSpan; i++) {
      let px = this.p.map(i, 0, this.totalValues-1, paddingX, this.w - paddingX);
      let val = this.values[((this.basePointer + i) % this.totalValues)];
      let py = this.p.map(val, 0, this.maxVal, paddingY, this.h - paddingY);

      if(this.p.mouseX > px - 5 && this.p.mouseX < px + 5 && this.h - this.p.mouseY > paddingY && this.h - this.p.mouseY < py) {
        overGraph = true;

        this.p.stroke(0, 90, 90);
        this.p.strokeWeight(6);
        this.p.point(px, py);

        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.dottedLine(pos0.x - this.p.constrain(paddingX / 10, 8, 1000), px, py);

        let tpx = pos0.x - this.p.constrain(paddingX / 6, 8, 1000);
        let formattedVal = this.formatNumber(val);

        this.p.noStroke();
        this.p.fill(0, 0, 20);
        this.p.textAlign(this.p.RIGHT, this.p.CENTER);
        this.p.textSize(this.p.constrain(this.p.map(this.h, 50, 300, 11, 20), 11, 20));
        this.p.push();
        this.p.translate(tpx, py);
        this.p.applyMatrix(1, 0, 0, -1, 0, 0);
        this.p.text(formattedVal, 0, 0);
        this.p.pop();

        break;
      }
    }


    // Draw some reference values
    this.p.noStroke();
    this.p.textAlign(this.p.RIGHT, this.p.CENTER);
    this.p.textSize(this.p.constrain(this.p.map(this.h, 50, 300, 11, 20), 11, 20));
    this.p.fill(0);
    if(!overGraph) {
      for(let i = 0; i < guideLines; i++) {
        let px = pos0.x - this.p.constrain(paddingX / 6, 8, 1000);
        let py = this.p.map(i, 0, guideLines - 1, pos0.y, posY.y);
        let val = this.formatNumber(this.p.map(i, 0, guideLines-1, 0, this.maxVal));
        this.p.push();
        this.p.translate(px, py);
        this.p.applyMatrix(1, 0, 0, -1, 0, 0);
        this.p.text(val, 0, 0);
        this.p.pop();
      }
    }

    // Last the axes
    this.p.stroke(0, 0, 0);
    this.p.strokeWeight(2);
    this.p.line(pos0.x, pos0.y, posX.x, posX.y);
    this.p.line(pos0.x, pos0.y, posY.x, posY.y);

    this.p.pop();
  }

  this.formatNumber = function(n) {
    if(n < 1000) {
      return n.toFixed(1);
    } else if(n < 1000000) {
      return (n / 1000).toFixed(1) + "K";
    } else {
      return (n / 1000000).toFixed(1) + "M"
    }
  }

  this.dottedLine = function(x1, x2, y) {
    let lw = 5;
    let pos = x1;
    while(pos < x2) {
      let px2 = pos + lw < x2 ? pos + lw : x2;

      this.p.line(pos, y, px2, y);
      pos += lw * 2;
    }

    return;
  }
}
