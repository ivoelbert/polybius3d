THREE.TetrahedronGeometry = function (radius, detail) {
    var vs = [[+1, +1, +1],
            [-1, -1, +1],
            [-1, +1, -1],
            [+1, -1, -1]],
        fs = [[2, 1, 0],
            [0, 3, 2],
            [1, 3, 0],
            [2, 3, 1]];

    THREE.PolyhedronGeometry.call(this, vs, fs, radius, detail);
};
THREE.TetrahedronGeometry.prototype = new THREE.Geometry();
THREE.TetrahedronGeometry.prototype.constructor = THREE.TetrahedronGeometry;

Nave = function() {
	this.pos = new THREE.Vector3();
	this.size = 0;
	this.naveMesh;

	this.init = function( pos, size) {
		this.size = size;
		this.pos.set(pos.x, pos.y, pos.z);

		let naveGeometry = new THREE.TetrahedronGeometry(size, 1);
		let naveMaterial = new THREE.MeshBasicMaterial({
	        wireframe: true
	    });

	    this.naveMesh = new THREE.Mesh(naveGeometry, naveMaterial);
	    this.naveMesh.
	}


}