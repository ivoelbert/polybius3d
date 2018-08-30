let stageLevel1 = new polyStage();

////////////////////////////////////////////////////////////////////////////////
//   INIT                                                                     //
////////////////////////////////////////////////////////////////////////////////
stageLevel1.init = function() {
  // State
  stageLevel1.STATE = {};
  stageLevel1.STATE.createAsteroidAvailable = false;
  stageLevel1.STATE.createMisilAvailable = false;
  stageLevel1.STATE.glitchEllapsed = 0;
  stageLevel1.STATE.renderGlitch = false;
  stageLevel1.STATE.acidEllapsed = 0;
  stageLevel1.STATE.acidAmp = 0;
  stageLevel1.STATE.renderAcid = false;
  stageLevel1.STATE.time = 0;

  // Scene
  stageLevel1.scene = new THREE.Scene();
  stageLevel1.scene.fog = new THREE.FogExp2( 0x000000, 0.000025 );

  var light = new THREE.AmbientLight( 0xffffff );
  stageLevel1.scene.add( light );

  var dirLight1 = new THREE.DirectionalLight( 0xffffff, 1 );
  stageLevel1.scene.add( dirLight1 );
  dirLight1.position.set( STATE.radius, STATE.radius, STATE.radius );

  var dirLight2 = new THREE.DirectionalLight( 0xffffff, 1 );
  stageLevel1.scene.add( dirLight2 );
  dirLight2.position.set( -STATE.radius, -STATE.radius, -STATE.radius );

  // Set up collider
  COLLIDER.resetReglas();
  COLLIDER.addRegla(stageLevel1.groupNaves, stageLevel1.groupAsteroids);
  COLLIDER.addRegla(stageLevel1.groupAsteroids, stageLevel1.groupTiritos);
  COLLIDER.addRegla(stageLevel1.groupTiritos, stageLevel1.groupCenters);
  COLLIDER.addRegla(stageLevel1.groupTiritos, stageLevel1.groupCenterAsteroids);
  COLLIDER.addRegla(stageLevel1.groupNaves, stageLevel1.groupPills);
  COLLIDER.addRegla(stageLevel1.groupNaves, stageLevel1.groupMisiles);
  COLLIDER.addRegla(stageLevel1.groupAsteroids, stageLevel1.groupMisiles);
  COLLIDER.addRegla(stageLevel1.groupTiritos, stageLevel1.groupMisiles);
  COLLIDER.addRegla(stageLevel1.groupNaves, stageLevel1.groupPowerUps);

  // Stars
  COMMON.createStars( stageLevel1.scene );

  // Nave
  let navepos = new THREE.Vector3(0, 0, STATE.radius * 5);
  let nave = new Nave( stageLevel1, navepos, STATE.radius * 0.09 );
  nave.addToScene( stageLevel1.scene );
  stageLevel1.groupNaves.add( nave );

  // Camera
  stageLevel1.camera = new FollowCamera( stageLevel1.groupNaves.children[0] );
  let off = new THREE.Vector3(0, STATE.radius, -2 * STATE.radius);
  stageLevel1.camera.init(80, off, 0.4, STATE.radius * 5);
  stageLevel1.camera.getCam().add( STATE.polybiusAudio.getListener() );

  // Centro
  let center = new Center( stageLevel1, new THREE.Vector3(0, 0, 0), STATE.radius);
  center.addToScene( stageLevel1.scene );
  stageLevel1.groupCenters.add(center);
  center.addShieldToGroup( stageLevel1.groupCenters );
  stageLevel1.groupCenterAsteroids = center.getAsteroidsGroup();

  ///////////////////////////// POSTPROCESSING /////////////////////////////////
  // Glitch composer
  stageLevel1.glitchComposer = new THREE.EffectComposer( STATE.renderer );
  stageLevel1.glitchComposer.addPass( new THREE.RenderPass( stageLevel1.scene, stageLevel1.camera.getCam() ) );

  let glitchPass = new THREE.GlitchPass();
  glitchPass.goWild = true;
  glitchPass.renderToScreen = true;
  stageLevel1.glitchComposer.addPass( glitchPass );

  // RGB pass
  stageLevel1.RGBComposer = new THREE.EffectComposer( STATE.renderer );
  stageLevel1.RGBComposer.addPass( new THREE.RenderPass( stageLevel1.scene, stageLevel1.camera.getCam() ) );

  stageLevel1.RGBPass = new THREE.ShaderPass( THREE.RGBShiftShader );
  stageLevel1.RGBPass.renderToScreen = true;
  stageLevel1.RGBComposer.addPass( stageLevel1.RGBPass );

  stageLevel1.STATE.acidAmp = 0;
  stageLevel1.RGBPass.uniforms[ 'time' ].value = 0;
  stageLevel1.RGBPass.uniforms[ 'waveAmp' ].value = stageLevel1.STATE.acidAmp;
  stageLevel1.RGBPass.uniforms[ 'waveFreq' ].value = 10 * 3.14;
  stageLevel1.RGBPass.uniforms[ 'colorOff' ].value = 0;
  stageLevel1.RGBPass.uniforms[ 'colorFreq' ].value = 50;
  //////////////////////////////////////////////////////////////////////////////

  stageLevel1.resetSize = function( arg ) {
    stageLevel1.camera.setAspect( arg );
    stageLevel1.camera.updateProy();

    stageLevel1.glitchComposer.reset();
    stageLevel1.RGBComposer.reset();
  }

  COMMON.createAsteroidAt( stageLevel1, new THREE.Vector3( STATE.radius, 0, 0 ) );
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//   UPDATE                                                                   //
////////////////////////////////////////////////////////////////////////////////
stageLevel1.update = function( delta ) {
  // Update local time
  stageLevel1.STATE.time += delta;

  // Update every group
	stageLevel1.moveThings( delta );
  stageLevel1.camera.update( delta );

	// Update composers
	stageLevel1.updateGlitchComposer( delta );
  stageLevel1.updateRGBComposer( delta );

  // Do we need to create any object?
	stageLevel1.handleNewObjects();

  // Check if things collide
  COLLIDER.checkCollisions();

  // Finally render to screen
	stageLevel1.chooseRenderer( delta );
}
////////////////////////////////////////////////////////////////////////////////


stageLevel1.updateGlitchComposer = function( delta ) {
  if(stageLevel1.STATE.renderGlitch) {
		stageLevel1.STATE.glitchEllapsed += delta;
	}
	if(stageLevel1.STATE.glitchEllapsed > 0.8) {
		stageLevel1.STATE.renderGlitch = false;
		stageLevel1.STATE.glitchEllapsed = 0;
	}
}

stageLevel1.updateRGBComposer = function( delta ) {
  let speed = 0.1;

  let acidDuration = 15;
  if(stageLevel1.STATE.renderAcid)
  {
    stageLevel1.STATE.acidEllapsed += delta;

    let timeMult = 0;

    if(stageLevel1.STATE.acidEllapsed < acidDuration / 3)
      timeMult = THREE.Math.mapLinear(stageLevel1.STATE.acidEllapsed, 0, acidDuration / 3, 0, 1);
    else if(stageLevel1.STATE.acidEllapsed < 2 * acidDuration / 3)
      timeMult = 1;
    else
      timeMult = THREE.Math.mapLinear(stageLevel1.STATE.acidEllapsed, 2 * acidDuration / 3, acidDuration, 1, 0);

    stageLevel1.STATE.acidAmp = 0.03 * timeMult;
    stageLevel1.RGBPass.uniforms[ 'time' ].value += delta * speed;
    stageLevel1.RGBPass.uniforms[ 'waveAmp' ].value = stageLevel1.STATE.acidAmp;
    stageLevel1.RGBPass.uniforms[ 'waveFreq' ].value = 10 * 3.14;
    stageLevel1.RGBPass.uniforms[ 'colorOff' ].value = 0.05 * timeMult;
    stageLevel1.RGBPass.uniforms[ 'colorFreq' ].value = 50;
  }
  if(stageLevel1.STATE.acidEllapsed > acidDuration)
  {
    stageLevel1.STATE.acidEllapsed = 0;
    stageLevel1.STATE.renderAcid = false;

    stageLevel1.STATE.acidAmp = 0;
    stageLevel1.RGBPass.uniforms[ 'time' ].value = 0;
    stageLevel1.RGBPass.uniforms[ 'waveAmp' ].value = stageLevel1.STATE.acidAmp;
    stageLevel1.RGBPass.uniforms[ 'waveFreq' ].value = 10 * 3.14;
    stageLevel1.RGBPass.uniforms[ 'colorOff' ].value = 0;
    stageLevel1.RGBPass.uniforms[ 'colorFreq' ].value = 50;
  }
}

stageLevel1.handleNewObjects = function() {

  // Create a new acid every 2 seconds
  let elapsed = stageLevel1.STATE.time;
	if(elapsed % 2 < 1 && stageLevel1.STATE.createMisilAvailable) {
		stageLevel1.STATE.createMisilAvailable = false;
    if(Math.random() > 0.5)
			COMMON.shootMisilFromCenter( stageLevel1 );
	}
	else if (elapsed % 2 > 1) {
		stageLevel1.STATE.createMisilAvailable = true;
	}

  // Create (50% - 50%) either a new Asteroid or a new acid every 5 seconds.
	if(elapsed % 5 < 1 && stageLevel1.STATE.createAsteroidAvailable) {
		stageLevel1.STATE.createAsteroidAvailable = false;
    if(Math.random() > 0.5)
		  COMMON.createRandomAsteroid( stageLevel1 );
    else
      COMMON.createRandomAcidPill( stageLevel1 );
	}
	else if(elapsed % 5 > 1) {
		stageLevel1.STATE.createAsteroidAvailable = true;
	}
}

stageLevel1.chooseRenderer = function( delta ) {
	if(stageLevel1.STATE.renderGlitch)
		stageLevel1.glitchComposer.render( delta );
	else
		stageLevel1.RGBComposer.render( delta );
}

stageLevel1.naveCollideAcid = function() {
  if(this.STATE.renderAcid == true)
    this.STATE.acidEllapsed = 5;
  this.STATE.renderAcid = true;
}

stageLevel1.naveCollide = function() {
  this.STATE.renderGlitch = true;
}
