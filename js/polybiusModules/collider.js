COLLIDER = {};

COLLIDER.collider = new Collider();

COLLIDER.addRegla = function( gr1, gr2 ) {
  COLLIDER.collider.addRegla( gr1, gr2 );
}

COLLIDER.resetReglas = function() {
  COLLIDER.collider = new Collider();
}

COLLIDER.checkCollisions = function() {
  COLLIDER.collider.checkCollisions();
}
