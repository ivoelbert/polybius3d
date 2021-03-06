class CenterMisil extends PolyObject {
  constructor(parent, followed, pos, size, vel, angVel, dir) {
    super(parent, pos, size * 0.6);
    this.size = size;
    this.position.copy(pos);
    this.speed = vel;
    this.angSpeed = angVel;

    this.followed = followed;

    this.t = 0;
    this.radToLive = 650;

    if(dir === undefined)
    {
      let randomDir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
      randomDir.setLength(this.speed);
      this.direction = randomDir;
    }
    else
    {
      this.direction = dir;
      this.direction.setLength(this.speed);
    }

    this.setPower(100);

    this.mesh = COMMON.misilMesh.clone();
    this.mesh.scale.multiplyScalar( this.size );

    let lookAtPos = this.position.clone();
    lookAtPos.add(this.direction);
    this.mesh.lookAt(lookAtPos);
    this.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.5);
  }

  update( delta ) {
    this.t += delta;

    let towards = this.followed.position.clone();
    towards.sub(this.position);

    let angle = this.direction.angleTo(towards);
    angle = THREE.Math.clamp(angle, -this.angSpeed * delta, this.angSpeed * delta);

    let normal = new THREE.Vector3(0, 0, 0);
    normal.crossVectors(towards, this.direction);
    normal.normalize();

    this.direction.applyAxisAngle(normal, -angle);

    let lookAtPos = this.position.clone();
    lookAtPos.add(this.direction);
    this.mesh.lookAt(lookAtPos);
    this.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.5);

    let fireRot = 10;
    this.mesh.children[0].scale.y += Math.sin(this.t * 10) * 0.05;
    this.mesh.children[0].rotateY(delta * fireRot);
    this.mesh.children[1].scale.y -= Math.cos(this.t * 10) * 0.05;
    this.mesh.children[1].rotateY(delta * -fireRot);

    let gotov = this.direction.clone();
    gotov.multiplyScalar( delta );

    this.position.add(gotov);

    this.updateHitbox(this.position, this.size * 0.6);
    this.mesh.position.copy(this.position);

    let actualRad = this.position.length();
    if(this.position.length() > this.radToLive)
    {

      let explosionPos = this.position.clone();
      COMMON.createExplosion(this.parentStage, explosionPos, this.size , 12);
      this.parentStage.removeFromScene(this);
    }
  }

  addToScene( scene ) {
    scene.add(this.mesh);
    if(COMMON.debug) {
      scene.add(this.hitbox.mesh)
    }
  }

  onCollide(who) {
    let explosionPos = this.position.clone();
    COMMON.createExplosion(this.parentStage, explosionPos, this.size , 12);
    this.parentStage.removeFromScene(this);
  }
}
