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
  COLLIDER.addRegla(stageTutorial.groupNaves, stageTutorial.groupCheckpoints);

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

  COMMON.hideElement("ik-rules", 0);
  COMMON.hideElement("wasd-rules", 0);
  COMMON.showElement("wasd-rules", 500);
  
  stageTutorial.STATE.GUIElement = "wasd-rules";
  stageTutorial.STATE.loweredWASD = false;
  stageTutorial.STATE.loweredIK = false;

  document.addEventListener("keydown", stageTutorial.pressKey);
  document.addEventListener("keyup", stageTutorial.releaseKey);

  stageTutorial.groupNaves.children[0].blockKeys("wasdijkl");
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


////////////////////////////////////////////////////////////////////////////////
// GUI
////////////////////////////////////////////////////////////////////////////////
stageTutorial.pressKey = function(event) {
  let which = event.key;

  let lowerWASD = function() {
    stageTutorial.STATE.loweredWASD = true;
    stageTutorial.groupNaves.children[0].unblockKeys("wasd");

    $("#wasd-rules").css("transform", "scale(0.6)");
    $("#wasd-rules").css("top", "calc(80% - 15vh)");

    let navePos = stageTutorial.groupNaves.children[0].position.clone();
    navePos.negate();

    COMMON.createCheckpoint(stageTutorial, navePos, STATE.radius, function() {
      let naveRad = stageTutorial.groupNaves.children[0].position.length();
      let upVector = stageTutorial.groupNaves.children[0].up.clone();
      upVector.setLength(naveRad);

      COMMON.createCheckpoint(stageTutorial, upVector, STATE.radius, function() {
        COMMON.hideElement("wasd-rules", 500, function() {
          stageTutorial.STATE.GUIElement = "ik-rules";
          COMMON.showElement("ik-rules", 500);
        });
      });
    });
  }

  
  let lowerIK = function() {
    stageTutorial.groupNaves.children[0].unblockKeys("ik");
    stageTutorial.STATE.loweredIK = true;
    $("#ik-rules").css("transform", "scale(0.6)");
    $("#ik-rules").css("top", "calc(80% - 15vh)");

    let navePos = stageTutorial.groupNaves.children[0].position.clone();
    navePos.setLength( STATE.maxRadius );
    navePos.negate();

    COMMON.createCheckpoint(stageTutorial, navePos, STATE.radius, function() {
      let newPos = stageTutorial.groupNaves.children[0].position.clone();
      newPos.negate();
      newPos.setLength( STATE.minRadius );

      COMMON.createCheckpoint(stageTutorial, newPos, STATE.radius, function() {
        COMMON.hideElement("ik-rules", 500, function() {
          stageTutorial.STATE.GUIElement = "no-rules";
        });
      });
    });
  }

  let keys = {};
  switch(stageTutorial.STATE.GUIElement) {
    case "wasd-rules":
      keys = {'w': 0, 'a': 1, 's': 2, 'd': 3};
      if(keys[which] !== undefined) {
        $(".wasd-rules .key")[keys[which]].style["border-bottom"] = "0.2vw solid grey";
        $(".wasd-rules .key")[keys[which]].style["margin"] = "calc(1% + 0.3vw) 1% 1% 1%"
        
        if(!stageTutorial.STATE.loweredWASD)
          lowerWASD();
      }
      break;

    case "ik-rules":
      keys = {'i': 0, 'k': 1};
      if(keys[which] !== undefined) {
        $(".ik-rules .key")[keys[which]].style["border-bottom"] = "0.2vw solid grey";
        $(".ik-rules .key")[keys[which]].style["margin"] = "calc(1% + 0.3vw) 1% 1% 1%"

        if(!stageTutorial.STATE.loweredIK)
          lowerIK();
      }
      break;
  }
}

stageTutorial.releaseKey = function(event) {
  let which = event.key;

  let keys = {};
  switch(stageTutorial.STATE.GUIElement) {
    case "wasd-rules":
      keys = {'w': 0, 'a': 1, 's': 2, 'd': 3};
      if(keys[which] !== undefined) {
        $(".wasd-rules .key")[keys[which]].style["border-bottom"] = "0.5vw solid grey"
        $(".wasd-rules .key")[keys[which]].style["margin"] = "1%"
      }
      break;

    case "ik-rules":
      keys = {'i': 0, 'k': 1};
      if(keys[which] !== undefined) {
        $(".ik-rules .key")[keys[which]].style["border-bottom"] = "0.5vw solid grey"
        $(".ik-rules .key")[keys[which]].style["margin"] = "1%"
      }
      break;
  }
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