ig.module(
    'game.entities.Base'
)
.requires(
    'impact.entity'
)
.defines(function(){

Base = ig.Entity.extend({
    
    // The players (collision) size is a bit smaller than the animation
    // frames, so we have to move the collision box a bit (offset)
    size: {x: 8, y:14},
    offset: {x: 4, y: 2},
    
    maxVel: {x: 100, y: 200},
    friction: {x: 600, y: 0},
    
    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,
    
    animSheet: new ig.AnimationSheet( 'media/base.png', 96, 96 ), 

    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        
        // Add the animations
        this.addAnim( 'idle', 0.2, [0,1,2,1] );
    },

    update: function() {

        if( ig.input.pressed('spawn') ){
            console.log('>>>>>click');
            ig.game.spawnEntity( Minion, this.pos.x, this.pos.y ).finalPos = {x: ig.input.mouse.x, y: ig.input.mouse.y};
        }

        // move!
        this.parent();
    }
});

});