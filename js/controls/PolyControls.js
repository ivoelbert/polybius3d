/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

THREE.PolyControls = function (domelem) {
	this.blockedKeys = "";

	this.domElement = domelem;
	this.domElement.setAttribute( 'tabindex', - 1 );

	this.moveState = { 
		shoot: 0,
		up: 0,
		down: 0,
		left: 0,
		right: 0,
		forward: 0,
		back: 0,
		rollLeft: 0,
		rollRight: 0
	};

	this.blockKeys = function ( keys ) {
		this.blockedKeys += keys;
	}

	this.unblockKeys = function ( keys ) {
		for(let i = 0; i < keys.length; i++) {
			let regExp = new RegExp(keys.charAt(i), "g");
			this.blockedKeys = this.blockedKeys.replace(regExp, "");
		}
	}

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.keydown = function( event ) {

		if ( event.altKey ) {
			return;
		}

		if ( this.blockedKeys.indexOf(event.key) != -1 ) {
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

			case 32: /* */ this.moveState.shoot = 1; break;

		}

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

			case 32: /* */ this.moveState.shoot = 0; break;
		}

	};

	this.update = function()
	{
		return this.moveState;
	}

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

};
