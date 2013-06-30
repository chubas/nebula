ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

    'game.entities.Base',
    'game.entities.Minion',
    'game.entities.actor'
)
.defines(function(){

MyGame = ig.Game.extend({

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),


	init: function() {
		// Initialize your game here; bind keys etc.
        // Spawn base (MAin generator)
        ig.game.spawnEntity( Base, 100, 100 );

        // Spawn Idle minions, they will be the anchors.
        dude1 = ig.game.spawnEntity( Minion, 25, 25, { state : "idle" });
        dude2 = ig.game.spawnEntity( Minion, 275, 25, { state : "idle" });
        dude3 = ig.game.spawnEntity( Minion, 25, 200, { state : "idle" });
        dude4 = ig.game.spawnEntity( Minion, 275, 200, { state : "idle" })

        ig.input.initMouse();

        ig.input.bind( ig.KEY.SPACE, 'spawn' );
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		// Add your own, additional update code here
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();


		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;

		this.font.draw( 'Press Space to test swarming minions.', x, y, ig.Font.ALIGN.CENTER );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
