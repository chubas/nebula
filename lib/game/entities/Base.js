ig.module(
    'game.entities.Base'
)
.requires(
    'game.entities.actor'
)
.defines(function(){

Base = Actor.extend({

    // The players (collision) size is a bit smaller than the animation
    // frames, so we have to move the collision box a bit (offset)
    name : "Base",
    size: {x: 8, y:14},
    offset: {x: 4, y: 2},

    maxVel: {x: 100, y: 200},
    friction: {x: 600, y: 0},

    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NONE,

    animSheet: new ig.AnimationSheet( 'media/base.png', 96, 96 ),

    init: function( x, y, settings ) {
        this.parent( x, y, settings );

        // Add the animations
        this.addAnim( 'idle', 0.2, [0,1,2,1] );
    },

    update: function() {

        // TODO: a spawn method. spawn entities but not random direction.
        // rather use this.direction to calculate a probabilistic angle
        // where closer to direction is more probable, and further is
        // increasingly rare, but non-zero.
        if( ig.input.state('spawn') ){
            ig.game.spawnEntity( Minion, this.pos.x + 48, this.pos.y + 48, {
              direction : Math.random() * 2 * Math.PI,
              spawner : this
            });
        }

        // move!
        this.parent();
    }
});

});
