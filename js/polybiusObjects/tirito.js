class Tirito extends PolyObject {
  constructor(pos, size, vel) {
    super(pos, size);
    this.size = size;
    this.position.copy(pos);
    this.speed = vel.clone();

    this.setPower(100);

    let tiritoGeometry = new THREE.SphereGeometry(size, 5, 5);
    let tiritoMaterial = new THREE.MeshBasicMaterial({
	     wireframe: true,
       color: 0xffffff
	  });
    this.mesh = new THREE.Mesh( tiritoGeometry, tiritoMaterial );

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
