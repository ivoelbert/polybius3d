class selectionCenter extends PolyObject {
  constructor(pos, size) {
    super(pos, size);

    this.position.copy(pos);
    this.size = size;
    this.hitsReceived = 0;

    this.centerMesh = [];
    this.lado = size;
    this.t = 0;

    this.hp = 100 * 15;

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


    this.lastHit = 0;
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

    this.lastHit += delta;
    if(this.lastHit > 1)
    {
      this.hp += delta * 200;
      if(this.hp > 100 * 15)
        this.hp = 100 * 15;
    }

    document.getElementById("health").style.width = THREE.Math.mapLinear(this.hp, 0, 100 * 15, 0, 98.5) + "%";
  }

  onCollide( who ) {
    this.hp -= who.getPower();
    this.lastHit = 0;

    if(this.hp < 0)
    {
      document.location.replace("/polybius.html?selectedMesh=" + COMMON.selectedMesh);
    }
  }

  addToScene(scene) {
    scene.add(this.centerMesh[0]);
    scene.add(this.centerMesh[1]);
    scene.add(this.centerMesh[2]);
    scene.add(this.centerMesh[3]);
  }
}
