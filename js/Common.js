// Shoots from the vector -from- towards the center
function shootTirito(from) {
	let vel = from.clone();
	vel.normalize().multiplyScalar(-radius * 0.5);
	let tirito = new Tirito(from, radius * 0.1, vel);
	tirito.addToScene(scene);
	groupTiritos.add(tirito);
	polybiusAudio.shoot();
}


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
