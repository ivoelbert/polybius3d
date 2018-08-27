class Center extends PolyObject {
    constructor(parent, pos, size) {
        super(parent, pos, size);

        this.position.copy(pos);
        this.size = size;
        this.hitsReceived = 0;
        this.needToCreate = true;

        this.t = 0;

        this.mesh = COMMON.centerMesh.clone();
        this.mesh.scale.setLength(STATE.radius);

        this.asteroids = new THREE.Group();
        this.wAsteroids = 8; //32;
        this.hAsteroids = 6; //20;

        this.hp = 100 * 1000;

        this.shield = new CenterShield( this.parentStage, this.position.clone(), this.lado * 1.6 );
        this.indestructableShield = false;

        //asteroides
        let sph = new THREE.SphereGeometry(this.lado * 1.8, this.wAsteroids, this.hAsteroids);
        for(let i = 0; i < sph.vertices.length; i++)
        {
            this.asteroids.add( new CenterAsteroid( this.parentStage, sph.vertices[i].clone(), this.lado / 6, 0 ) );
        }
    }


    update( delta ) {
        this.t += delta;

        for(let i = 0; i < this.asteroids.children.length; i++)
        {
            this.asteroids.children[i].update( delta );
        }

        this.shield.asteroidCount = this.asteroids.children.length;
        if(this.indestructableShield)
            this.shield.asteroidCount = 1;
        
        this.shield.update( delta );
    }

    onCollide( who ) {
        this.hitsReceived = (this.hitsReceived + 1) % 4;

        if(this.hitsReceived == 3 && this.needToCreate) {
            COMMON.createRandomAsteroid( this.parentStage );
            this.needToCreate = false;
        }

        if(this.hitsReceived == 0) {
            this.needToCreate = true;
        }

    }

    removeCenterAsteroids() {
        let asteroidsCount = this.asteroids.children.length
        for(let i = 0; i < asteroidsCount; i++) {
            this.parentStage.removeFromScene( this.asteroids.children[0] );
        }

        this.indestructableShield = true;
    }

    addShieldToGroup( gr ) {
        gr.add(this.shield);
    }

    getAsteroidsGroup() {
        return this.asteroids;
    }

    addToScene(scene) {
        scene.add(this.mesh);

        for(let i = 0; i < this.asteroids.children.length; i++)
        {
            scene.add(this.asteroids.children[i].mesh);
        }

        scene.add(this.shield.mesh);
    }
}
