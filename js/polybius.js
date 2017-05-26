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

var nave;
var center, asteroid;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );


	// escena
	scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );

	nave = new Nave( scene );
		let pos = new THREE.Vector3(0, 0, radius * 5);
		nave.init(pos, radius);

	// camara
	camera = new FollowCamera( nave );
	camera.init(50, -radius * 3, radius * 0.75);

	// controles
	controls = new THREE.FlyControls( nave );
		controls.domElement = container;
        controls.rad = 10 * radius;
        controls.minRad = 2 * radius;
        controls.maxRad = 10 * radius;
      	controls.radSpeed = radius / 5;
        controls.angSpeed = 0.03;
        controls.rotation = 0.0;
        controls.rotSpeed = 0.03;

    // luz (al pedo, el material wireframe no la calcula)
	ambientLight = new THREE.AmbientLight( 0xffffff );
		scene.add( ambientLight );

	// centro
	center = new Center(scene, radius, 6);
		center.init();

	// Asteroide
	asteroid = new Asteroid(scene, radius);
		asteroid.init(new THREE.Vector3( 2 * radius, 0, 0 ), 30, 1);


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
	center.update( delta );
	asteroid.update( delta );
	controls.update( delta );
	camera.update( delta );
	composer.render( delta );
}
