class CenterShield extends PolyObject {
  constructor( parent, pos, size ) {
      super( parent, pos, size );

      this.position.copy(pos);

      this.radio = pos.length();
      this.size = size;
      this.t = 0;
      this.colorResetTime = 0;
      this.blinkTime = 0.08;

      this.setHp(15000);

      // center asteroids
      this.asteroidCount = Infinity;

      // geometria, material y mesh
      // SHIELD
      let shieldMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x000000
      });

      let shieldGeometry = new THREE.SphereGeometry(this.size, 10, 10);

      this.mesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
      this.mesh.position.copy(this.position);
  };

  // UPDATE orbita
  update ( delta ) {
    this.t += delta;

    let d = this.t - this.colorResetTime;

    if( d > this.blinkTime && d < 2*this.blinkTime) {
      this.mesh.material.color.setHex( 0x000000 );
    }


  };

  // colisiones
  onCollide(who) {
    this.colorResetTime = this.t;
    this.mesh.material.color.setHex( 0x016804 );

    if(this.asteroidCount < 1) {
      this.blinkTime = 0.15;
      this.hp -= who.getPower();

      let shotsTilBlow = 20;
      let blow = (this.hp % (100 * shotsTilBlow)) / 100;
      let scl = THREE.Math.mapLinear(blow, shotsTilBlow - 1, 0, 1, 1.2);
      this.mesh.scale.set(scl, scl, scl);
      if(blow == 0)
      {
        COMMON.createAsteroidBarrier( this.parentStage );
      }

      if(this.hp < 0)
      {
        COMMON.createExplosion( this.parentStage, new THREE.Vector3(0, 0, 0), this.size, 16, 2);
        this.parentStage.removeFromScene(this);
      }
    }
  }
}
