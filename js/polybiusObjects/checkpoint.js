class Checkpoint extends PolyObject {
    constructor(parent, pos, size, picked) {
        super(parent, pos, size);
  
        this.position.copy(pos);
        this.size = size;

        this.picked = picked;
  
        this.setHp(10);
        this.setPower(0);
        this.t = 0;
        
        // geometria, material y mesh
        this.mesh = COMMON.checkpointMesh.clone();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.scale.multiplyScalar(this.size);
    };
  
    // UPDATE orbita
    update ( delta ) {
        this.t += delta;
    };
  
    // colisiones
    onCollide(who) {
        this.parentStage.removeFromScene(this);
        if(typeof(this.picked) == "function")
            this.picked();
    }
}
  