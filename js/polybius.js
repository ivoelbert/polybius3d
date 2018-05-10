if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

function init() {
	STATE.container = document.createElement( 'div' );
	document.body.appendChild( STATE.container );

	// renderer
	STATE.renderer = new THREE.WebGLRenderer();
	STATE.renderer.setPixelRatio( window.devicePixelRatio );
	STATE.renderer.setSize( STATE.SCREEN_WIDTH, STATE.SCREEN_HEIGHT );
	STATE.renderer.sortObjects = false;
	STATE.container.appendChild( STATE.renderer.domElement );

	// estadistica (fps, etc)
	STATE.stats = new Stats();
	STATE.container.appendChild( STATE.stats.dom );

  STATE.currentStage = 0;
  STATE.nextStage = 0;

	window.addEventListener( 'resize', onWindowResize, false );

  STAGE.createStages();
  STAGE.stages[STATE.currentStage].init();

  animate();
}

function onWindowResize( event ) {
	STATE.SCREEN_HEIGHT = window.innerHeight;
	STATE.SCREEN_WIDTH  = window.innerWidth;
	STATE.renderer.setSize( STATE.SCREEN_WIDTH, STATE.SCREEN_HEIGHT );

  STAGE.stages[STATE.currentStage].resetSize( STATE.SCREEN_WIDTH / STATE.SCREEN_HEIGHT );
  STAGE.stages[STATE.nextStage].resetSize( STATE.SCREEN_WIDTH / STATE.SCREEN_HEIGHT );
}


function animate() {
	requestAnimationFrame( animate );

	var delta = STATE.clock.getDelta();
  STAGE.stages[STATE.currentStage].update( delta );

	STATE.stats.update();
}
