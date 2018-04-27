class polyLaser extends PolyObject {
  constructor(followed, size, angSpeed) {
    super(new THREE.Vector3(0, 0, 0), 0);

    this.size = size;
    this.followed = followed;
    this.angSpeed = angSpeed;
    let pos = this.followed.position.clone();
    pos.negate();
    this.position.copy(pos);

    this.mesh = COMMON.laserMesh.clone();
    this.mesh.scale.z *= this.size;

    this.t = 0;
  }

  update( delta ) {
    this.t += delta;

    let towards = this.followed.position.clone();

    let normal = new THREE.Vector3(0, 0, 0);
    normal.crossVectors(this.position, towards);

    if(normal.length() > 0.001) {
      normal.normalize();
    }
    else {
      normal = randomUnitVector();
    }

    let angle = this.position.angleTo(towards);
    angle = THREE.Math.clamp(angle, 0, this.angSpeed);
    this.position.applyAxisAngle(normal, angle);

    this.updateMesh();

    if(this.t > this.timeToLive)
    {
      removeFromScene(this);
    }
  }

  updateMesh() {
    this.mesh.lookAt(this.position);
  }

  addToScene( scene ) {
    scene.add(this.mesh);
  }
}
