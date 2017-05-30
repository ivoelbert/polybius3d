class Nave extends THREE.Object3D {
  constructor(pos, size) {
    super();

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
  }

  setpos(x, y, z, matrix) {
    this.position.set(x, y, z);
    this.matrix.copy(matrix);
    this.mesh.position.copy(this.position);

    let upvec = new THREE.Vector3(0, 1, 0);
    upvec.applyMatrix4(this.matrix);
    this.mesh.up.copy(upvec);
    this.mesh.lookAt(new THREE.Vector3(0, 0, 0));
  }

  getPosition() {
    return this.position.clone();
  }

  getMatrix() {
    return this.matrix.clone();
  }
}
