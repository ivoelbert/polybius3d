let stageIndex = new polyStage();

////////////////////////////////////////////////////////////////////////////////
//   INIT                                                                     //
////////////////////////////////////////////////////////////////////////////////
stageIndex.init = function() {
    // State
    stageIndex.STATE = {};
    stageIndex.STATE.time = 0;

    // Scene
    stageIndex.scene = new THREE.Scene();
    stageIndex.scene.fog = new THREE.FogExp2(0x000000, 0.000025);

    // Set up collider
    COLLIDER.resetReglas();

    // Stars
    COMMON.createStars(stageIndex.scene);

    // Camera
    stageIndex.camera = new THREE.PerspectiveCamera(80, STATE.SCREEN_WIDTH / STATE.SCREEN_HEIGHT, 10, 10000);
    stageIndex.camera.position.z = 10 * STATE.radius;

    // centro
    let center = new Center(stageIndex, new THREE.Vector3(0, 0, 0), STATE.radius);
    center.addToScene(stageIndex.scene);
    stageIndex.groupCenters.add(center);
    center.addShieldToGroup(stageIndex.groupCenters);
    stageIndex.groupCenterAsteroids = center.getAsteroidsGroup();

    let asteroid = new Asteroid(stageIndex, new THREE.Vector3(6 * STATE.radius, 0, 0), STATE.radius, 0, 1);
    asteroid.addToScene(stageIndex.scene);
    asteroid.radToLive = Infinity;
    asteroid.timeToLive = Infinity;
    stageIndex.groupAsteroids.add(asteroid);

    ///////////////////////////// POSTPROCESSING /////////////////////////////////

    stageIndex.RGBComposer = new THREE.EffectComposer(STATE.renderer);
    stageIndex.RGBComposer.addPass(new THREE.RenderPass(stageIndex.scene, stageIndex.camera));

    stageIndex.RGBPass = new THREE.ShaderPass(THREE.RGBShiftShader);
    stageIndex.RGBPass.renderToScreen = true;
    stageIndex.RGBComposer.addPass(stageIndex.RGBPass);

    stageIndex.RGBPass.uniforms['time'].value = 0;
    stageIndex.RGBPass.uniforms['waveAmp'].value = 0;
    stageIndex.RGBPass.uniforms['waveFreq'].value = 10 * 3.14;
    stageIndex.RGBPass.uniforms['colorOff'].value = 0;
    stageIndex.RGBPass.uniforms['colorFreq'].value = 50;
    //////////////////////////////////////////////////////////////////////////////

    stageIndex.resetSize = function(arg) {
        stageIndex.camera.aspect = arg;
        stageIndex.camera.updateProjectionMatrix();

        stageIndex.RGBComposer.reset();
    }

    COMMON.hideElement("info", 0);
    COMMON.showElement("info", 1000);
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//   UPDATE                                                                   //
////////////////////////////////////////////////////////////////////////////////
stageIndex.update = function(delta) {
        stageIndex.STATE.time += delta;

        stageIndex.moveThings(delta);

        stageIndex.updateTitle();

        stageIndex.chooseRenderer();
    }
    ////////////////////////////////////////////////////////////////////////////////

stageIndex.updateTitle = function() {
    let t = THREE.Math.mapLinear(stageIndex.STATE.time, 0, 2, 0, Math.PI * 2);
    let sz = THREE.Math.mapLinear(Math.sin(t), -1, 1, 0.95, 1.05);
    document.getElementById("title").style["transform"] = "scale(" + sz + ")";
}

stageIndex.chooseRenderer = function(delta) {
    stageIndex.RGBComposer.render(delta);
}