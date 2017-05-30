class PolyObject extends THREE.Object3D {
  constructor(hitboxPos, hitboxSize) {
    super();

    this.hitbox = new Hitbox(hitboxPos, hitboxSize);
  }

  onCollide(who) {
    console.log(who);
  }
}

class Hitbox extends THREE.Object3D {
  constructor(pos, size) {
    super();

    this.radius = size;
    this.position.copy(pos);
  }
}
