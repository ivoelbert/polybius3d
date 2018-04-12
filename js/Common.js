
var COMMON = {};


// Removes an object from the scene (and from its group)
function removeFromScene(object) {
	object.parent.remove(object);
	scene.remove(object.mesh);
}

// Initalizes glitch shader
function initGlitch() {
	renderGlitch = true;
}

// initializes acid shader
function initAcid() {
  if(renderAcid == true)
    acidEllapsed = 5;
  renderAcid = true;
}



// TIRITO
let tiritoGeometry = new THREE.SphereGeometry(1, 5, 5);
let tiritoMaterial = new THREE.MeshBasicMaterial({
	 wireframe: true,
	 color: 0xffffff
});
COMMON.tiritoMesh = new THREE.Mesh( tiritoGeometry, tiritoMaterial );

// Shoots from the vector -from- towards the center
function shootTirito(from) {
	let vel = from.clone();
	vel.normalize().multiplyScalar(-radius * 0.5);
	let tirito = new Tirito(from, radius * 0.1, vel);
	tirito.addToScene(scene);
	groupTiritos.add(tirito);
	polybiusAudio.shoot();
}


// MISIL
let misilGeometry = new THREE.CylinderGeometry(0.2, 0.4, 1, 6, 1);
let misilMaterial = new THREE.MeshBasicMaterial({
	 wireframe: true,
	 color: 0xffffff
});

let fireGeom = new THREE.ConeGeometry( 0.2, 0.6, 6 );

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
function shootMisil( from, to )
{
	let randomDir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
	let misil = new CenterMisil(to, from, radius * 0.5, radius * 9, Math.PI * 0.9, randomDir);
	misil.addToScene(scene);
	groupMisiles.add(misil);
	//TODO: AUDIO
}

// Shoots a misil from the center Following nave
function shootMisilFromCenter()
{
	shootMisil(new THREE.Vector3(0, 0, 0), groupNaves.children[0]);
}


// CENTER ASTEROIDS
let centerAsteroidGeometry = new THREE.BoxGeometry( 1, 1, 1 );
let centerAsteroidMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	wireframe: true
});

COMMON.centerAsteroidMesh = new THREE.Mesh( centerAsteroidGeometry, centerAsteroidMaterial );


// ASTEROIDS
COMMON.asteroidGeometry = [ new THREE.SphereGeometry(1, 10, 10),
                            new THREE.SphereGeometry(1, 6, 6),
                            new THREE.SphereGeometry(1, 3, 3)
                          ];
COMMON.asteroidMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  wireframe: true
});

// Creates asteroid at position -pos-
function createAsteroidAt( pos, radvv, angvv ) {
  let rv = radvv === undefined ? 0.8 : radvv;
  let av = angvv === undefined ? 1 : angvv;
	let asteroid = new Asteroid(pos, radius/2, rv, av);
		asteroid.addToScene( scene );
		groupAsteroids.add(asteroid);
}

// Creates a random asteroid
function createRandomAsteroid() {
	let pos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
	pos.normalize().multiplyScalar( radius );
	createAsteroidAt( pos );
}



// ACID PILL
let pillGeometry = new THREE.CylinderGeometry(0.333, 0.333, 1, 12);

let pillMaterial = new THREE.MeshBasicMaterial({
  color: 0x22ff22,
  wireframe: true
});

COMMON.pillMesh = new THREE.Mesh( pillGeometry, pillMaterial );

// Creates acid pill at position -pos-
function createAcidPillAt( pos ) {
	let acidPill = new AcidPill(pos, radius/2, 1, 1);
		acidPill.addToScene( scene );
		groupPills.add(acidPill);
}

// Creates a random acid pill
function createRandomAcidPill() {
  let pos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
	pos.normalize().multiplyScalar( radius );
	createAcidPillAt( pos );
}




// EXPLOSION
COMMON.fragmentGeometry = [ new THREE.TetrahedronGeometry( 1, 0 ),
                            new THREE.TetrahedronGeometry( 1, 1 )
                          ];

COMMON.fragmentMaterial = new THREE.MeshBasicMaterial({
  color: 0xffe075,
  wireframe: true
});


// Creates an explosion of size -size- at -pos- with -frags- fragments
function createExplosion( pos, size, frags, speed ) {
  for(let i = 0; i < frags; i++) {

    let sp = speed === undefined ? 1 : speed;
    let vx = Math.random() - 0.5;
    let vy = Math.random() - 0.5;
    let vz = Math.random() - 0.5;
    let dir = new THREE.Vector3(vx, vy, vz);
    dir.normalize();
    dir.multiplyScalar(radius * THREE.Math.randFloat(1, 1.5));
    dir.multiplyScalar(sp);

    let nFrag = new ExplosionFragment(pos, size * THREE.Math.randFloat(0.5, 1), dir);
    nFrag.addToScene( scene );
    groupExplosions.add( nFrag );
  }
}

function createAsteroidBarrier() {
  let sph = new THREE.SphereGeometry(radius, 16, 8);
  for(let i = 0; i < sph.vertices.length; i++)
  {
    createAsteroidAt(sph.vertices[i], 1.2, 0);
  }
}