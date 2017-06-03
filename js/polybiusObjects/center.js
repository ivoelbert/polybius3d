class Center extends PolyObject {
  constructor(pos, size) {
    super(pos, size);

    this.position.copy(pos);
    this.size = size;
    this.hueOff = 0;
    this.colorChangeRate = 0.003;
    this.hitsReceived = 0;
    this.needToCreate = true;


    this.centerMesh = [];
    this.lado = 2000;
    this.t = 0;


    let centerMaterial = new THREE.MeshBasicMaterial({
      wireframe: true
    });
/*    centerMaterial.color.setHSL( Math.random(), 1, 0.6);
*/
    //estrella
    let tetra0 = new THREE.TetrahedronGeometry(this.lado * 10, 0);    
    let tetra1 = new THREE.TetrahedronGeometry(this.lado  * 10, 0);
    this.centerMesh[0] = new THREE.Mesh(tetra0, centerMaterial);
    this.centerMesh[1] = new THREE.Mesh(tetra1, centerMaterial);
    this.centerMesh[0].rotation.y = Math.PI / 2;

    //falopa
    let falopa = new THREE.IcosahedronGeometry(this.lado * 4 , 0);
    this.centerMesh[2] = new THREE.Mesh(falopa, centerMaterial);

    //nucleo
    let nucleo = new THREE.CubeGeometry(this.lado/5 , this.lado/5, this.lado/5);
    this.centerMesh[3] = new THREE.Mesh(nucleo, centerMaterial);
  }
  

  update( delta ) {
    //rotacion
    //estrella
    this.centerMesh[0].rotation.x += 2 * delta;
    this.centerMesh[0].rotation.y += 2 * delta;
    this.centerMesh[1].rotation.x += 2 * delta;
    this.centerMesh[1].rotation.y += 2 * delta;

    //falopa
    this.centerMesh[2].rotation.x -= 1 * delta;
    this.centerMesh[2].rotation.y += 1 * delta;
    this.centerMesh[2].scale.set( Math.cos(this.t), Math.sin(this.t), Math.cos(this.t));
    this.t += 0.02;

    //nucleo
    this.centerMesh[3].rotation.x += 10 * delta;
    this.centerMesh[3].rotation.y += 10 * delta;


/*    for(let i = 0; i < 3; i++) {
      this.centerMesh.children[i].material.color.setHSL((i / 3) + this.hueOff % 1 , 1, 0.5);
    }
    this.hueOff += this.colorChangeRate;*/
  }

  onCollide( who ) {
    this.hueOff += 0.2;
    this.hitsReceived = (this.hitsReceived + 1) % 4;
    if(this.hitsReceived == 3 && this.needToCreate) {
      createRandomAsteroid();
      this.needToCreate = false;
    }
    if(this.hitsReceived == 0) {
      this.needToCreate = true;
    }
  }

  addToScene(scene) {
    scene.add(this.centerMesh[0]);
    scene.add(this.centerMesh[1]);
    scene.add(this.centerMesh[2]);
    scene.add(this.centerMesh[3]);
  }
}

/*
Center = function( cscene, rad, cant ) {
  this.scene = cscene;
  this.radius = rad;
  this.centerMesh = [];
  this.centerBodies = cant;
  this.hueOff = 0;
  this.colorChangeRate = 0.002;

  //Init
  this.init = function() {
    for (let i = 0; i < this.centerBodies; i++) {
      let centerMaterial = new THREE.MeshBasicMaterial({
        wireframe: true
      });

      centerMaterial.color.setHSL(i / this.centerBodies, 1, 0.6);

      let lado = this.radius - (this.radius/ this.centerBodies) * i;
      let centerGeometry = new THREE.SphereGeometry(lado, 20, 20);
      this.centerMesh[i] = new THREE.Mesh(centerGeometry, centerMaterial);
      this.scene.add(this.centerMesh[i]);
    }
  };

  //Update
  this.update = function( d ) {
    for(let i = 0; i < this.centerBodies; i++) {
      this.centerMesh[i].material.color.setHSL((i / this.centerBodies) + this.hueOff % 1 , 1, 0.5);
    }
    this.hueOff += this.colorChangeRate;
  };

}
*/
