class ExplosionFragment extends PolyObject {
  constructor(pos, size, direction) {
      super(pos, size);

      this.position.copy(pos);
      this.size = size;
      this.direction = direction.clone();
      this.lifetime = 0;

      this.setHp(50);
      this.setPower(100);

      // geometria, material y mesh
      let fragmentGeometry = new THREE.TetrahedronGeometry( this.size, Math.floor(Math.random() + 0.5) );
      let fragmentMaterial = new THREE.MeshBasicMaterial({
        color: 0xffe075,
        wireframe: true
      });

      this.mesh = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
      this.mesh.position.copy(this.position);
  };

  // UPDATE orbita
  update ( delta ) {
      this.lifetime += delta;

      let movementVector = this.direction.clone();
      movementVector.multiplyScalar(delta);
      this.position.add(movementVector);﻿

      this.mesh.position.copy(this.position);

      let black = new THREE.Color( 0x4c0000 );
      let l = THREE.Math.mapLinear( this.lifetime, 0, 10, 0, 1 );
      this.mesh.material.color.lerp(black, l);

      if(l >= 0.1) {
        removeFromScene(this);
      }

      this.updateHitbox(this.position, this.size);
  };

  // colisiones
  onCollide(who) {
    let hit = who.getPower();
    this.hp -= hit;
    if(this.hp <= 0) {
      removeFromScene(this);
    }
  }
}
