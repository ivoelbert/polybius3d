
var COMMON = {};

// Loader para .obj
var loader = new THREE.OBJLoader();

// Removes an object from the scene (and from its group)
function removeFromScene(object) {
	object.parent.remove(object);
	scene.remove(object.mesh);
	if(COMMON.debug)
		scene.remove(object.hitbox.mesh);
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

function easeInOut(t) {
	return t<.5 ? 2*t*t : -1+(4-2*t)*t
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

let pillMaterial = new THREE.MeshBasicMaterial({
  color: 0x22ff22,
  wireframe: true
});

COMMON.pillMesh;

loader.load(
	// resource URL
	'models/acidpill.obj',

	// called when resource is loaded
	function ( object ) {
		let pillGeometry = object.children[0].geometry;
		COMMON.pillMesh = new THREE.Mesh(pillGeometry, pillMaterial);

		loadNaves();
	},

	// called when loading is in progresses
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},

	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);

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


// NAVES

COMMON.naveMesh = [];

COMMON.selectedMesh;

let loadedPercent = 0;

let naveMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true
});



function loadNaves() {
	let navesToLoad = [
											"polyNave6wire.obj",
											"starWars.obj",
											"ApoloWireframeFix.obj",
											"naveChala180origSize.obj",
											"fetusLow6666.obj"
										];

	let naves = navesToLoad.length;

	let loadedNaves = 0;

	let loadNextNave = function() {
		if(loadedNaves >= naves)
		{
			endLoading();
		}
		else
		{
			loader.load(
				// resource URL
				'models/' + navesToLoad[loadedNaves],
				// called when resource is loaded
				function ( object ) {
					let naveGeometry = object.children[0].geometry;
					COMMON.naveMesh[loadedNaves] = new THREE.Mesh(naveGeometry, naveMaterial);

					loadedNaves++;
					loadNextNave();
				},

				// called when loading is in progresses
				function ( xhr ) {
					loadedPercent = (loadedNaves + 1) * (100 / naves) + (( xhr.loaded / xhr.total * 100 ) / naves);
					loadTo(loadedPercent);
				},

				// called when loading has errors
				function ( error ) {
					console.log( error );
				}
			);
		}
	};

	loadNextNave();
}


function getScale(nave)
{
	switch(nave)
	{
		// DEFAULT
		case 0:
		return 1;
		break;

		// STARWARS
		case 1:
		return 10;
		break;

		// APOLO
		case 2:
		return 3;
		break;

		// CHALA
		case 3:
		return 2;
		break;

		// FETUS
		case 4:
		return 2;
		break;

	}
}

function getHitboxScale(nave)
{
	switch(nave)
	{
		// DEFAULT
		case 0:
		return 4;
		break;

		// STARWARS
		case 1:
		return 4;
		break;

		// APOLO
		case 2:
		return 7;
		break;

		// CHALA
		case 3:
		return 4;
		break;

		// FETUS
		case 4:
		return 4;
		break;
	}
}




// POWER UP
COMMON.powerUpMesh;

loader.load(
	// resource URL
	'models/powerUp.obj',
	// called when resource is loaded
	function ( object ) {
		COMMON.powerUpMesh = object;
	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

function createPowerUp(pos, sz) {
	let powerup = new powerUp(pos, sz);
	powerup.addToScene( scene );
	groupPowerUps.add( powerup );
}


// HITBOX DEBUG

COMMON.debug = false;

let hitboxMaterial = new THREE.MeshBasicMaterial({
  color: 0x003ea3,
  wireframe: true
});

let hitboxGeometry = new THREE.SphereGeometry(1, 12, 8);

COMMON.hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);




/////////////////////////////////////
//////////////// CSS ////////////////
/////////////////////////////////////

// SHOW HEALTH
function showHealth() {
	document.getElementById("health-bar").style["animation-name"] = "show-health";
	document.getElementById("health-bar").style["animation-duration"] = "1s";
}

// LOADING BAR
function loadTo(percent) {
	document.getElementById("loaded").style.width = percent + "%";
}


function endLoading() {
	setTimeout( () => {
		document.getElementById("loading-container").style.display = "none";
		document.getElementById("info").style["animation-name"] = "fade-in";
		document.getElementById("info").style["animation-duration"] = "1.5s";
		document.getElementById("info").style["animation-delay"] = "0.5s";

		init();
		showHealth();
	}, 1000 );
}
