class Nave extends PolyObject {
  constructor(pos, size) {
    super(pos, size * 0.6);

    this.position.copy(pos);
    this.size = size;
    this.matrix = new THREE.Matrix4();
    /*
    let naveGeometry = new THREE.SphereGeometry(size, 3, 3);
    let naveMaterial = new THREE.MeshBasicMaterial({
	     wireframe: true,
       color: 0xffffff
	  });
    this.mesh = new THREE.Mesh(naveGeometry, naveMaterial);
    this.mesh.scale.set(0.5, 0.25, 1);
    */

    let selectedMesh = parseInt(location.search.split('selectedMesh=')[1]);

    this.mesh = COMMON.naveMesh[selectedMesh === undefined ? 0 : selectedMesh];
    this.mesh.position.copy(this.position);

    this.mesh.scale.multiplyScalar(this.size * getScale(selectedMesh));

    this.setPower(500);

    // CONTROLS //
    this.controls = new THREE.PolyControls(container);

    this.rad = 6 * radius;
    this.minRad = 4 * radius;
    this.maxRad = 10 * radius;
  	this.radSpeed = radius / 6;
    this.angSpeed = 0.03;
    this.rotSpeed = 0.03;

  	this.tirotoAvailable = true;
  	this.tiritoRecovery = 0;

    this.shoot = 0;
    this.leftRight = 0;
    this.upDown = 0;
    this.forwardBack = 0;
    this.rollLeftRollRight = 0;

    //////////////
  }

  // Colisiones
  onCollide(who) {
    if(who.isAcid)
      initAcid();
    else
      initGlitch();
  }

  updateControls()
  {
    let keys = this.controls.update();

    this.shoot = keys.shoot;
    this.leftRight = ( - keys.left + keys.right );
    this.upDown = ( - keys.up + keys.down );
    this.forwardBack = ( - keys.forward + keys.back );
    this.rollLeftRollRight = ( - keys.rollLeft + keys.rollRight );
  };

  update( delta )
  {
    // Actualizo los controles
    this.updateControls();
    // Actualizo el radio
    var zoffset = this.forwardBack * this.radSpeed;

    if(this.rad + zoffset < this.minRad) {
      this.rad = this.minRad;
    } else if(this.rad + zoffset > this.maxRad) {
      this.rad = this.maxRad;
    } else {
      this.rad += zoffset;
    }

    // Actualizo la posición
    var xrot = - this.upDown * this.angSpeed;
    var yrot = this.leftRight * this.angSpeed;
    var zrot = this.rollLeftRollRight * this.rotSpeed;

    var xAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(this.matrix);
    var yAxis = new THREE.Vector3(0, 1, 0).applyMatrix4(this.matrix);
    var zAxis = new THREE.Vector3(0, 0, 1).applyMatrix4(this.matrix);

    var rxmatrix = new THREE.Matrix4().makeRotationAxis(xAxis, xrot);
    var rymatrix = new THREE.Matrix4().makeRotationAxis(yAxis, yrot);
    var rzmatrix = new THREE.Matrix4().makeRotationAxis(zAxis, zrot);

    this.matrix.premultiply(rxmatrix);
    this.matrix.premultiply(rymatrix);
    this.matrix.premultiply(rzmatrix);

    let pos = new THREE.Vector3(0, 0, -1).applyMatrix4(this.matrix);
    pos.multiplyScalar(this.rad);
    this.position.copy(pos);

    // Actualizo el mesh
    this.mesh.position.copy(this.position);

    let upvec = new THREE.Vector3(0, 1, 0);
    upvec.applyMatrix4(this.matrix);
    this.mesh.up.copy(upvec);
    this.mesh.lookAt(new THREE.Vector3(0, 0, 0));

    this.updateHitbox(this.position, this.size * 0.6);

		// tiros
		if(!this.tiritoAvailable) {
			this.tiritoRecovery += delta;
			if(this.tiritoRecovery > 0.1) {
				this.tiritoAvailable = true;
				this.tiritoRecovery = 0;
			}
		} else if (this.shoot === 1) {
			this.tiritoAvailable = false;
			shootTirito(this.position.clone());
		}
  };

  // Getters
  getPosition() {
    return this.position.clone();
  }

  getMatrix() {
    return this.matrix.clone();
  }
}
