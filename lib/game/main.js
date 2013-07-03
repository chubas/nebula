ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

  'vendor.gamepad',

    'game.entities.Base',
    'game.entities.Minion',
    'game.entities.Player',
    'game.entities.actor'
)
.defines(function(){

  // The Impact collider is kinda inflexible. This is necessary, I swear
  var oldCollider = ig.Entity.solveCollision;

  ig.Entity.solveCollision = function ( a, b ) {
    if (a.shouldCollide(b) && b.shouldCollide(a)) {
      oldCollider(a,b);
    }
  }

MyGame = ig.Game.extend({

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),


	init: function() {
		// Initialize your game here; bind keys etc.
        // Spawn base (MAin generator)
        ig.game.spawnEntity( Base, 300, 200 );

        ig.game.spawnEntity( Player, 300, 200 );

        // Spawn Idle minions, they will be the anchors.
        dude = ig.game.spawnEntity( Minion, 50, 50, { state : "idle" });
        ig.game.spawnEntity( Minion, 575, 50, { state : "idle" });
        ig.game.spawnEntity( Minion, 50, 400, { state : "idle" });
        ig.game.spawnEntity( Minion, 575, 400, { state : "idle" })

        //ig.game.spawnEntity( Player, 300, 200);

        ig.input.initMouse();

        // Keyboard controls
        ig.input.bind( ig.KEY.Z, 'spawn' );
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );

        // Xbox controls
        ig.input.bind( ig.KEY.GP_A, 'spawn' );
        ig.input.bind( ig.KEY.GP_LEFT, 'left');
        ig.input.bind( ig.KEY.GP_RIGHT, 'right');
	},

	update: function() {
		// Update all entities and backgroundMaps
    this._updateGamePad();
		this.parent();

		// Add your own, additional update code here
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();


		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;

		this.font.draw( 'Press z to test swarming minions.', x, y, ig.Font.ALIGN.CENTER );
	},

  _updateGamePad : function () {
    if (Gamepad.supported) {
      console.log("Yay gamepad");
      var gamepad = new Gamepad.getState(0);
      var mappings = [[ gamepad.dpadUp, ig.KEY.GP_UP ],
                      [ gamepad.dpadDown, ig.KEY.GP_DOWN ],
                      [ gamepad.dpadLeft, ig.KEY.GP_LEFT ],
                      [ gamepad.dpadRight, ig.KEY.GP_RIGHT ],
                      [ gamepad.faceButton0, ig.KEY.GP_A ],
                      [ gamepad.faceButton1, ig.KEY.GP_B ],
                      [ gamepad.faceButton2, ig.KEY.GP_X ],
                      [ gamepad.faceButton3, ig.KEY.GP_Y ]];
      new Gamepad.magic(gamepad, mappings);
    }
  }
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 640, 480, 1 );

});
