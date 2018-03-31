class CenterShield extends PolyObject {
  constructor(pos, size) {
      super(pos, size);

      this.position.copy(pos);

      this.radio = pos.length();
      this.size = size;
      this.t = 0;
      this.colorResetTime = 0;

      // geometria, material y mesh
      // SHIELD
      let shieldMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x000000
      });

      let shieldGeometry = new THREE.SphereGeometry(this.size, 10, 10);

      this.mesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  };

  // UPDATE orbita
  update ( delta ) {
    this.t += delta;

    let d = this.t - this.colorResetTime;
    let blinkTime = 0.08;
    if( d > blinkTime && d < 2*blinkTime) {
      this.mesh.material.color.setHex( 0x000000 );
    }
  };

  // colisiones
  onCollide(who) {
    this.colorResetTime = this.t;
    this.mesh.material.color.setHex( 0x016804 );
  }
}
