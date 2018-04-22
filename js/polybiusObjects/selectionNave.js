class selectionNave extends PolyObject {
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

    // CONTROLS //
    this.controls = new THREE.PolyControls(container);

    this.rad = 8 * radius;

  	this.tirotoAvailable = true;
  	this.tiritoRecovery = 0;

    this.shoot = 0;
    this.leftRight = 0;
    //////////////

    this.carouselRadius = this.rad;
    this.carouselPivot = new THREE.Vector3(0, 0, - this.rad - this.carouselRadius);

    this.meshesAngles = [];
    this.meshs = [];
    COMMON.selectedMesh = 0;

    this.timeToRotate = 0.5;
    this.rotatingTime = 0;
    this.changeAvailable = true;

    this.generateMeshs();
  }

  // Colisiones
  onCollide(who) {
    if(who.isAcid)
      initAcid();
    else
      initGlitch();
  }

  generateMeshs() {
    let naves = COMMON.naveMesh.length;

    for(let i = 0; i < naves; i++)
    {
      this.meshesAngles[i] = 0;
      if(i == 0)
        this.meshesAngles[i] = Math.PI;

      let localz = this.carouselRadius * -Math.cos(this.meshesAngles[i]);
      let localx = this.carouselRadius * Math.sin(this.meshesAngles[i]);
      let localy = 0;

      let position = new THREE.Vector3(localx, localy, localz);
      position.add(this.carouselPivot);
      this.meshs[i] = COMMON.naveMesh[i].clone();
      this.meshs[i].position.copy(position);
    
      this.meshs[i].scale.multiplyScalar(this.size * getScale(i));

      let upvec = new THREE.Vector3(0, 1, 0);
      this.meshs[i].lookAt(new THREE.Vector3(0, 0, 0));
    }

  }

  addToScene(scene) {
    for(let i = 0; i < this.meshs.length; i++)
      scene.add(this.meshs[i]);
  }

  updateControls()
  {
    let keys = this.controls.update();

    this.shoot = keys.shoot;
    this.leftRight = ( - keys.left + keys.right );
  };

  updateNaves( delta )
  {

    if(this.rotating != undefined && this.rotating != 0)
    {
      let t = easeInOut(THREE.Math.mapLinear(this.rotatingTime, 0, this.timeToRotate, 0, 1));

      let nextMesh = COMMON.selectedMesh + this.rotating;
      if(nextMesh < 0)
        nextMesh += this.meshs.length;
      if(nextMesh >= this.meshs.length)
        nextMesh -= this.meshs.length;
      
      if(this.rotating > 0)
      {
        this.meshesAngles[COMMON.selectedMesh] = THREE.Math.mapLinear(t, 0, 1, Math.PI, Math.PI * 2);
        this.meshesAngles[nextMesh] = THREE.Math.mapLinear(t, 0, 1, 0, Math.PI);
      }
      else
      {
        this.meshesAngles[COMMON.selectedMesh] = THREE.Math.mapLinear(t, 0, 1, Math.PI, 0);
        this.meshesAngles[nextMesh] = THREE.Math.mapLinear(t, 0, 1, 2 * Math.PI, Math.PI);
      }
      

      this.rotatingTime += delta;

      if(this.rotatingTime > this.timeToRotate)
      {
        this.meshesAngles[COMMON.selectedMesh] = 0;
        this.meshesAngles[nextMesh] = Math.PI;

        COMMON.selectedMesh = nextMesh;

        this.rotating = 0;

        this.changeAvailable = true;
        this.tiritoRecovery = 0;
      }
    }

    let naves = COMMON.naveMesh.length;

    for(let i = 0; i < naves; i++)
    {
      let localz = this.carouselRadius * -Math.cos(this.meshesAngles[i]);
      let localx = this.carouselRadius * Math.sin(this.meshesAngles[i]);
      let localy = 0;

      let position = new THREE.Vector3(localx, localy, localz);
      position.add(this.carouselPivot);

      this.meshs[i].position.copy(position);

      
      let upvec = new THREE.Vector3(0, 1, 0);

      let lookVec = this.meshs[i].position.clone();
      lookVec.sub(this.carouselPivot);

      let lookAtPos = this.meshs[i].position.clone();
      lookAtPos.add(lookVec);

      this.meshs[i].lookAt(lookAtPos);
      
    }
  }

  update( delta )
  {
    // Actualizo los controles
    this.updateControls();
  
    var xrot = 0;
    var yrot = 0;
    var zrot = 0;

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


    // Animo las naves
    if(this.changeAvailable && this.leftRight < -0.5)
    {
      this.changeAvailable = false;
      this.rotating = -1;
      this.rotatingTime = 0;

      this.changeAvailable = false;

      this.tiritoAvailable = false;
      this.tiritoRecovery = -this.timeToRotate;
    }
    else if(this.changeAvailable && this.leftRight > 0.5)
    {
      this.changeAvailable = false;
      this.rotating = 1;
      this.rotatingTime = 0;

      this.changeAvailable = false;

      this.tiritoAvailable = false;
      this.tiritoRecovery = -this.timeToRotate;
    }

    this.updateNaves(delta);

		// Tiros
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
