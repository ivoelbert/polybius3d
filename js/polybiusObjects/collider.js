class Collider {
  constructor( objetos ) {
    this.reglas = [];
  }

  addRegla( who1, who2 ) {
    this.reglas.push([who1, who2]);
  }

  checkCollisions() {
    for(let i = 0; i < this.reglas.length; i++) {
      let regla = this.reglas[i];

      let grupo1objects = regla[0].children;
      let grupo2objects = regla[1].children;

      for(let e1 = 0; e1 < grupo1objects.length; e1++) {
        for(let e2 = 0; e2 < grupo2objects.length; e2++) {
          let obj1 = grupo1objects[e1];
          let obj2 = grupo2objects[e2];

          let collides = function(obj1, obj2) {
            if(obj1 != undefined && obj2 != undefined) {
              let v1 = obj1.hitbox.position.clone();
              let v2 = obj2.hitbox.position.clone();

              if(v1.distanceTo(v2) < obj1.hitbox.radius + obj2.hitbox.radius) {
                return true;
              }
            }
            return false;
          };

          if(collides(obj1, obj2)) {
            obj1.onCollide(obj2);
            obj2.onCollide(obj1);
          }
        }
      }
    }
  }
}
