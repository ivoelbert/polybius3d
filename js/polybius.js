if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var radius = 6371;
var tilt = 0.41;
var cloudsScale = 1.005;

var MARGIN = 0;
var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
var SCREEN_WIDTH  = window.innerWidth;

var container, stats;
var camera, controls, scene, renderer;
var dirLight, pointLight, ambientLight;

var composer;
var textureLoader = new THREE.TextureLoader();
var clock = new THREE.Clock();
var createAsteroidAvailable = false;

// grupos
var groupObjects = new THREE.Group();
var groupNaves = new THREE.Group(); groupObjects.add(groupNaves);
var groupCenters = new THREE.Group(); groupObjects.add(groupCenters);
var groupAsteroids = new THREE.Group(); groupObjects.add(groupAsteroids);
var groupTiritos = new THREE.Group(); groupObjects.add(groupTiritos);

var collider;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// escena
	scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );

  let navepos = new THREE.Vector3(0, 0, radius * 5);
	let nave = new Nave( navepos, radius );
		nave.addToScene( scene );
		groupNaves.add(nave);

	// camara
	camera = new FollowCamera( groupNaves.children[0] );
	let off = new THREE.Vector3(0, radius, -2 * radius);
		camera.init(80, off, 0.2, radius * 5);



	/*Listener de audio*/
    var audio_listener = new THREE.AudioListener();
    camera.getCam().add( audio_listener );


    /*sonido ambiente*/
    var audioLoader = new THREE.AudioLoader();
  	var sound_base = new THREE.Audio( audio_listener );
  	audioLoader.load( 'sounds/base_editada_3.mp3', function( buffer ) {
	    sound_base.setBuffer( buffer );
	    sound_base.setLoop(true);
	    sound_base.setVolume(.4);
	    sound_base.play();
	});


	// controles
	controls = new THREE.FlyControls( groupNaves.children[0] );
		controls.domElement = container;
    controls.rad = 10 * radius;
    controls.minRad = 2 * radius;
    controls.maxRad = 12 * radius;
  	controls.radSpeed = radius / 5;
    controls.angSpeed = 0.03;
    controls.rotation = 0.0;
    controls.rotSpeed = 0.03;

  // luz (al pedo, el material wireframe no la calcula)
	ambientLight = new THREE.AmbientLight( 0xffffff );
		scene.add( ambientLight );

	// centro
	let center = new Center(scene, radius, 6);
		center.init();

  let asteroid = new Asteroid(new THREE.Vector3( 4 * radius, 0, 0 ), radius, 30, 1);
		asteroid.addToScene( scene );
		groupAsteroids.add(asteroid);

  /*   audio del asteroide    TODO: llevar al asteroide...
    var audioLoader = new THREE.AudioLoader();
    var sound = new THREE.PositionalAudio( audio_listener );
    audioLoader.load( 'sounds/asteroide.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setRefDistance( 20 );
        sound.setVolume(.5);
        sound.setLoop(true);
      //  sound.play();

    });

    asteroid.mesh.add( sound );
	*/

	groupObjects.add(groupAsteroids);
	groupObjects.add(groupNaves);

	collider = new Collider();
	collider.addRegla(groupNaves, groupAsteroids);
	collider.addRegla(groupAsteroids, groupTiritos);
	collider.addRegla(groupTiritos, groupCenters);

	////////////////////////////////////// lo que estaba //////////////////////////////////////

	// stars
	var i, r = radius, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
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

	// renderer
	renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		renderer.sortObjects = false;
		container.appendChild( renderer.domElement );

	// estadistica (fps, etc)
	stats = new Stats();
		container.appendChild( stats.dom );

	window.addEventListener( 'resize', onWindowResize, false );

	// postprocessing
	var renderModel = new THREE.RenderPass( scene, camera.getCam() );
	var effectFilm = new THREE.FilmPass( 0.35, 0.75, 2048, false );
	effectFilm.renderToScreen = true;
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( renderModel );
	composer.addPass( effectFilm );
}

function onWindowResize( event ) {
	SCREEN_HEIGHT = window.innerHeight;
	SCREEN_WIDTH  = window.innerWidth;
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	camera.setAspect( SCREEN_WIDTH / SCREEN_HEIGHT );
	camera.updateProy();
	composer.reset();
}


function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}

function render() {
	var delta = clock.getDelta();

	handleUpdates( delta );
	collider.checkCollisions();

	composer.render( delta );
}

// Maneja las updates de todo lo necesario.
function handleUpdates( delta ) {


	let centers = groupCenters.children;
	for(let i = 0; i < centers.length; i++) {
		centers[i].update( delta );
	}

	let asteroids = groupAsteroids.children;
	for(let i = 0; i < asteroids.length; i++) {
		asteroids[i].update( delta );
	}

	let tiritos = groupTiritos.children;
	for(let i = 0; i < tiritos.length; i++) {
		tiritos[i].update( delta );
	}

	controls.update( delta );
	camera.update( delta );

	// Crea meteoritos si es necesario.
	if(clock.elapsedTime % 5 < 1 && createAsteroidAvailable) {
		createAsteroidAvailable = false;

		let pos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
		pos.normalize().multiplyScalar(2 * radius);
		let asteroid = new Asteroid(pos, radius, 30, 1);
			asteroid.addToScene( scene );
			groupAsteroids.add(asteroid);

	}
	if(clock.elapsedTime % 5 > 1) {
		createAsteroidAvailable = true;
	}
}

function shootTirito(from) {
	let vel = from.clone();
	vel.normalize().multiplyScalar(-radius * 0.5);
	let tirito = new Tirito(from, radius * 0.1, vel);
	tirito.addToScene(scene);
	groupTiritos.add(tirito);
}

function removeFromScene(object) {
	object.parent.remove(object);
	scene.remove(object.mesh);
}
