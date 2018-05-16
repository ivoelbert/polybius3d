let stageSurvival = new polyStage();

////////////////////////////////////////////////////////////////////////////////
//   INIT                                                                     //
////////////////////////////////////////////////////////////////////////////////
stageSurvival.init = function() {
  // State
  stageSurvival.STATE = {};
  stageSurvival.STATE.createAsteroidAvailable = false;
  stageSurvival.STATE.createMisilAvailable = false;
  stageSurvival.STATE.glitchEllapsed = 0;
  stageSurvival.STATE.renderGlitch = false;
  stageSurvival.STATE.acidAmp = 0;
  stageSurvival.STATE.acidTrips = 0;
  stageSurvival.STATE.time = 0;

  // Scene
  stageSurvival.scene = new THREE.Scene();
  stageSurvival.scene.fog = new THREE.FogExp2( 0x000000, 0.000025 );

  // Set up collider
  COLLIDER.resetReglas();
  COLLIDER.addRegla(stageSurvival.groupTiritos, stageSurvival.groupCenters);
  COLLIDER.addRegla(stageSurvival.groupTiritos, stageSurvival.groupMisiles);
  COLLIDER.addRegla(stageSurvival.groupNaves, stageSurvival.groupMisiles);
  COLLIDER.addRegla(stageSurvival.groupNaves, stageSurvival.groupAsteroids);
  COLLIDER.addRegla(stageSurvival.groupTiritos, stageSurvival.groupAsteroids);

  // Stars
  COMMON.createStars( stageSurvival.scene );

  // Nave
  let navepos = new THREE.Vector3(0, 0, STATE.radius * 5);
  let nave = new Nave( stageSurvival, navepos, STATE.radius * 0.09 );
  nave.addToScene( stageSurvival.scene );
  stageSurvival.groupNaves.add( nave );

  // Camera
  stageSurvival.camera = new FollowCamera( stageSurvival.groupNaves.children[0] );
  let off = new THREE.Vector3(0, STATE.radius, -2 * STATE.radius);
  stageSurvival.camera.init(80, off, 0.4, STATE.radius * 5);
  stageSurvival.camera.getCam().add( STATE.polybiusAudio.getListener() );

  // Centro
  let center = new Center( stageSurvival, new THREE.Vector3(0, 0, 0), STATE.radius);
  center.addToScene( stageSurvival.scene );
  stageSurvival.groupCenters.add(center);
  center.addShieldToGroup( stageSurvival.groupCenters );
  center.removeCenterAsteroids();


  ///////////////////////////// POSTPROCESSING /////////////////////////////////
  // Glitch composer
  stageSurvival.glitchComposer = new THREE.EffectComposer( STATE.renderer );
  stageSurvival.glitchComposer.addPass( new THREE.RenderPass( stageSurvival.scene, stageSurvival.camera.getCam() ) );

  let glitchPass = new THREE.GlitchPass();
  glitchPass.goWild = true;
  glitchPass.renderToScreen = true;
  stageSurvival.glitchComposer.addPass( glitchPass );

  // RGB pass
  stageSurvival.RGBComposer = new THREE.EffectComposer( STATE.renderer );
  stageSurvival.RGBComposer.addPass( new THREE.RenderPass( stageSurvival.scene, stageSurvival.camera.getCam() ) );

  stageSurvival.RGBPass = new THREE.ShaderPass( THREE.RGBShiftShader );
  stageSurvival.RGBPass.renderToScreen = true;
  stageSurvival.RGBComposer.addPass( stageSurvival.RGBPass );

  stageSurvival.STATE.acidAmp = 0;
  stageSurvival.RGBPass.uniforms[ 'time' ].value = 0;
  stageSurvival.RGBPass.uniforms[ 'waveAmp' ].value = stageSurvival.STATE.acidAmp;
  stageSurvival.RGBPass.uniforms[ 'waveFreq' ].value = 10 * 3.14;
  stageSurvival.RGBPass.uniforms[ 'colorOff' ].value = 0;
  stageSurvival.RGBPass.uniforms[ 'colorFreq' ].value = 50;
  //////////////////////////////////////////////////////////////////////////////

  stageSurvival.resetSize = function( arg ) {
    stageSurvival.camera.setAspect( arg );
    stageSurvival.camera.updateProy();

    stageSurvival.glitchComposer.reset();
    stageSurvival.RGBComposer.reset();
  }

  COMMON.hideHealth();

  COMMON.createAsteroidAt( stageSurvival, new THREE.Vector3( STATE.radius, 0, 0 ) );
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//   UPDATE                                                                   //
////////////////////////////////////////////////////////////////////////////////
stageSurvival.update = function( delta ) {
  // Update my local time;
  stageSurvival.STATE.time += delta;

  // Update every group
	stageSurvival.moveThings( delta );
  stageSurvival.camera.update( delta );

	// Update composers
	stageSurvival.updateGlitchComposer( delta );
  stageSurvival.updateRGBComposer( delta );

  // Do we need to create any object?
	stageSurvival.handleNewObjects();

  // Check if things collide
  COLLIDER.checkCollisions();

  // Finally render to screen
	stageSurvival.chooseRenderer( delta );
}
////////////////////////////////////////////////////////////////////////////////


stageSurvival.updateGlitchComposer = function( delta ) {
  if(stageSurvival.STATE.renderGlitch) {
		stageSurvival.STATE.glitchEllapsed += delta;
	}
	if(stageSurvival.STATE.glitchEllapsed > 0.8) {
		stageSurvival.STATE.renderGlitch = false;
		stageSurvival.STATE.glitchEllapsed = 0;
	}
}

stageSurvival.updateRGBComposer = function( delta ) {
  let speed = 0.1;

  stageSurvival.STATE.acidAmp = stageSurvival.getAcidAmp();
  stageSurvival.RGBPass.uniforms[ 'time' ].value = stageSurvival.STATE.time * speed;
  stageSurvival.RGBPass.uniforms[ 'waveAmp' ].value = stageSurvival.STATE.acidAmp * 0.03;
  stageSurvival.RGBPass.uniforms[ 'waveFreq' ].value = 10 * 3.14;
  stageSurvival.RGBPass.uniforms[ 'colorOff' ].value = 0.05 * stageSurvival.STATE.acidAmp;
  stageSurvival.RGBPass.uniforms[ 'colorFreq' ].value = 50;
}

stageSurvival.getAcidAmp = function() {
  // 1- minute no acid
  // 2- one minute of incrementing acid (from 0 to 1)
  // 3- 10 seconds of decay
  // 4- repeat
  // This totals 130 seconds loops

  let t = stageSurvival.STATE.time % 130;
  console.log(stageSurvival.STATE.acidTrips);

  if(t < 30) {

    if(stageSurvival.STATE.resetAcidTrip) {
      stageSurvival.STATE.acidTrips++;
      stageSurvival.STATE.resetAcidTrip = false;
    }

    return 0;
  }
  else if(t < 120) {
    let amp = THREE.Math.mapLinear(t, 30, 120, 0, 1);
    return amp;
  }
  else if(t < 130) {
    let amp = COMMON.easeInOut(THREE.Math.mapLinear(t, 120, 130, 1, 0));
    stageSurvival.STATE.resetAcidTrip = true;
    return amp;
  }



  return 0;
}

stageSurvival.handleNewObjects = function() {

  let elapsed = stageSurvival.STATE.time;

  // Create a new misil every 2 seconds
  let misilInterval = Math.min(THREE.Math.mapLinear(stageSurvival.STATE.acidTrips, 0, 5), 0.5);
	if(elapsed % misilInterval < misilInterval / 3 && stageSurvival.STATE.createMisilAvailable) {
		stageSurvival.STATE.createMisilAvailable = false;
		COMMON.shootMisilFromCenter( stageSurvival );
	}
	else if (elapsed % misilInterval > misilInterval / 3) {
		stageSurvival.STATE.createMisilAvailable = true;
	}

  // Create an Asteroid every 3 seconds.
  let asteroidInterval = 3;
  if(elapsed % asteroidInterval < asteroidInterval / 3 && stageSurvival.STATE.createAsteroidAvailable) {
    stageSurvival.STATE.createAsteroidAvailable = false;
      COMMON.createRandomAsteroid( stageSurvival );
  }
  else if(elapsed % asteroidInterval > asteroidInterval / 3) {
    stageSurvival.STATE.createAsteroidAvailable = true;
  }
}

stageSurvival.chooseRenderer = function( delta ) {
	if(stageSurvival.STATE.renderGlitch)
		stageSurvival.glitchComposer.render( delta );
	else
		stageSurvival.RGBComposer.render( delta );
}

stageSurvival.naveCollide = function() {
  this.STATE.renderGlitch = true;
}
