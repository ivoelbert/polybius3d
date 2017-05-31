
PolybiusAudio = function() {

    this.audioListener;
    this.ambientSound;
    this.audioLoader;
    this.cursor=0;
    this.divisorFrec=1;
    this.shootTime=0.1;
    this.shootSound;
    this.scale;
    this.scaleSize;
    this.shootStatus;
    
  // inicializo la camara
	this.init = function(ambStatus, astStatus, shootStatus, ambSrc, astSrc, shootSrc) {
      this.audioListener= new THREE.AudioListener();      
      
      /*sonido ambiente*/
      if(ambStatus){
          this.audioLoader = new THREE.AudioLoader();
          this.ambientSound= new THREE.Audio( this.audioListener );
          this.audioLoader.load( ambSrc, function( buffer ) {
              this.ambientSound.setBuffer( buffer );
              this.ambientSound.setLoop(true);
              this.ambientSound.setVolume(0.4);
              this.ambientSound.play();
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
        oscillator = this.audioListener.context.createOscillator();
        oscillator.type = 'sine';

        //console.log(this.cursor+" frec: "+Math.round(this.scale[this.cursor] / this.divisorFrec,2)+" div:"+ this.divisorFrec)
        oscillator.frequency.value =  Math.round(this.scale[this.cursor] / this.divisorFrec,2);
        this.shootSound.setNodeSource(oscillator);
        oscillator.start(this.audioListener.context.currentTime);
        oscillator.stop(this.audioListener.context.currentTime+this.shootTime);
        
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
       
}
