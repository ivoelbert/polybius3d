if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var renderer;

var imgX = 1600;
var imgY = 1013;

var MARGIN = 0;
var SCREEN_HEIGHT = (window.innerHeight - MARGIN * 2) * 0.66;
var SCREEN_WIDTH  = window.innerWidth;
var clock = new THREE.Clock();

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( -imgX / 2, imgX / 2, SCREEN_HEIGHT / 2, -SCREEN_HEIGHT / 2, 0, 1 );

var RGBComposer, RGBPass;

var loader = new THREE.TextureLoader();
var plane;

var mouseX = 0;
var mouseY = 0;

function loadStuff() {
  loader.load(
  	// resource URL
  	'img/jul.jpg',

  	// onLoad callback
  	function ( texture ) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;


  		// in this example we create the material when the texture is loaded
  		let material = new THREE.MeshBasicMaterial( { map: texture } );
      let geom = new THREE.PlaneGeometry( imgX, imgY );
      plane = new THREE.Mesh(geom, material);
      plane.frustumCulled = false;

      scene.add(plane);

      init();
  	},

  	function ( err ) {
  		console.error( 'An error happened.' );
  	}
  );
}

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.sortObjects = false;
	container.appendChild( renderer.domElement );


  ///////////////////////////// POSTPROCESSING /////////////////////////////////

  RGBComposer = new THREE.EffectComposer( renderer );
	RGBComposer.addPass( new THREE.RenderPass( scene, camera ) );

	RGBPass = new THREE.ShaderPass( THREE.JulShader );
	RGBPass.renderToScreen = true;
	RGBComposer.addPass( RGBPass );

  RGBPass.uniforms[ 'time' ].value = 0;
  //////////////////////////////////////////////////////////////////////////////


	window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener('mousemove', onDocumentMouseMove, false);

  animate();
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize( event ) {
  let oldScrW = SCREEN_WIDTH;
	SCREEN_HEIGHT = (window.innerHeight - MARGIN * 2) * 0.66;
	SCREEN_WIDTH  = window.innerWidth;

  let oldX = imgX;
  imgX = SCREEN_WIDTH * imgX / oldScrW;
  imgY = imgX * imgY / oldX;
  if(imgY < SCREEN_HEIGHT) {
    SCREEN_HEIGHT = imgY;
    let oldY = imgY;
    imgY = SCREEN_HEIGHT;
    imgX = imgY * imgX / oldY;
  }

  plane.geometry = new THREE.PlaneGeometry( imgX, imgY );
  plane.geometry.verticesNeedUpdate = true;
  plane.geometry.elementsNeedUpdate = true;
  plane.geometry.morphTargetsNeedUpdate = true;
  plane.geometry.uvsNeedUpdate = true;
  plane.geometry.normalsNeedUpdate = true;
  plane.geometry.colorsNeedUpdate = true;
  plane.geometry.tangentsNeedUpdate = true;


  camera.left = -imgX / 2;
  camera.right = imgX / 2;
  camera.top = SCREEN_HEIGHT / 2;
  camera.bottom = -SCREEN_HEIGHT / 2;
  camera.updateProjectionMatrix();

  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

  RGBComposer.reset();
}


function animate() {
	requestAnimationFrame( animate );
	var delta = clock.getDelta();
  RGBPass.uniforms[ 'mouseX' ].value = THREE.Math.mapLinear(mouseX, -1, 1, 0, 1);

  RGBComposer.render( delta );
  //renderer.render(scene, camera);
}

loadStuff();
