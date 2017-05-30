class PolyObject extends THREE.Object3D {
  constructor(type, hitboxPos, hitboxSize) {
    super();

    this.type = type;
    this.hitbox = new Hitbox(pos, size);
  }

  onCollide(who) {
    console.log(who);
  }
}

class Hitbox extends THREE.Object3D {
  constructor(pos, size) {
    this.radius = size;
    this.position.copy(pos);
  }
}
