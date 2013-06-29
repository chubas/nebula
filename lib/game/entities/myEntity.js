ig.module(
    'game.entities.myEntity'
)
.requires(
    'impact.entity'
)
.defines(function(){

MyEntity = ig.Entity.extend({
    
    // The players (collision) size is a bit smaller than the animation
    // frames, so we have to move the collision box a bit (offset)
    size: {x: 8, y:14},
    offset: {x: 4, y: 2},
    
    maxVel: {x: 100, y: 200},
    friction: {x: 600, y: 0},
    
    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,
    
    animSheet: new ig.AnimationSheet( 'media/minion.png', 16, 16 ), 
    
    
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        
        // Add the animations
        this.addAnim( 'idle', 0.1, [0,1,2,3] );
    },
    
    
    update: function() {
        
        this.accel.x = 10 ;
        // this.accel.y = (ig.input.mouse.y - this.pos.y)*25 ;

        // move!
        this.parent();
    }
});

});