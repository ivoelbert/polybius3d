Asteroid = function( ascene, lado ) {
  this.lado = lado;
  this.radio = 0;
  this.scene = ascene;
  this.asteroidMesh;
  this.position = new THREE.Vector3();
  this.rotation = new THREE.Vector3();
  this.radVel = 100;
  this.angVel = 0.02;

  this.hitboxRad = 0;
  this.hitboxMesh; // para debugear...
  this.debug = false;

  //Init
  this.init = function( pos, radv, angv ) {
    this.radVel = radv > 0 ? radv : this.radVel;
    this.angVel = angv > 0 ? angv : this.angVel;
    this.radio = pos.length();
    this.position.set( pos.x, pos.y, pos.z );

    //Calculo vector para orbitar
    let orb = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    orb.normalize().multiplyScalar(this.radio);
    this.rotation.crossVectors(pos, orb);
    while(this.rotation.length() < 0.0001) {
      orb = new THREE.Vector3(Math.random(), Math.random(), Math.random());
      orb.normalize().multiplyScalar(this.radio);
      this.rotation.crossVectors(pos, orb);
    }
    this.rotation.normalize();

    // geometria, material y mesh
    let size = this.lado * Math.random() + this.lado/20;

    let asteroidGeometry = new THREE.IcosahedronGeometry(size, 0);
  	let asteroidMaterial = new THREE.MeshBasicMaterial({
  		wireframe: true,
      color: 0xffffff
  	});

  	this.asteroidMesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  	this.asteroidMesh.position.set(this.position.x, this.position.y, this.position.z);

    this.scene.add(this.asteroidMesh);

    // hitbox
    this.hitboxRad = size;
    let hitboxGeometry = new THREE.SphereGeometry(this.hitboxRad, 8, 8);
    let hitboxMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xff0000
    });

    this.hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
    this.hitboxMesh.position.set(this.position.x, this.position.y, this.position.z);
    
    if(this.debug)
      this.scene.add(this.hitboxMesh);
  };

  // UPDATE orbita
  this.update = function( delta ) {
    this.position.applyAxisAngle(this.rotation, this.angVel * delta);
    let para = this.position.clone();
    para.normalize().multiplyScalar(this.radVel);
    this.position.add(para);

    this.asteroidMesh.position.set(this.position.x, this.position.y, this.position.z);
    if(this.debug)
      this.hitboxMesh.position.set(this.position.x, this.position.y, this.position.z);
  };
}
