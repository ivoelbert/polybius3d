class powerUp extends PolyObject {
  constructor(pos, size) {
      super(pos, size);

      this.position.copy(pos);
      this.size = size;

      this.t = 0;
      this.timeToLive = 5;
      this.radToLive = Infinity;

      // geometria, material y mesh
      this.mesh = COMMON.powerUpMesh.clone();
      this.mesh.position.copy(this.position);
      this.mesh.scale.multiplyScalar(this.size);
  };

  // UPDATE orbita
  update ( delta ) {


      this.mesh.position.copy(this.position);
      this.updateHitbox(this.position, this.size);

      this.t += delta;
      if(this.t > this.timeToLive || this.position.length() > this.radToLive)
      {
          let explosionPos = this.position.clone();
          createExplosion(explosionPos, this.size , 4);
          removeFromScene(this);
      }
  };

  // colisiones
  onCollide(who) {

  }
}
