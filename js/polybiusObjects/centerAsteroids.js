class CenterAsteroid extends PolyObject {
  constructor(parent, pos, size, angVel) {
      super(parent, pos, size * 1.3);

      this.position.copy(pos);
      this.size = size;

      this.rot = new THREE.Vector3();
      this.angVel = angVel;
      this.radio = pos.length();
      this.setHp(100);


      // mesh
      this.mesh = COMMON.centerAsteroidMesh.clone();
      this.mesh.position.copy(this.position);
      this.mesh.scale.multiplyScalar( this.size );

      //Calculo vector para orbitar
      let orb = new THREE.Vector3(Math.random(), Math.random(), Math.random());
      orb.normalize().multiplyScalar(this.radio);
      this.rot.crossVectors(pos, orb);
      while(this.rot.length() < 0.0001) {
        orb = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        orb.normalize().multiplyScalar(this.radio);
        this.rot.crossVectors(pos, orb);
      }

      this.rot.normalize();
  };

  // UPDATE orbita
  update ( delta ) {
      this.position.applyAxisAngle(this.rot, this.angVel * delta);﻿

      this.mesh.position.set(this.position.x, this.position.y, this.position.z);

      this.updateHitbox(this.position, this.size * 1.3);
  };

  // colisiones
  onCollide(who) {
    let hit = who.getPower();
    this.hp -= hit;
    if(this.hp <= 0) {
      COMMON.createAsteroidAt(this.parentStage, this.position.clone());
      this.parentStage.removeFromScene(this);
    }
  }
}
