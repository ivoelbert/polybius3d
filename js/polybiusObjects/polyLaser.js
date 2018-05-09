class polyLaser extends PolyObject {
  constructor(parent, followed, size, angSpeed) {
    super(parent, new THREE.Vector3(0, 0, 0), 0);

    this.size = size;
    this.followed = followed;
    this.angSpeed = angSpeed;
    let pos = this.followed.position.clone();
    pos.negate();
    this.position.copy(pos);

    this.mesh = COMMON.laserMesh.clone();
    this.mesh.scale.z *= this.size;

    this.materialColor = this.mesh.material.color;

    this.debug = new THREE.Mesh();

    if(COMMON.debug) {
      let debugGeom = new THREE.SphereGeometry(this.size * 0.05, 5, 5);
      let debugMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
      });

      this.debug = new THREE.Mesh(debugGeom, debugMat);
    }

    this.t = 0;
    this.timeToLive = 10;
  }

  update( delta ) {
    this.t += delta;

    let towards = this.followed.position.clone();

    let normal = new THREE.Vector3(0, 0, 0);
    normal.crossVectors(this.position, towards);

    if(normal.length() > 0.00001) {
      normal.normalize();
    }
    else {
      normal = COMMON.randomUnitVector();
    }

    let angle = this.position.angleTo(towards);
    angle = THREE.Math.clamp(angle, -this.angSpeed * delta, this.angSpeed * delta);
    this.position.applyAxisAngle(normal, angle);

    if(COMMON.debug)
      this.debug.position.copy(this.position);

    this.updateMesh();

    if(this.t > this.timeToLive)
    {
      this.parentScene.removeFromScene(this);
    }
  }

  updateMesh() {
    this.mesh.lookAt(this.position);

    let red = new THREE.Color( 0xff8887 );
    let l = this.t / this.timeToLive;
    let col = this.materialColor.clone();
    col.lerp(red, l);
    this.mesh.material.color.set(col);
  }

  addToScene( scene ) {
    scene.add(this.mesh);
    if(COMMON.debug)
      scene.add(this.debug);
  }
}
