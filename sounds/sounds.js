
PolybiusAudio = function() {

    this.audioListener;
    this.ambientSound;
    this.audioLoader;
    this.cursor=0;
    this.divisorFrec=1;
    this.shootTime=0.05;
    this.shootSound;
                    // si      sol      la    fa#       sol      mi        fa#       re        mi       do#      re       si       do#     la 
    this.raid_Oct6=[1975.53, 1567.98, 1760, 1479.97,  1567.98, 1318.51,   1479.97, 1174.65,  1318.51, 1108.73, 1174.65, 987.76 , 1108.73 , 880]

  // inicializo la camara
	this.init = function(ambStatus,ambSrc,shootStatus,shootSrc) {
      this.audioListener= new THREE.AudioListener();      
      /*sonido ambiente*/
      if(ambStatus){
          this.audioLoader = new THREE.AudioLoader();
          this.ambientSound= new THREE.Audio( audioListener );
          this.audioLoader.load( ambSrc, function( buffer ) {
              this.ambientSound.setBuffer( buffer );
              this.ambientSound.setLoop(true);
              this.ambientSound.setVolume(0.4);
              this.ambientSound.play();
          });
      }
	};
  this.getListener = function(){
    return this.audioListener;
  }
  this.shoot = funtion(){
      oscillator = this.audioListener.context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value =  this.raid_Oct6[this.cursor]/this.divisorFrec;
      this.shootSound.setNodeSource(oscillator);
      oscillator.start(this.audioListener.context.currentTime);
      oscillator.stop(this.audioListener.context.currentTime+this.shootTime);
      this.cursor++;
      if(this.cursor==this.raid_Oct6){
        this.cursor=0;
        this.divisorFrec++;
      };
      
  }

    
}
