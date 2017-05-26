Asteroid = function( ascene, lado ){
  this.lado = lado;
  this.radio = 0;
  this.scene = ascene;
  this.asteroidMesh;
  this.position = new THREE.Vector3();
  this.rotation = new THREE.Vector3();
  this.radVel = 100;
  this.angVel = 0.02;

  //Init
  this.init = function( pos, radv, angv ) {
    this.radVel = radv > 0 ? radv : this.radVel;
    this.angVel = angv > 0 ? angv : this.angVel;

    this.radio = pos.length();
    this.position.set( pos.x, pos.y, pos.z );
    //Calculo vector para orbitar
    var orb = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    orb.normalize().multiplyScalar(this.radio);
    this.rotation.crossVectors(pos, orb);
    while(this.rotation.length() < 0.0001) {
      orb = new THREE.Vector3(Math.random(), Math.random(), Math.random());
      orb.normalize().multiplyScalar(this.radio);
      this.rotation.crossVectors(pos, orb);
    }
    this.rotation.normalize();

    let asteroidGeometry = new THREE.IcosahedronGeometry( this.lado*Math.random() + this.lado/20, 0);

  	let asteroidMaterial = new THREE.MeshBasicMaterial({
  		wireframe: true
  	});
  	asteroidMaterial.color.setHSL(0, 1, 1);

  	this.asteroidMesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  	this.asteroidMesh.position.set(this.position.x, this.position.y, this.position.z);

  	this.scene.add(this.asteroidMesh);
  };

  // UPDATE orbita
  this.update = function(delta) {
    console.log(this.position);
    this.position.applyAxisAngle(this.rotation, this.angVel * delta);
    console.log(this.position);
    var para = this.position.clone();
    para.normalize().multiplyScalar(this.radVel);
    this.position.add(para);

    this.asteroidMesh.position.set(this.position.x, this.position.y, this.position.z);
  }
}
