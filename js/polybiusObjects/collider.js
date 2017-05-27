Collider = function(){
  this.position;
  this.radius;

  //
  this.set = function(pos, rad){
    this.position = pos;
    this.radius = rad;
  }

  this.collides = function(pObj, rObj){
    return dist(this.position, this.radius, pObj, rObj) <= 1000 ? true : false;
  }

  // Normalizo el vector y lo multiplico por el radio.
  let setVector = function(pos, rad){
    let newVec = pos.clone();
    return newVec.normalize().multiplyScalar(rad);
  };

  // Calculo distancia entre dos vectores
  let dist = function(v1 , r1, v2, r2){
    let vector = setVector(v1, r1).sub(setVector(v2, r2));
    return vector.length();
  };
}
