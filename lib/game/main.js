ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

  'vendor.gamepad',
  'vendor.NodeSupport',

    'game.Person',
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

Nebula = ig.Game.extend({

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),


  // Global debug switches!
  drawBoundingBox : false,
  localPerson : null,

	init: function() {
        ig.System.drawMode = ig.System.DRAW.AUTHENTIC;

        // this is my current way of distinguishing control.
        this.localPerson = this.addPerson();
        this.otherPerson = this.addPerson({
            hue : 220,
            spawn : {
                player : {x: 600, y:200},
                base : {x:600, y:200}
            }
        });

        // Spawn Idle minions, they will be the anchors.
        dude = ig.game.spawnEntity( Minion, 50, 50, { state : "idle", hue : 90 });
        ig.game.spawnEntity( Minion, 575, 50, { state : "idle", hue : 180 });
        ig.game.spawnEntity( Minion, 50, 400, { state : "idle", hue : 270 });
        ig.game.spawnEntity( Minion, 575, 400, { state : "idle" })

        ig.input.initMouse();

        // Keyboard controls
        ig.input.bind( ig.KEY.Z, 'spawn' );
        ig.input.bind( ig.KEY.X, 'interact' );
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );

        //GLOBAL SWITCHES!
        ig.input.bind( ig.KEY._1, 'drawBoundingBox' );
	},

	update: function() {
		// Update all entities and backgroundMaps
    this._updateGamePad();
		this.parent();

    if (ig.input.pressed('drawBoundingBox')) {
      console.log("Pressed");
      ig.game.drawBoundingBox = !ig.game.drawBoundingBox;
    }

		// Add your own, additional update code here
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();


		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;

      //Dirty thing, but lazy me
      y += 150;

		this.font.draw( 'x to mount base, z to spawn while mounted', x, y, ig.Font.ALIGN.CENTER );
        this.font.draw( 'Press 1 to toggle bounding boxes', x, y + 16, ig.Font.ALIGN.CENTER );
		this.font.draw( 'People Playing: '+this.getPersonList(), x, y + 32, ig.Font.ALIGN.CENTER );
	},

  _updateGamePad : function () {
    if (Gamepad.supported) {
      var gamepad = new Gamepad.getState(0);
      var mappings = [[ Math.round(gamepad.leftStickY) < 0 ? 1 : 0, ig.KEY.UP_ARROW ],
                      [ Math.round(gamepad.leftStickY) > 0 ? 1 : 0, ig.KEY.DOWN_ARROW ],
                      [ Math.round(gamepad.leftStickX) < 0 ? 1 : 0, ig.KEY.LEFT_ARROW ],
                      [ Math.round(gamepad.leftStickX) > 0 ? 1 : 0, ig.KEY.RIGHT_ARROW ],
                      [ gamepad.faceButton0, ig.KEY.Z],
                      [ gamepad.faceButton1, ig.KEY.X]
                      ];
      new Gamepad.magic(gamepad, mappings);
    }
  },

  addPerson : function (config) {
    var person = new Person(config);
    this.appendChild(person);
    return person;
  },

  getPersonList : function () {
    return this.children.map(function (person) { return person.handle }).join(", ");
  }
});

Nebula.inject(NodeSupport);

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', Nebula, 60, window.innerWidth, window.innerHeight, 1 );

});
