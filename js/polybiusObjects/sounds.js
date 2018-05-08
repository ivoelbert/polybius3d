
PolybiusAudio = function() {

    this.cursor=0;
    this.divisorFrec=1;
    this.scale;
    this.scaleSize;

  // inicializo la camara
	this.init = function(ambStatus, astStatus, ambSrc) {
      this.audioListener= new THREE.AudioListener();
      ambientSound= new THREE.Audio( this.audioListener );
      this.audioLoader = new THREE.AudioLoader();

      /*sonido ambiente*/
      if(ambStatus){

          this.audioLoader.load(ambSrc,function( buffer ) {
              ambientSound.setBuffer(buffer);
              ambientSound.setLoop(true);
              ambientSound.setVolume(0.7);
              ambientSound.play();
          });
      }

      // Noise for explosions
      let context = this.audioListener.context;
      let bufferSize = 2048;
      this.brownNoise = (function() {
          var lastOut = 0.0;
          var node = context.createScriptProcessor(bufferSize, 1, 1);
          node.onaudioprocess = function(e) {
              var output = e.outputBuffer.getChannelData(0);
              for (var i = 0; i < bufferSize; i++) {
                  var white = Math.random() * 2 - 1;
                  output[i] = (lastOut + (0.02 * white)) / 1.02;
                  lastOut = output[i];
                  output[i] *= 3.5; // (roughly) compensate for gain
              }
          }
          return node;
      })();

      // Oscillator for tiritos
      this.scale = [1975.53, 1567.98, 1760, 1479.97,  1567.98, 1318.51,   1479.97, 1174.65,  1318.51, 1108.73, 1174.65, 987.76 , 1108.73 , 880]
      this.scaleSize=(this.scale).length;

      this.tiritoGainNode = context.createGain();
      this.tiritoGainNode.gain.setValueAtTime(0, context.currentTime);
      this.tiritoOscillator = context.createOscillator();
      this.tiritoOscillator.connect(this.tiritoGainNode);
      this.tiritoGainNode.connect(context.destination);
      this.tiritoOscillator.start(context.currentTime);

      // Oscillator for acid
      this.acidGainNode = context.createGain();
      this.acidGainNode.gain.setValueAtTime(0, context.currentTime);
      this.acidOscillator = context.createOscillator();
      this.acidOscillator.connect(this.acidGainNode);
      this.acidGainNode.connect(context.destination);
      this.acidOscillator.start(context.currentTime);
	};

  this.getListener = function(){
    return this.audioListener;
  };

  this.shoot = function( acid ){
      let context = this.audioListener.context;
      let currentTime = context.currentTime;
      let shootTime = acid > 0 ? 0.08 : 0.05;

      let freq = Math.round(this.scale[this.cursor] / this.divisorFrec, 2);
      this.tiritoOscillator.frequency.setValueAtTime(freq, currentTime);
      if(acid > 0) {
        let variations = Math.floor(randBetween(1, 5));
        let deltat = shootTime / variations;
        for(let i = 0; i < variations; i++) {
          let mult = THREE.Math.mapLinear(acid, 0, 0.03, 1, 1.2);
          let nFreq = freq * randBetween(1, mult);
          let startTime = currentTime + i * deltat;
          this.tiritoOscillator.frequency.setTargetAtTime(nFreq, startTime, deltat);
        }
      }

      this.tiritoGainNode.gain.setValueAtTime(0, currentTime);
      this.tiritoGainNode.gain.setTargetAtTime(0.1, currentTime, 0.02);
      this.tiritoGainNode.gain.setTargetAtTime(0, currentTime + shootTime - 0.02, 0.02);

      this.cursor++;
      if(this.cursor==this.scaleSize){
        this.cursor=0;
        this.divisorFrec++;
      }
      if(this.divisorFrec==5)this.divisorFrec=1;
  };


  this.explode = function(obj, explodeTime) {
    let posAudio = new THREE.PositionalAudio( this.audioListener );
    let context = this.audioListener.context;
    let currentTime = context.currentTime;

    let gainNode = context.createGain();
    this.brownNoise.connect(gainNode);
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.setTargetAtTime(1, currentTime, 0.05);
    gainNode.gain.setTargetAtTime(0.005, currentTime + 0.01, explodeTime / 4);
    gainNode.gain.setTargetAtTime(0, currentTime + explodeTime - 0.01, 0.01);

    posAudio.setNodeSource( gainNode );
		posAudio.setRefDistance( 40 );
		posAudio.setVolume( 1 );

    obj.add( posAudio );
  }

}
