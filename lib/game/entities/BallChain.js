ig.module(
  'game.entities.ballchain'
)
.requires(
  'game.entities.actor'
).
defines(function() {

    BallChain = Actor.extend({

        // STATES:
        //
        // idle : swing
        // swinging : moving
        // moving : crashing, recalling, stopping
        // stopping : idle
        // crashing : idle

        size: {x: 8, y:14},
        offset: {x: 4, y: 2},

        maxVel: {x: 100, y: 200},
        friction: {x: 600, y: 0},

        type: ig.Entity.TYPE.A, // Player friendly group
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet( 'media/player.png', 8, 8 ),

        state : 'idle',

        init: function( x, y, settings ) {
            this.parent( x, y, settings );

            // Add the animations
            this.addAnim( 'idle', 1, [0] );
            this.addAnim( 'run', 0.07, [0,1,2,3,4,5] );
            this.addAnim( 'jump', 1, [9] );
            this.addAnim( 'fall', 0.4, [6,7] );
        },

        update: function() {
            // move!
            this.parent();
        }

    });
});