class Asteroid extends PolyObject {
  constructor(pos, size ,radv, angv, rotationVector) {
      super(pos, size);

      this.position.copy(pos);
      this.radVel = radv > 0 ? radv : 0;
      this.angVel = angv > 0 ? angv : 0;
      this.radio = pos.length();
      this.size = size;
      this.rot = new THREE.Vector3();

      this.setHp(300);
      this.t = 0;
      this.timeToLive = Infinity;

      this.radToLive = 800;

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
      let asteroidGeometry = new THREE.SphereGeometry(this.size, 10, 10);
      let asteroidMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true
      });

      this.mesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  };

  // UPDATE orbita
  update ( delta ) {
      this.position.applyAxisAngle(this.rot, this.angVel * delta);﻿

      let para = this.position.clone();
      para.normalize().multiplyScalar(this.radVel);
      this.position.add(para);

      this.mesh.position.set(this.position.x, this.position.y, this.position.z);

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
    let hit = who.getPower();
    this.hp -= hit;
    if(this.hp <= 0) {
      removeFromScene(this);
    } else {
      let newDetail = this.hp * 0.03;
      let newGeometry = new THREE.SphereGeometry(this.size, newDetail, newDetail);
      this.mesh.geometry = newGeometry;
    }
  }
}
