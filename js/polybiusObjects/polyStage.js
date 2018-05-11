polyStage = function() {
  this.scene;
  this.camera;

  this.STATE;

  this.groupNaves = new THREE.Group();
  this.groupCenters = new THREE.Group();
  this.groupCenterAsteroids = new THREE.Group();
  this.groupAsteroids = new THREE.Group();
  this.groupPills = new THREE.Group();
  this.groupTiritos = new THREE.Group();
  this.groupMisiles = new THREE.Group();
  this.groupExplosions = new THREE.Group();
  this.groupPowerUps = new THREE.Group();
  this.groupLasers = new THREE.Group();

  this.update;
  this.init;

  this.resetSize = function( arg ) {
    this.camera.aspect = arg;
  	this.camera.updateProjectionMatrix();
  }

  this.removeFromScene = function ( object ) {
    object.parent.remove(object);
  	this.scene.remove(object.mesh);
  	if(COMMON.debug)
  		this.scene.remove(object.hitbox.mesh);
  }

  this.moveThings = function( delta ) {
    let centers = this.groupCenters.children;
  	for(let i = 0; i < centers.length; i++) {
  		centers[i].update( delta );
  	}

  	let asteroids = this.groupAsteroids.children;
  	for(let i = 0; i < asteroids.length; i++) {
  		asteroids[i].update( delta );
  	}

    let pills = this.groupPills.children;
  	for(let i = 0; i < pills.length; i++) {
  		pills[i].update( delta );
  	}

    let tiritos = this.groupTiritos.children;
  	for(let i = 0; i < tiritos.length; i++) {
  		tiritos[i].update( delta );
  	}

  	let misiles = this.groupMisiles.children;
  	for(let i = 0; i < misiles.length; i++) {
  		misiles[i].update( delta );
  	}

    let fragments = this.groupExplosions.children;
  	for(let i = 0; i < fragments.length; i++) {
  		fragments[i].update( delta );
  	}

  	let lasers = this.groupLasers.children;
  	for(let i = 0; i < lasers.length; i++) {
  		lasers[i].update( delta );
  	}

  	let naves = this.groupNaves.children;
  	for(let i = 0; i < naves.length; i++) {
  		naves[i].update( delta );
  	}
  }
  
}
