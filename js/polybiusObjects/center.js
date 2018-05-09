class Center extends PolyObject {
  constructor(parent, pos, size) {
    super(parent, pos, size);

    this.position.copy(pos);
    this.size = size;
    this.hitsReceived = 0;
    this.needToCreate = true;

    this.centerMesh = [];
    this.lado = size;
    this.t = 0;

    this.asteroids = new THREE.Group();
    this.wAsteroids = 8; //32;
    this.hAsteroids = 6; //20;

    this.hp = 100 * 1000;

    this.shield = new CenterShield( this.parentStage, this.position.clone(), this.lado * 1.6 );

    // CENTRO

    let centerMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xff0c00
    });

    //estrella
    let tetra0 = new THREE.TetrahedronGeometry(this.lado, 0);
    let tetra1 = new THREE.TetrahedronGeometry(this.lado, 0);
    this.centerMesh[0] = new THREE.Mesh(tetra0, centerMaterial);
    this.centerMesh[1] = new THREE.Mesh(tetra1, centerMaterial);
    this.centerMesh[0].rotation.y = Math.PI / 2;

    //falopa
    let falopa = new THREE.IcosahedronGeometry(this.lado / 2 , 0);
    this.centerMesh[2] = new THREE.Mesh(falopa, centerMaterial);

    //nucleo
    let nucleo = new THREE.CubeGeometry(this.lado/20 , this.lado/20, this.lado/20);
    this.centerMesh[3] = new THREE.Mesh(nucleo, centerMaterial);


    ///////////////////////
    // SCAF
    ///////////////////////

    //asteroides
    let sph = new THREE.SphereGeometry(this.lado * 1.8, this.wAsteroids, this.hAsteroids);
    for(let i = 0; i < sph.vertices.length; i++)
    {
      this.asteroids.add( new CenterAsteroid( this.parentStage, sph.vertices[i].clone(), this.lado / 6, 0 ) );
    }
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
    this.t += delta;

    //nucleo
    this.centerMesh[3].rotation.x += 10 * delta;
    this.centerMesh[3].rotation.y += 10 * delta;

    // Handle color when hit

    for(let i = 0; i < this.asteroids.children.length; i++)
    {
      this.asteroids.children[i].update( delta );
    }

    this.shield.asteroidCount = this.asteroids.children.length;
    this.shield.update( delta );
  }

  onCollide( who ) {
    this.hitsReceived = (this.hitsReceived + 1) % 4;

    if(this.hitsReceived == 3 && this.needToCreate) {
      COMMON.createRandomAsteroid( this.parentStage );
      this.needToCreate = false;
    }

    if(this.hitsReceived == 0) {
      this.needToCreate = true;
    }

  }

  addShieldToGroup( gr ) {
    gr.add(this.shield);
  }

  getAsteroidsGroup() {
    return this.asteroids;
  }

  addToScene(scene) {
    scene.add(this.centerMesh[0]);
    scene.add(this.centerMesh[1]);
    scene.add(this.centerMesh[2]);
    scene.add(this.centerMesh[3]);

    for(let i = 0; i < this.asteroids.children.length; i++)
    {
      scene.add(this.asteroids.children[i].mesh);
    }

    scene.add(this.shield.mesh);
  }
}
