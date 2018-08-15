class Asteroid extends PolyObject {
    constructor(parent, pos, size ,radv, angv, rotationVector) {
        super(parent, pos, size);

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
            let orb = COMMON.randomUnitVector();
            orb.multiplyScalar(this.radio);
            this.rot.crossVectors(pos, orb);
            while(this.rot.length() < 0.0001) {
                let orb = COMMON.randomUnitVector();
                orb.multiplyScalar(this.radio);
                this.rot.crossVectors(pos, orb);
            }
        } else {
            this.rot = rotationVector.clone();
        }
        this.rot.normalize();

        // geometria, material y mesh
        this.mesh = new THREE.Mesh(COMMON.asteroidGeometry[0], COMMON.asteroidMaterial);
        this.mesh.position.copy(this.position);
        this.mesh.scale.multiplyScalar(this.size);
    };

    // UPDATE orbita
    update ( delta ) {
        this.position.applyAxisAngle(this.rot, this.angVel * delta);

        let para = this.position.clone();
        para.normalize().multiplyScalar(this.radVel);
        this.position.add(para);

        this.mesh.position.copy(this.position);

        this.updateHitbox(this.position, this.size);

        this.t += delta;
        if(this.t > this.timeToLive || this.position.length() > this.radToLive)
        {
            let explosionPos = this.position.clone();
            COMMON.createExplosion(this.parentStage, explosionPos, this.size , 4);
            this.parentStage.removeFromScene(this);

            if(typeof(this.deadCallback) == "function")
                this.deadCallback({});
        }
    };

    setDeadCallback(callback) {
        this.deadCallback = callback;
    }

    // colisiones
    onCollide(who) {
        let hit = who.getPower();
        this.hp -= hit;
        if(this.hp <= 0) {
            this.parentStage.removeFromScene(this);
            if(typeof(this.deadCallback) == "function")
                this.deadCallback(who);
        } else {
            let geom = Math.floor(THREE.Math.mapLinear(this.hp, 300, 0, 0, 3));
            this.mesh.geometry = COMMON.asteroidGeometry[geom];
        }
    }
}
