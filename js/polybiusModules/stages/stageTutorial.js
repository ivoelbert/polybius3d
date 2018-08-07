let stageTutorial = new polyStage();

////////////////////////////////////////////////////////////////////////////////
//   INIT                                                                     //
////////////////////////////////////////////////////////////////////////////////
stageTutorial.init = function() {
  // State
  stageTutorial.STATE = {};
  stageTutorial.STATE.glitchEllapsed = 0;
  stageTutorial.STATE.renderGlitch = false;
  stageTutorial.STATE.acidAmp = 0;
  stageTutorial.STATE.time = 0;

  // Scene
  stageTutorial.scene = new THREE.Scene();
  stageTutorial.scene.fog = new THREE.FogExp2( 0x000000, 0.000025 );

  // Set up collider
  COLLIDER.resetReglas();
  COLLIDER.addRegla(stageTutorial.groupTiritos, stageTutorial.groupCenters);
  COLLIDER.addRegla(stageTutorial.groupTiritos, stageTutorial.groupMisiles);
  COLLIDER.addRegla(stageTutorial.groupNaves, stageTutorial.groupMisiles);
  COLLIDER.addRegla(stageTutorial.groupNaves, stageTutorial.groupAsteroids);
  COLLIDER.addRegla(stageTutorial.groupTiritos, stageTutorial.groupAsteroids);

  // Stars
  COMMON.createStars( stageTutorial.scene );

  // Nave
  let navepos = new THREE.Vector3(0, 0, STATE.radius * 5);
  let nave = new Nave( stageTutorial, navepos, STATE.radius * 0.09 );
  nave.addToScene( stageTutorial.scene );
  stageTutorial.groupNaves.add( nave );

  // Camera
  stageTutorial.camera = new FollowCamera( stageTutorial.groupNaves.children[0] );
  let off = new THREE.Vector3(0, STATE.radius, -2 * STATE.radius);
  stageTutorial.camera.init(80, off, 0.4, STATE.radius * 5);
  stageTutorial.camera.getCam().add( STATE.polybiusAudio.getListener() );

  // Centro
  let center = new Center( stageTutorial, new THREE.Vector3(0, 0, 0), STATE.radius);
  center.addToScene( stageTutorial.scene );
  stageTutorial.groupCenters.add(center);
  center.addShieldToGroup( stageTutorial.groupCenters );


  ///////////////////////////// POSTPROCESSING /////////////////////////////////
  // Glitch composer
  stageTutorial.glitchComposer = new THREE.EffectComposer( STATE.renderer );
  stageTutorial.glitchComposer.addPass( new THREE.RenderPass( stageTutorial.scene, stageTutorial.camera.getCam() ) );

  let glitchPass = new THREE.GlitchPass();
  glitchPass.goWild = true;
  glitchPass.renderToScreen = true;
  stageTutorial.glitchComposer.addPass( glitchPass );

  // RGB pass
  stageTutorial.RGBComposer = new THREE.EffectComposer( STATE.renderer );
  stageTutorial.RGBComposer.addPass( new THREE.RenderPass( stageTutorial.scene, stageTutorial.camera.getCam() ) );

  stageTutorial.RGBPass = new THREE.ShaderPass( THREE.RGBShiftShader );
  stageTutorial.RGBPass.renderToScreen = true;
  stageTutorial.RGBComposer.addPass( stageTutorial.RGBPass );

  stageTutorial.STATE.acidAmp = 0;
  stageTutorial.RGBPass.uniforms[ 'time' ].value = 0;
  stageTutorial.RGBPass.uniforms[ 'waveAmp' ].value = stageTutorial.STATE.acidAmp;
  stageTutorial.RGBPass.uniforms[ 'waveFreq' ].value = 10 * 3.14;
  stageTutorial.RGBPass.uniforms[ 'colorOff' ].value = 0;
  stageTutorial.RGBPass.uniforms[ 'colorFreq' ].value = 50;
  //////////////////////////////////////////////////////////////////////////////

  stageTutorial.resetSize = function( arg ) {
    stageTutorial.camera.setAspect( arg );
    stageTutorial.camera.updateProy();

    stageTutorial.glitchComposer.reset();
    stageTutorial.RGBComposer.reset();
  }

}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//   UPDATE                                                                   //
////////////////////////////////////////////////////////////////////////////////
stageTutorial.update = function( delta ) {
  // Update my local time;
  stageTutorial.STATE.time += delta;

  // Update every group
	stageTutorial.moveThings( delta );
  stageTutorial.camera.update( delta );

	// Update composers
	stageTutorial.updateGlitchComposer( delta );
  stageTutorial.updateRGBComposer( delta );

  // Do we need to create any object?
	stageTutorial.handleNewObjects();

  // Check if things collide
  COLLIDER.checkCollisions();

  // Finally render to screen
	stageTutorial.chooseRenderer( delta );
}
////////////////////////////////////////////////////////////////////////////////


stageTutorial.updateGlitchComposer = function( delta ) {
  if(stageTutorial.STATE.renderGlitch) {
		stageTutorial.STATE.glitchEllapsed += delta;
	}
	if(stageTutorial.STATE.glitchEllapsed > 0.8) {
		stageTutorial.STATE.renderGlitch = false;
		stageTutorial.STATE.glitchEllapsed = 0;
	}
}

stageTutorial.updateRGBComposer = function( delta ) {
  let speed = 0.1;

  stageTutorial.STATE.acidAmp = stageTutorial.getAcidAmp();
  stageTutorial.RGBPass.uniforms[ 'time' ].value = stageTutorial.STATE.time * speed;
  stageTutorial.RGBPass.uniforms[ 'waveAmp' ].value = stageTutorial.STATE.acidAmp * 0.03;
  stageTutorial.RGBPass.uniforms[ 'waveFreq' ].value = 10 * 3.14;
  stageTutorial.RGBPass.uniforms[ 'colorOff' ].value = 0.05 * stageTutorial.STATE.acidAmp;
  stageTutorial.RGBPass.uniforms[ 'colorFreq' ].value = 50;
}

stageTutorial.getAcidAmp = function() {
  return 0;
}

stageTutorial.handleNewObjects = function() {
  let elapsed = stageTutorial.STATE.time;
}

stageTutorial.chooseRenderer = function( delta ) {
	if(stageTutorial.STATE.renderGlitch)
		stageTutorial.glitchComposer.render( delta );
	else
		stageTutorial.RGBComposer.render( delta );
}

stageTutorial.naveCollide = function() {
  this.STATE.renderGlitch = true;
}
