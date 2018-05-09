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
}
