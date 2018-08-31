
var COMMON = {};

// quadratic easing function
COMMON.easeInOut = function(t) {
    return t<.5 ? 2*t*t : -1+(4-2*t)*t
}

COMMON.randomUnitVector = function() {
    let vec = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    vec.normalize();

    return vec;
}

// random number between a and b
COMMON.randBetween = function(a, b) {
    return THREE.Math.mapLinear(Math.random(), 0, 1, a, b);
}


// .obj loader
var loader = new THREE.OBJLoader();
var mtlLoader = new THREE.MTLLoader();

loader.setPath("models/");
mtlLoader.setPath("models/");

COMMON.loadObject = function(url, materialUrl) {
    if(materialUrl === undefined)
    {
        return new Promise( (resolve, reject) => {
            loader.load(url, resolve, () => {}, reject);
        });
    }
    else
    {
        return new Promise( (resolve, reject) => {
            mtlLoader.load(materialUrl, function(materials) {
                materials.preload();

                let localLoader = new THREE.OBJLoader()
                localLoader.setMaterials( materials )
                localLoader.setPath( 'models/' )
                localLoader.load( url, resolve, () => {}, reject );
            },
            () => {},
            reject);
        });
    }
};

// NAVES
COMMON.naveMesh = [];

let naveMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});

// Load naves from .obj files. (Called from loadPill for now...)
COMMON.loadNaves = function() {
    let navesToLoad = [
        "polyNave7wire.obj",
        "starWars2.obj",
        "ApoloWireframeFix.obj",
        "naveChala180origSize.obj",
        "fetusLow6666.obj"
    ];

    let promises = navesToLoad.map( name => { 
        return COMMON.loadObject(name);
    });

    Promise.all(promises).then(
        values => {
            COMMON.naveMesh = values.map( object => {
                let naveGeometry = object.children[0].geometry;
                return new THREE.Mesh(naveGeometry, naveMaterial);
            });

            endLoading();
        },
        reason => {
            console.error(reason);
        }
    );
};

// .obj files have some trouble with scale. This sets scale manually. Order of naves comes from loadNaves() array of paths.
COMMON.getNaveScale = function(nave)
{
    switch(nave)
    {
        // DEFAULT
        case 0:
        return 1;

        // STARWARS
        case 1:
        return 10;
        break;

        // APOLO
        case 2:
        return 3;

        // CHALA
        case 3:
        return 2;

        // FETUS
        case 4:
        return 2;
    }
}


// Manually set spherical hitbox radius, as complex models may need tweeking
COMMON.getHitboxScale = function(nave)
{
    switch(nave)
    {
        // DEFAULT
        case 0:
        return 4;

        // STARWARS
        case 1:
        return 4;

        // APOLO
        case 2:
        return 7;

        // CHALA
        case 3:
        return 4;

        // FETUS
        case 4:
        return 4;
    }
}


// ACID PILL

let pillMaterial = new THREE.MeshBasicMaterial({
    color: 0x22ff22,
    wireframe: true
});

COMMON.pillMesh;

// load pill mesh, when finished load naves
loader.load(
    // resource URL
    'acidpill.obj',

    // called when resource is loaded
    function ( object ) {
        let pillGeometry = object.children[0].geometry;
        COMMON.pillMesh = new THREE.Mesh(pillGeometry, pillMaterial);

        COMMON.loadNaves();
    },

    // when loading
    function ( loaded ) {},

    // called when loading has errors
    function ( error ) {
        console.log( error );
    }
);

// Creates acid pill at position -pos-
COMMON.createAcidPillAt = function( stage, pos ) {
    let acidPill = new AcidPill(stage, pos, STATE.radius/2, 1, 1);
    acidPill.addToScene( stage.scene );
    stage.groupPills.add(acidPill);
}

// Creates a random acid pill
COMMON.createRandomAcidPill = function( stage ) {
let pos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    pos.normalize().multiplyScalar( STATE.radius );
    COMMON.createAcidPillAt( stage, pos );
}


// POWER UP    TODO: IMPLEMENT

COMMON.powerUpMesh;

loader.load(
    // resource URL
    'powerUp.obj',
    // called when resource is loaded
    function ( object ) {
        COMMON.powerUpMesh = object;
    },

    // when loading
    function ( loaded ) {},
    
    // called when loading has errors
    function ( error ) {

        console.log( error );

    }
);

function createPowerUp(pos, sz) {
    let powerup = new powerUp(pos, sz);
    powerup.addToScene( scene );
    groupPowerUps.add( powerup );
}



// Laser

let laserMaterial = new THREE.MeshBasicMaterial({
    color: 0xffb6b5,
    wireframe: true
});

loader.load(
    // resource URL
    'laser.obj',
    // called when resource is loaded
    function ( object ) {
        let laserGeometry = object.children[0].geometry;
        COMMON.laserMesh = new THREE.Mesh(laserGeometry, laserMaterial);
    },

    // when loading
    function ( loaded ) {},
    
    // called when loading has errors
    function ( error ) {

        console.log( error );

    }
);

let laserGeometry = new THREE.Geometry();
laserGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
laserGeometry.vertices.push( new THREE.Vector3( 0, 0, 1 ) );

COMMON.laserMesh = new THREE.Line( laserGeometry, laserMaterial );

function shootLaser() {
    let laser = new polyLaser(groupNaves.children[0], STATE.radius * 50, 1.9);
    laser.addToScene( scene );
    groupLasers.add( laser );
}



// TIRITO
let tiritoGeometry = new THREE.SphereBufferGeometry(1, 5, 5);
let tiritoMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xffffff
});

COMMON.tiritoMesh = new THREE.Mesh( tiritoGeometry, tiritoMaterial );

// Shoots from the vector -from- towards the center
COMMON.shootTirito = function( stage, from ) {
    let vel = from.clone();
    vel.normalize().multiplyScalar(-STATE.radius * 0.5);
    let tirito = new Tirito(stage, from, STATE.radius * 0.1, vel);
    tirito.addToScene( stage.scene );
    stage.groupTiritos.add(tirito);
    STATE.polybiusAudio.shoot(stage.STATE.acidAmp || 0);
};


// MISIL

let misilGeometry = new THREE.CylinderBufferGeometry(0.2, 0.4, 1, 6, 1);
let misilMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xffffff
});

let fireGeom = new THREE.ConeBufferGeometry( 0.2, 0.6, 6 );

let lightFireMat = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xfffc84
});

let darkFireMat = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xff6147
});

let lightFire = new THREE.Mesh(fireGeom, lightFireMat);
let darkFire = new THREE.Mesh(fireGeom, darkFireMat);
lightFire.position.y -= 1;
darkFire.position.y -= 1;
lightFire.rotateX(Math.PI);
darkFire.rotateX(Math.PI);

COMMON.misilMesh = new THREE.Mesh( misilGeometry, misilMaterial );
COMMON.misilMesh.add(lightFire);
COMMON.misilMesh.add(darkFire);

// Shoots a misil from -from- following -to-
COMMON.shootMisil = function( stage, from, to )
{
    let randomDir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    let misil = new CenterMisil(stage, to, from, STATE.radius * 0.5, STATE.radius * 9, Math.PI * 0.9, randomDir);
    misil.addToScene( stage.scene );
    stage.groupMisiles.add(misil);
    //TODO: AUDIO
};

// Shoots a misil from the center Following nave
COMMON.shootMisilFromCenter = function( stage )
{
    COMMON.shootMisil( stage, new THREE.Vector3(0, 0, 0), stage.groupNaves.children[0] );
};


// Stars
COMMON.createStars = function(scene) {
    var i, r = STATE.radius, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
    for ( i = 0; i < 250; i ++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );
        starsGeometry[ 0 ].vertices.push( vertex );
    }
    for ( i = 0; i < 1500; i ++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );
        starsGeometry[ 1 ].vertices.push( vertex );
    }
    var stars;
    var starsMaterials = [
        new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
    ];

    for ( i = 10; i < 30; i ++ ) {
        stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;
        stars.scale.setScalar( i * 10 );
        stars.matrixAutoUpdate = false;
        stars.updateMatrix();
        scene.add( stars );
    }
};

// CENTER

COMMON.centerMesh;
COMMON.loadObject('lavaPlanet.obj', 'lavaPlanet.mtl').then(function(obj) {
    COMMON.centerMesh = obj.clone();
});

// CENTER ASTEROIDS

let centerAsteroidGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
let centerAsteroidMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});

COMMON.centerAsteroidMesh = new THREE.Mesh( centerAsteroidGeometry, centerAsteroidMaterial );


// ASTEROIDS
COMMON.asteroidMesh;
COMMON.loadObject('blackAsteroid.obj', 'blackAsteroid.mtl').then(function(obj) {
    COMMON.asteroidMesh = obj.clone();
});

// Creates asteroid at position -pos-
COMMON.createAsteroidAt = function( stage, pos, radvv, angvv ) {
    let rv = radvv === undefined ? 0.8 : radvv;
    let av = angvv === undefined ? 1 : angvv;
    let asteroid = new Asteroid( stage, pos, STATE.radius/2, rv, av);
    asteroid.addToScene( stage.scene );
    stage.groupAsteroids.add(asteroid);
};

// Creates a random asteroid
COMMON.createRandomAsteroid = function( stage ) {
    let pos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    pos.normalize().multiplyScalar( STATE.radius );
    COMMON.createAsteroidAt( stage, pos );
};

// Creates an asteroid barrier
COMMON.createAsteroidBarrier = function( stage ) {
    let sph = new THREE.SphereGeometry(STATE.radius, 16, 8);
    for(let i = 0; i < sph.vertices.length; i++)
    {
        COMMON.createAsteroidAt( stage, sph.vertices[i], 1.2, 0 );
    }
};


// EXPLOSION

COMMON.fragmentGeometry = [ new THREE.TetrahedronBufferGeometry( 1, 0 ),
    new THREE.TetrahedronBufferGeometry( 1, 1 )
];

COMMON.fragmentMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe075,
    wireframe: true
});


// Creates an explosion of size -size- at -pos- with -frags- fragments
COMMON.createExplosion = function( stage, pos, size, frags, speed ) {
    for(let i = 0; i < frags; i++) {
        let sp = speed === undefined ? 1 : speed;
        let vx = Math.random() - 0.5;
        let vy = Math.random() - 0.5;
        let vz = Math.random() - 0.5;
        let dir = new THREE.Vector3(vx, vy, vz);
        dir.normalize();
        dir.multiplyScalar(STATE.radius * THREE.Math.randFloat(1, 1.5));
        dir.multiplyScalar(sp);

        let nFrag = new ExplosionFragment( stage, pos, size * THREE.Math.randFloat(0.5, 1), dir );
        nFrag.addToScene( stage.scene );
        stage.groupExplosions.add( nFrag );
    }
};


// CHECKPOINT
let checkpointGeometry = new THREE.SphereBufferGeometry(1, 10, 10);
let checkpointMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x3ef730
});
COMMON.checkpointMesh = new THREE.Mesh( checkpointGeometry, checkpointMaterial );

COMMON.createCheckpoint = function( stage, pos, size, picked ) {
    COMMON.createExplosion( stage, pos, size, 6, 2 );

    let checkpoint = new Checkpoint( stage, pos, size, picked );
    checkpoint.addToScene( stage.scene );
    stage.groupCheckpoints.add( checkpoint );
}


// HITBOX DEBUG
// If debug is true, spherical hitboxes are added as blue wireframe meshes.
COMMON.debug = false;

let hitboxMaterial = new THREE.MeshBasicMaterial({
  color: 0x003ea3,
  wireframe: true
});

let hitboxGeometry = new THREE.SphereBufferGeometry(1, 12, 8);

COMMON.hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);


COMMON.changeToStage = function( which ) {
    $("#gui-style").remove();
    $("#gui-container").load("/polybius3d/js/polybiusModules/stages/GUIs/" + which + ".html", () => {
        $("head").append($("<link id='gui-style' rel='stylesheet' href='/polybius3d/js/polybiusModules/stages/GUIs/" + which + ".css' type='text/css' media='screen' />"));

        STATE.currentStage = which;
        STAGE.stages[STATE.currentStage].init();
    });
}

/////////////////////////////////////
//////////////// CSS ////////////////
/////////////////////////////////////

// When all objects load, update some css and call init() which starts each page three scene.
function endLoading() {
    setTimeout( () => {
        stopLoading();
        COMMON.hideElement("loading-container", 0, init);
    }, 1000 );
}

COMMON.showElement = function(id, delay, callback) {
    $("#" + id).fadeIn(delay, callback);
}

COMMON.hideElement = function(id, delay, callback) {
    $("#" + id).fadeOut(delay, callback);
}
