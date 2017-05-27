Nave = function(nscene) {
	this.pos = new THREE.Vector3();
	this.size = 0;
	this.naveMesh;
  this.scene = nscene;
  this.tmatrix;

	this.init = function( pos, size ) {
		this.size = size;
		this.pos.set(pos.x, pos.y, pos.z);
    this.tmatrix = new THREE.Matrix4();

		let naveGeometry = new THREE.SphereGeometry(size, 3, 3);
		let naveMaterial = new THREE.MeshBasicMaterial({
	     wireframe: true
	  });

    this.naveMesh = new THREE.Mesh(naveGeometry, naveMaterial);
    this.naveMesh.scale.set(0.5, 0.25, 1);
    this.naveMesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.scene.add(this.naveMesh);
	}

  this.setpos = function(x, y, z, matrix) {
    this.pos.set(x, y, z);
    this.tmatrix = matrix.clone();
    this.naveMesh.position.set(this.pos.x, this.pos.y, this.pos.z);

    let upvec = new THREE.Vector3(0, 1, 0);
    upvec.applyMatrix4(this.tmatrix);
    this.naveMesh.up.set(upvec.x, upvec.y, upvec.z);
    this.naveMesh.lookAt(new THREE.Vector3(0, 0, 0));
  }

  this.getPosition = function() {
    return this.pos;
  }

  this.getMatrix = function() {
    return this.tmatrix;
  }
}
