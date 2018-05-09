STATE = {};

STATE.radius = 50;

STATE.MARGIN = 0;
STATE.SCREEN_HEIGHT = window.innerHeight - STATE.MARGIN * 2;
STATE.SCREEN_WIDTH  = window.innerWidth;

STATE.clock = new THREE.Clock();

STATE.container;
STATE.renderer;
STATE.stats;

STATE.currentStage;
STATE.nextStage;

STATE.polybiusAudio = new PolybiusAudio();
STATE.polybiusAudio.init(true, true, 'sounds/base_editada_3.mp3');

STATE.selectedMesh = 0;
