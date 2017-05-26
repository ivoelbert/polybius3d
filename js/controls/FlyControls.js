/**
 * @author James Baicoianu / http://www.baicoianu.com/
 * modificado por El Bunker
 */

THREE.FlyControls = function (object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

	this.angVel = 0.2;
	this.radVel = 1.0;
	this.radBoost = 2.0;

	this.pos = new THREE.Vector3(0, 0, -1);
	this.rad = 1;


	this.minRad = 1.0;
	this.maxRad = 2.0;


	this.rotx = new THREE.Matrix4();
	this.roty = new THREE.Matrix4();
	this.newZAxis = new THREE.Vector3();

	// disable default target object behavior

	// internals

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.movementSpeedMultiplier = 1;
	this.matrisin = new THREE.Matrix4();
	this.matrisin.set(1, 0, 0, 0,
										0, 1, 0, 0,
									  0, 0, 1, 0,
										0, 0, 0, 1);
	console.log(this.matrisin);

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
			case 74: /*J*/ this.moveState.back = 1; break;

			case 38: /*up*/ this.moveState.pitchUp = 1; break;
			case 40: /*down*/ this.moveState.pitchDown = 1; break;

			case 37: /*left*/ this.moveState.yawLeft = 1; break;
			case 39: /*right*/ this.moveState.yawRight = 1; break;

			case 81: /*Q*/ this.moveState.rollLeft = 1; break;
			case 69: /*E*/ this.moveState.rollRight = 1; break;

		}

		this.updateMovementVector();

	};

	this.keyup = function( event ) {

		switch ( event.keyCode ) {

			case 87: /*W*/ this.moveState.up = 0; break;
			case 83: /*S*/ this.moveState.down = 0; break;

			case 65: /*A*/ this.moveState.left = 0; break;
			case 68: /*D*/ this.moveState.right = 0; break;

			case 73: /*I*/ this.moveState.forward = 0; break;
			case 74: /*J*/ this.moveState.back = 0; break;

			case 38: /*up*/ this.moveState.pitchUp = 0; break;
			case 40: /*down*/ this.moveState.pitchDown = 0; break;

			case 37: /*left*/ this.moveState.yawLeft = 0; break;
			case 39: /*right*/ this.moveState.yawRight = 0; break;

			case 81: /*Q*/ this.moveState.rollLeft = 0; break;
			case 69: /*E*/ this.moveState.rollRight = 0; break;

		}

		this.updateMovementVector();

	};


	this.update = function( delta ) {

		//movimiento en eje z;
		if(this.moveVector.x != 0) {
			if(this.rad + this.moveVector.x * this.radVel * delta > this.maxRad) {
				this.rad = this.maxRad;
			}
			else if(this.rad + this.moveVector.x * this.radVel * delta < this.minRad) {
				this.rad = this.minRad;
			}
			else {
				this.rad += this.moveVector.x * this.radVel * delta;
			}
		}

		var mymap = function(value, istart, istop, ostart, ostop) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
		}

		var aten = mymap(this.rad, this.minRad, this.maxRad, 1, this.radBoost);

		// defino matrices de rotacion
		// W-S roto sobre eje x
		this.rotx.makeRotationX(this.angVel * aten * delta);
		this.rotx.multiplyScalar(this.moveVector.z);

		// A-D roto sobre eje y
		this.roty.makeRotationX(this.angVel * aten * delta);
		this.roty.multiplyScalar(this.moveVector.y);

		// premultiplico los ejes por las matrices de rotación
		this.matrisin.premultiply(this.rotx);
		this.matrisin.premultiply(this.roty);

		// muevo el (0, 0, -1) al nuevo eje -z
    this.newZAxis.applyMatrix4(this.matrisin);

		// obtengo la posicion nueva
		this.newZAxis.multiplyScalar(this.rad);
		this.pos.set(this.newZAxis.x, this.newZAxis.y, this.newZAxis.z);


		this.object.position.set(this.pos.x, this.pos.y, this.pos.z);
		this.object.lookAt(new THREE.Vector3(0, 0, 0));


		// expose the rotation vector for convenience
	};

	this.updateMovementVector = function() {

		this.moveVector.x = - this.moveState.forward + this.moveState.back;
		this.moveVector.y = - this.moveState.left    + this.moveState.right;
		this.moveVector.z = - this.moveState.up    + this.moveState.down;

		//this.moveVector.normalize();
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
