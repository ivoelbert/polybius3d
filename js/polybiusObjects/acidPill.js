class AcidPill extends PolyObject {
  constructor(pos, size ,radv, angv, rotationVector) {
      super(pos, size);

      this.position.copy(pos);
      this.radVel = radv > 0 ? radv : 0;
      this.angVel = angv > 0 ? angv : 0;
      this.radio = pos.length();
      this.size = size;
      this.rot = new THREE.Vector3();

      this.setHp(100);
      this.isAcid = true;

      //Calculo vector para orbitar
      if(rotationVector == undefined) {
        let orb = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        orb.normalize().multiplyScalar(this.radio);
        this.rot.crossVectors(pos, orb);
        while(this.rot.length() < 0.0001) {
          orb = new THREE.Vector3(Math.random(), Math.random(), Math.random());
          orb.normalize().multiplyScalar(this.radio);
          this.rot.crossVectors(pos, orb);
        }
      } else {
        this.rot = rotationVector.clone();
      }
      this.rot.normalize();

      // geometria, material y mesh

      let pillGeometry = new THREE.CylinderGeometry(this.size/3, this.size/3, this.size, 12);

      let pillMaterial = new THREE.MeshBasicMaterial({
        color: 0x22ff22,
        wireframe: true
      });

      this.mesh = new THREE.Mesh(pillGeometry, pillMaterial);
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  };

  // UPDATE orbita
  update ( delta ) {
      this.position.applyAxisAngle(this.rot, this.angVel * delta);﻿

      let para = this.position.clone();
      para.normalize().multiplyScalar(this.radVel);
      this.position.add(para);

      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
      this.mesh.rotation

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
