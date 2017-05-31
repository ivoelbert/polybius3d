class PolyObject extends THREE.Object3D {
  constructor(hitboxPos, hitboxSize) {
    super();

    this.hitbox = new Hitbox(hitboxPos, hitboxSize);
  }

  updateHitbox(pos, rad) {
    this.hitbox.position.copy(pos);
    this.hitbox.radius = rad;
  }

  addToScene( scene ) {
    scene.add(this.mesh);
  }
}

class Hitbox extends THREE.Object3D {
  constructor(pos, size) {
    super();

    this.radius = size;
    this.position.copy(pos);
  }
}
