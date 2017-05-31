/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

THREE.FlyControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

	// API

  	this.rad = 1.0;
  	this.minRad = 1.0;
  	this.maxRad = 2.0;
		this.radSpeed = 1.0;
  	this.angSpeed = 0.2;
  	this.rotation = 0.0;
  	this.rotSpeed = 0.2;

  	this.tmatrix = new THREE.Matrix4().makeBasis(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1));

	// internals
	this.tiritoState = 0;
	this.tirotoAvailable = true;
	this.tiritoRecovery = 0;

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, rollLeft: 0, rollRight: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.keydown = function( event ) {

		if ( event.altKey ) {

			return;

		}

		//event.preventDefault();
		switch ( event.keyCode ) {

			case 87: /*W*/ this.moveState.up = 1; break;
			case 83: /*S*/ this.moveState.down = 1; break;

			case 65: /*A*/ this.moveState.left = 1; break;
			case 68: /*D*/ this.moveState.right = 1; break;

			case 73: /*I*/ this.moveState.forward = 1; break;
			case 75: /*K*/ this.moveState.back = 1; break;

			case 74: /*J*/ this.moveState.rollLeft = 1; break;
			case 76: /*L*/ this.moveState.rollRight = 1; break;

			case 32: /* */ this.tiritoState = 1; break;

		}

		this.handleTiros();
		this.updateMovementVector();

	};

	this.keyup = function( event ) {

		switch ( event.keyCode ) {

			case 87: /*W*/ this.moveState.up = 0; break;
			case 83: /*S*/ this.moveState.down = 0; break;

			case 65: /*A*/ this.moveState.left = 0; break;
			case 68: /*D*/ this.moveState.right = 0; break;

			case 73: /*I*/ this.moveState.forward = 0; break;
			case 75: /*K*/ this.moveState.back = 0; break;

			case 74: /*J*/ this.moveState.rollLeft = 0; break;
			case 76: /*L*/ this.moveState.rollRight = 0; break;

			case 32: /* */ this.tiritoState = 0; break;
		}

		this.handleTiros();
		this.updateMovementVector();

	};

	this.update = function( delta ) {
    //acutalizo el radio
    var zoffset = this.moveVector.z * this.radSpeed;

    if(this.rad + zoffset < this.minRad) {
      this.rad = this.minRad;
    } else if(this.rad + zoffset > this.maxRad) {
      this.rad = this.maxRad;
    } else {
      this.rad += zoffset;
    }

    //actualizo la posición
    var xrot = -this.moveVector.y * this.angSpeed;
    var yrot = this.moveVector.x * this.angSpeed;
    var zrot = this.rotation * this.rotSpeed;

    var xAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(this.tmatrix);
    var yAxis = new THREE.Vector3(0, 1, 0).applyMatrix4(this.tmatrix);
    var zAxis = new THREE.Vector3(0, 0, 1).applyMatrix4(this.tmatrix);

    var rxmatrix = new THREE.Matrix4().makeRotationAxis(xAxis, xrot);
    var rymatrix = new THREE.Matrix4().makeRotationAxis(yAxis, yrot);
    var rzmatrix = new THREE.Matrix4().makeRotationAxis(zAxis, zrot);

    this.tmatrix.premultiply(rxmatrix);
    this.tmatrix.premultiply(rymatrix);
    this.tmatrix.premultiply(rzmatrix);


    var pos = new THREE.Vector3(0, 0, -1).applyMatrix4(this.tmatrix);
    pos.multiplyScalar(this.rad);

		this.object.setpos(pos, this.tmatrix);

		// tiros
		if(!this.tiritoAvailable) {
			this.tiritoRecovery += delta;
			if(this.tiritoRecovery > 0.1) {
				this.tiritoAvailable = true;
				this.tiritoRecovery = 0;
			}
		}
	};

	this.handleTiros = function() {
		if(this.tiritoState === 1 && this.tiritoAvailable) {
			this.tiritoAvailable = false;
			shootTirito(object.position.clone());
		}
	}

	this.updateMovementVector = function() {

		this.moveVector.x = ( - this.moveState.left    + this.moveState.right );
		this.moveVector.y = ( - this.moveState.down    + this.moveState.up    );
		this.moveVector.z = ( - this.moveState.forward + this.moveState.back  );

    this.rotation = ( - this.moveState.rollLeft + this.moveState.rollRight );
		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

	};

	this.getContainerDimensions = function() {

		if ( this.domElement != document ) {

			return {
				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
			};

		} else {

			return {
				size	: [ window.innerWidth, window.innerHeight ],
				offset	: [ 0, 0 ]
			};

		}

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function() {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );

		window.removeEventListener( 'keydown', _keydown, false );
		window.removeEventListener( 'keyup', _keyup, false );

	};

	var _keydown = bind( this, this.keydown );
	var _keyup = bind( this, this.keyup );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );

	window.addEventListener( 'keydown', _keydown, false );
	window.addEventListener( 'keyup',   _keyup, false );

	this.updateMovementVector();

};
