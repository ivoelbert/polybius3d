class Center extends PolyObject {
  constructor(pos, size) {
    super(pos, size);

    this.position.copy(pos);
    this.size = size;
    this.colorChangeRate = 0.003;
    this.hitsReceived = 0;
    this.needToCreate = true;

    this.centerMesh = [];
    this.lado = 2000;
    this.t = 0;

    this.asteroids = new THREE.Group();
    this.wAsteroids = 4; //32;
    this.hAsteroids = 4; //20;

    this.hp = 100 * 1000;

    this.shield = new CenterShield(this.position.clone(), this.lado * 9);

    // CENTRO

    let centerMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xff0c00
    });

    //estrella
    let tetra0 = new THREE.TetrahedronGeometry(this.lado * 8, 0);
    let tetra1 = new THREE.TetrahedronGeometry(this.lado  * 8, 0);
    this.centerMesh[0] = new THREE.Mesh(tetra0, centerMaterial);
    this.centerMesh[1] = new THREE.Mesh(tetra1, centerMaterial);
    this.centerMesh[0].rotation.y = Math.PI / 2;

    //falopa
    let falopa = new THREE.IcosahedronGeometry(this.lado * 4 , 0);
    this.centerMesh[2] = new THREE.Mesh(falopa, centerMaterial);

    //nucleo
    let nucleo = new THREE.CubeGeometry(this.lado/5 , this.lado/5, this.lado/5);
    this.centerMesh[3] = new THREE.Mesh(nucleo, centerMaterial);


    ///////////////////////
    // SCAF
    ///////////////////////

    //asteroides
    let sph = new THREE.SphereGeometry(this.lado * 10, this.wAsteroids, this.hAsteroids);
    for(let i = 0; i < sph.vertices.length; i++)
    {
      this.asteroids.add( new CenterAsteroid(sph.vertices[i].clone(), this.lado * 1, 0 ) );   //Math.random(-0.1, 0.1)
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
      //console.log(this.asteroids.children[i]);
    }

    if( ! (this.t - this.colorResetTime < 0.05) ) {
      for(let i = 0; i < 4; i++) {
        this.centerMesh[i].material.color.setRGB( 0xff0c00 );
      }
    }

    this.shield.update( delta );
/*    for(let i = 0; i < 3; i++) {
      this.centerMesh.children[i].material.color.setHSL((i / 3) + this.hueOff % 1 , 1, 0.5);
    }
    this.hueOff += this.colorChangeRate;*/
  }

  onCollide( who ) {
    this.hitsReceived = (this.hitsReceived + 1) % 4;

    if(this.hitsReceived == 3 && this.needToCreate) {
      createRandomAsteroid();
      this.needToCreate = false;
    }

    if(this.hitsReceived == 0) {
      this.needToCreate = true;
    }

    // Handle color when hit
    for(let i = 0; i < 4; i++) {
      this.centerMesh[i].material.color.setRGB( 1, 1, 1 );
      this.colorResetTime = this.t;
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
