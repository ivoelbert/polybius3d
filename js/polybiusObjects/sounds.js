
PolybiusAudio = function() {

    this.shootSound;
    this.cursor=0;
    this.divisorFrec=1;
    this.shootTime=0.1;
    this.scale;
    this.scaleSize;
    this.shootStatus;

  // inicializo la camara
	this.init = function(ambStatus, astStatus, shootStatus, ambSrc, astSrc, shootSrc) {
      this.audioListener= new THREE.AudioListener();
      ambientSound= new THREE.Audio( this.audioListener );
      this.audioLoader = new THREE.AudioLoader();

      /*sonido ambiente*/
      if(ambStatus){

          this.audioLoader.load(ambSrc,function( buffer ) {
              ambientSound.setBuffer(buffer);
              ambientSound.setLoop(true);
              ambientSound.setVolume(0.9);
              ambientSound.play();
          });
      }



      if(shootStatus){//seleccionar otras escalas
          this.shootSound= new THREE.Audio( this.audioListener );
          this.shootStatus=true;
          this.scale = [1975.53, 1567.98, 1760, 1479.97,  1567.98, 1318.51,   1479.97, 1174.65,  1318.51, 1108.73, 1174.65, 987.76 , 1108.73 , 880]
          this.scaleSize=(this.scale).length;
      }



	};
  this.getListener = function(){
    return this.audioListener;
  };
  this.shoot = function(){
    if(this.shootStatus){
        let context = this.audioListener.context;
        let currentTime = context.currentTime;

        let freq = Math.round(this.scale[this.cursor] / this.divisorFrec, 2);

        let gainNode = context.createGain();
        let oscillator = context.createOscillator();
        oscillator.frequency.setValueAtTime(freq, currentTime);
        oscillator.detune.setValueAtTime(10, currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.setTargetAtTime(0.1, currentTime, this.shootTime * 0.01);
        gainNode.gain.setTargetAtTime(0, currentTime + this.shootTime - 0.01, 0.01);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + this.shootTime * 2);

        let gainNode2 = context.createGain();
        let oscillator2 = context.createOscillator();
        oscillator2.frequency.setValueAtTime(freq, currentTime);
        oscillator2.detune.setValueAtTime(-10, currentTime);
        oscillator2.connect(gainNode2);
        gainNode2.connect(context.destination);
        gainNode2.gain.setValueAtTime(0, currentTime);
        gainNode2.gain.setTargetAtTime(0.02, currentTime, this.shootTime * 0.01);
        gainNode2.gain.setTargetAtTime(0, currentTime + this.shootTime - 0.01, 0.01);
        oscillator2.start(currentTime);
        oscillator2.stop(currentTime + this.shootTime * 2);


        this.cursor++;
        if(this.cursor==this.scaleSize){
          this.cursor=0;
          this.divisorFrec++;
        };
        if(this.divisorFrec==5)this.divisorFrec=1;
    }else{
        console.log("ShootSounds disabled");
    }
  };

  this.explode = function() {
    return;
  }

}
