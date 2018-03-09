
FollowCamera = function(followed) {
	this.pos = new THREE.Vector3();
  this.followed = followed;
  this.cam;
  this.offset = new THREE.Vector3();
  this.manija;
  this.maxDist;


  // inicializo la camara
	this.init = function( fov, off, manija, maxDist ) {
    this.manija = manija;
    this.maxDist = maxDist;
    this.offset = off.clone();

		let followedPos = this.followed.getPosition();
    let followedMatrix = this.followed.getMatrix();
    this.pos.set(followedPos.x + this.offset.x, followedPos.y + this.offset.y, followedPos.z  + this.offset.z);

    this.cam = new THREE.PerspectiveCamera( fov, SCREEN_WIDTH / SCREEN_HEIGHT, 10, 10000 );
    this.cam.position.set(this.pos.x, this.pos.y, this.pos.z);

    let upvec = new THREE.Vector3(0, 1, 0);
    upvec.applyMatrix4(followedMatrix);

    this.cam.up.set(upvec.x, upvec.y, upvec.z);
    this.cam.lookAt(new THREE.Vector3(0, 0, 0));
	};


  // actualizo la camara
  this.update = function(delta) {
    let followedPos = this.followed.getPosition();
    let followedMatrix = this.followed.getMatrix();

    let off = this.offset.clone();
    off.applyMatrix4(followedMatrix);

    let virtualPos = followedPos.clone();
    virtualPos.add(off);

    let realPos = this.pos.clone();
    let dist = virtualPos.clone();
    dist.sub(realPos);
    dist.multiplyScalar(this.manija);

    realPos.add(dist);

    let d = realPos.distanceTo(virtualPos);
    if(d > this.maxDist) {
      let correc = virtualPos.clone();
      correc.sub(realPos);
      correc.normalize();
      correc.multiplyScalar(d - this.maxDist);
      realPos.add(correc);
    }

    this.pos.set(realPos.x, realPos.y, realPos.z);

    // posiciono y roto la camara
    this.cam.position.set(this.pos.x, this.pos.y, this.pos.z);

    let upvec = new THREE.Vector3(0, 1, 0);
    upvec.applyMatrix4(followedMatrix);

    let lookvec = new THREE.Vector3(0, -this.pos.length() * 0.1, 0);
    lookvec.applyMatrix4(followedMatrix);

    this.cam.up.set(upvec.x, upvec.y, upvec.z);
    this.cam.lookAt(lookvec);
  };


  // getters / setters
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
