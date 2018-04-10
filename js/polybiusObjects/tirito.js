class Tirito extends PolyObject {
  constructor(pos, size, vel) {
    super(pos, size);
    this.size = size;
    this.position.copy(pos);
    this.speed = vel.clone();

    this.setPower(100);

    this.mesh = new THREE.Mesh( COMMON.tiritoGeometry, COMMON.tiritoMaterial );
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
    createExplosion(explosionPos, this.size , 16);
    removeFromScene(this);
  }
}
