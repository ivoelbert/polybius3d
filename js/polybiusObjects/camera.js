
FollowCamera = function(followed) {
	this.pos = new THREE.Vector3();
  this.followed = followed;
  this.cam;
  this.zoffset = 0;
  this.yoffset = 0;

	this.init = function( fov, zoffset, yoffset ) {
		let followedPos = this.followed.getPosition();
    let followedMatrix = this.followed.getMatrix();

    this.zoffset = zoffset;
    this.yoffset = yoffset;
    this.pos.set(followedPos.x, followedPos.y + this.yoffset, followedPos.z + this.zoffset);

    this.cam = new THREE.PerspectiveCamera( fov, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7 );
    this.cam.position.set(this.pos.x, this.pos.y, this.pos.z);

    let upvec = new THREE.Vector3(0, 1, 0);
    upvec.applyMatrix4(followedMatrix);

    this.cam.up.set(upvec.x, upvec.y, upvec.z);
    this.cam.lookAt(new THREE.Vector3(0, 0, 0));
	};

  this.update = function(d) {
    let followedPos = this.followed.getPosition();
    let followedMatrix = this.followed.getMatrix();

    let posOffset = new THREE.Vector3(0, this.yoffset, this.zoffset);
    posOffset.applyMatrix4(followedMatrix);

    followedPos.add(posOffset);

    this.pos.set(followedPos.x, followedPos.y, followedPos.z);
    this.cam.position.set(this.pos.x, this.pos.y, this.pos.z);

    let upvec = new THREE.Vector3(0, 1, 0);
    upvec.applyMatrix4(followedMatrix);

    let lookvec = new THREE.Vector3(0, -100, 0);
    lookvec.applyMatrix4(followedMatrix);

    this.cam.up.set(upvec.x, upvec.y, upvec.z);
    this.cam.lookAt(lookvec);
  };

  this.getCam = function() {
    return this.cam;
  };

  this.setAspect = function(a) {
    this.cam.aspect = a;
  };

  this.updateProy = function() {
  	this.cam.updateProjectionMatrix();
  };
}
