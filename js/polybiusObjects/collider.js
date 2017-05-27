Collider = function(){
  this.position;
  this.radius;

  //
  this.set = function(pos, rad){
    this.position = pos;
    this.radius = rad;
  }

  this.collides = function(pObj, rObj){
    return dist(this.position, this.radius, pObj, rObj) <= rObj + this.radius ? true : false;
  }

  // Normalizo el vector y lo multiplico por el radio.
  let setVector = function(pos, rad){
    let newVec = pos.clone();
    return newVec.normalize().multiplyScalar(rad);
  };

  // Calculo distancia entre dos vectores
  let dist = function(v1 , r1, v2, r2){
    let vector1 = v1.clone();
    let vector2 = v2.clone();
    let vector = vector1.sub(vector2);
    return vector.length();
  };
}
