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
