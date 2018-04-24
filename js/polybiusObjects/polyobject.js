class PolyObject extends THREE.Object3D {
  constructor(hitboxPos, hitboxSize, hp, power) {
    super();

    this.hp = Infinity;
    this.power = 0;
    this.hitbox = new Hitbox(hitboxPos, hitboxSize);
  }

  setPower(p) {
    this.power = p;
  }

  setHp(h) {
    this.hp = h;
  }

  updateHitbox(pos, rad) {
    this.hitbox.position.copy(pos);
    this.hitbox.mesh.position.copy(pos);
    this.hitbox.radius = rad;
  }

  addToScene( scene ) {
    scene.add(this.mesh);

    if(COMMON.debug) {
      scene.add(this.hitbox.mesh)
    }
  }

  //Getters a setters
  getPower() {
    return this.power;
  }
}

class Hitbox extends THREE.Object3D {
  constructor(pos, size) {
    super();

    this.radius = size;
    this.position.copy(pos);

    this.mesh = COMMON.hitboxMesh.clone();
    this.mesh.scale.multiplyScalar(this.radius);
  }
}
