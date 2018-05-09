class Tirito extends PolyObject {
  constructor(parent, pos, size, vel) {
    super(parent, pos, size);
    this.size = size;
    this.position.copy(pos);
    this.speed = vel.clone();

    this.setPower(100);

    this.mesh = COMMON.tiritoMesh.clone();
    this.mesh.scale.multiplyScalar( this.size );
  }

  update( delta ) {
    this.position.add(this.speed);
    this.updateHitbox(this.position, this.size);

    this.mesh.position.copy(this.position);
  }

  addToScene( scene ) {
    scene.add(this.mesh);
  }
  onCollide(who) {
    let explosionPos = this.position.clone();
    COMMON.createExplosion(this.parentStage, explosionPos, this.size , 16);
    this.parentStage.removeFromScene(this);
  }
}
