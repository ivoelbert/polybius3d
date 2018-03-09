class Nave extends PolyObject {
  constructor(pos, size) {
    super(pos, size * 0.6);

    this.position.copy(pos);
    this.size = size;
    this.matrix = new THREE.Matrix4();

    let naveGeometry = new THREE.SphereGeometry(size, 3, 3);
    let naveMaterial = new THREE.MeshBasicMaterial({
	     wireframe: true,
       color: 0xffffff
	  });
    this.mesh = new THREE.Mesh(naveGeometry, naveMaterial);
    this.mesh.scale.set(0.5, 0.25, 1);
    this.mesh.position.copy(this.position);

    this.setPower(500);
  }

  // Colisiones
  onCollide(who) {
    if(who.isAcid)
      initAcid();
    else
      initGlitch();
  }

  // Getters, setters y demas...
  setpos(pos, matrix) {
    this.position.copy(pos);
    this.matrix.copy(matrix);
    this.mesh.position.copy(this.position);

    let upvec = new THREE.Vector3(0, 1, 0);
    upvec.applyMatrix4(this.matrix);
    this.mesh.up.copy(upvec);
    this.mesh.lookAt(new THREE.Vector3(0, 0, 0));

    this.updateHitbox(this.position, this.size * 0.6);
  }

  getPosition() {
    return this.position.clone();
  }

  getMatrix() {
    return this.matrix.clone();
  }
}
