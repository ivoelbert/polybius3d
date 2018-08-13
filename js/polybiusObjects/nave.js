class Nave extends PolyObject {
    constructor(parent, pos, size) {
        super(parent, pos, size);

        this.position.copy(pos);
        this.size = size;
        this.matrix = new THREE.Matrix4();

        let selectedMesh = 0;

        this.mesh = COMMON.naveMesh[selectedMesh];
        this.mesh.position.copy(this.position);

        this.mesh.scale.multiplyScalar(this.size * COMMON.getNaveScale(selectedMesh));
        this.hitbox.mesh.scale.multiplyScalar(COMMON.getHitboxScale(selectedMesh));
        this.updateHitbox(this.position, this.hitbox.radius * COMMON.getHitboxScale(selectedMesh));

        this.setPower(500);

        // CONTROLS //
        this.controls = new THREE.PolyControls(STATE.container);

        this.rad = this.position.length();
        this.minRad = STATE.minRadius;
        this.maxRad = STATE.maxRadius;
        this.radSpeed = STATE.radius / 6;
        this.angSpeed = 0.03;
        this.rotSpeed = 0.03;

        this.tirotoAvailable = true;
        this.tiritoRecovery = 0;

        this.shoot = 0;
        this.leftRight = 0;
        this.upDown = 0;
        this.forwardBack = 0;
        this.rollLeftRollRight = 0;
        //////////////
    }

    blockKeys(keys) {
        this.controls.blockKeys(keys);
    }

    unblockKeys(keys) {
        this.controls.unblockKeys(keys);
    }
    
    // Colisiones TODO
    onCollide(who) {
        if(who.isAcid)
            this.parentStage.naveCollideAcid();
        else
            this.parentStage.naveCollide(who);
    }

    updateControls()
    {
        let keys = this.controls.update();

        this.shoot = keys.shoot;
        this.leftRight = ( - keys.left + keys.right );
        this.upDown = ( - keys.up + keys.down );
        this.forwardBack = ( - keys.forward + keys.back );
        this.rollLeftRollRight = ( - keys.rollLeft + keys.rollRight );
    };

    update( delta )
    {
        // Actualizo los controles
        this.updateControls();
        // Actualizo el radio
        var zoffset = this.forwardBack * this.radSpeed;

        if(this.rad + zoffset < this.minRad) {
            this.rad = this.minRad;
        } else if(this.rad + zoffset > this.maxRad) {
            this.rad = this.maxRad;
        } else {
            this.rad += zoffset;
        }

        // Actualizo la posición
        var xrot = - this.upDown * this.angSpeed;
        var yrot = this.leftRight * this.angSpeed;
        var zrot = this.rollLeftRollRight * this.rotSpeed;

        var xAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(this.matrix);
        var yAxis = new THREE.Vector3(0, 1, 0).applyMatrix4(this.matrix);
        var zAxis = new THREE.Vector3(0, 0, 1).applyMatrix4(this.matrix);

        var rxmatrix = new THREE.Matrix4().makeRotationAxis(xAxis, xrot);
        var rymatrix = new THREE.Matrix4().makeRotationAxis(yAxis, yrot);
        var rzmatrix = new THREE.Matrix4().makeRotationAxis(zAxis, zrot);

        this.matrix.premultiply(rxmatrix);
        this.matrix.premultiply(rymatrix);
        this.matrix.premultiply(rzmatrix);

        let pos = new THREE.Vector3(0, 0, -1).applyMatrix4(this.matrix);
        pos.multiplyScalar(this.rad);
        this.position.copy(pos);

        // Actualizo el mesh
        this.mesh.position.copy(this.position);

        let upvec = new THREE.Vector3(0, 1, 0);
        upvec.applyMatrix4(this.matrix);
        this.mesh.up.copy(upvec);
        this.mesh.lookAt(new THREE.Vector3(0, 0, 0));

        this.updateHitbox(this.position, this.hitbox.radius);

        // tiros
        if(!this.tiritoAvailable) {
            this.tiritoRecovery += delta;
            if(this.tiritoRecovery > 0.1) {
                this.tiritoAvailable = true;
                this.tiritoRecovery = 0;
            }
        } else if (this.shoot === 1) {
            this.tiritoAvailable = false;
            COMMON.shootTirito( this.parentStage, this.position.clone());
        }
    };

    // Getters
    getPosition() {
        return this.position.clone();
    }

    getMatrix() {
        return this.matrix.clone();
    }
}
