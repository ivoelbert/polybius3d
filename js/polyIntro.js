if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var radius = 6371;

var MARGIN = 0;
var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
var SCREEN_WIDTH  = window.innerWidth;

var container, stats;
var camera, controls, scene, renderer;
var dirLight, pointLight, ambientLight;

var textureLoader = new THREE.TextureLoader();
var clock = new THREE.Clock();
var createAsteroidAvailable = false;

// post
var glitchComposer;
var glitchPass;
var glitchEllapsed = 0;
var renderGlitch = false;
var acidEllapsed = 0;
var renderAcid = false;

var RGBComposer;
var RGBPass;
var renderRGB = true;

// grupos
var groupObjects = new THREE.Group();
var groupCenters = new THREE.Group(); groupObjects.add(groupCenters);
var groupCenterAsteroids = new THREE.Group(); groupObjects.add(groupCenterAsteroids);
var groupAsteroids = new THREE.Group(); groupObjects.add(groupAsteroids);

//audio
var polybiusAudio;

init();
animate();

function init() {
	noise.seed(Math.random());

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// escena
	scene = new THREE.Scene();
	 scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );

	// camara
	camera = new THREE.PerspectiveCamera( 80, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7 );
  camera.position.z = 10*radius;

	/*Audio*/
  polybiusAudio = new PolybiusAudio();
	  polybiusAudio.init(true, true, true, 'sounds/base_editada_3.mp3')// ambStatus, astStatus , shootStatus , ambSrc, astSrc,shootSrc
    camera.add( polybiusAudio.getListener() );

	// centro
  let center = new Center(new THREE.Vector3(0, 0, 0), radius);
		center.addToScene( scene );
    groupCenters.add(center);
    center.addShieldToGroup( groupCenters );
    groupCenterAsteroids = center.getAsteroidsGroup();

  let asteroid = new Asteroid(new THREE.Vector3( 6 * radius, 0, 0 ), radius, 0, 1);
  	asteroid.addToScene( scene );
    asteroid.radToLive = Infinity;
    asteroid.timeToLive = Infinity;
  	groupAsteroids.add(asteroid);

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

	window.addEventListener( 'resize', onWindowResize, false );

	////////////////////// POSTPROCESSING ////////////////////////

	// Glitch pass
	glitchComposer = new THREE.EffectComposer( renderer );
	glitchComposer.addPass( new THREE.RenderPass( scene, camera ) );

	glitchPass = new THREE.GlitchPass();
	glitchPass.goWild = true;
	glitchPass.renderToScreen = true;
	glitchComposer.addPass( glitchPass );

	// RGB pass
	RGBComposer = new THREE.EffectComposer( renderer );
	RGBComposer.addPass( new THREE.RenderPass( scene, camera ) );

	RGBPass = new THREE.ShaderPass( THREE.RGBShiftShader );
	RGBPass.renderToScreen = true;
	RGBComposer.addPass( RGBPass );

  RGBPass.uniforms[ 'time' ].value = 0;
  RGBPass.uniforms[ 'waveAmp' ].value = 0;
  RGBPass.uniforms[ 'waveFreq' ].value = 10 * 3.14;
  RGBPass.uniforms[ 'colorOff' ].value = 0;
  RGBPass.uniforms[ 'colorFreq' ].value = 50;

}

function onWindowResize( event ) {
	SCREEN_HEIGHT = window.innerHeight;
	SCREEN_WIDTH  = window.innerWidth;
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();
	glitchComposer.reset();
	RGBComposer.reset();
}


function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	var delta = clock.getDelta();

	handleUpdates( delta );

	chooseRenderer();
}

function chooseRenderer( delta ) {
	if(renderGlitch)
		glitchComposer.render( delta );
	else
		RGBComposer.render( delta );
		//renderer.render( scene, camera.getCam() );
}

// Maneja las updates de todo lo necesario.
function handleUpdates( delta ) {

	// object updates
	let centers = groupCenters.children;
	for(let i = 0; i < centers.length; i++) {
		centers[i].update( delta );
	}

	let asteroids = groupAsteroids.children;
	for(let i = 0; i < asteroids.length; i++) {
		asteroids[i].update( delta );
	}

}
