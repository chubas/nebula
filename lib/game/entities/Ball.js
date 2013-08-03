ig.module(
  'game.entities.Ball'
)
.requires(
  'game.entities.actor'
)
.defines(function() {

Ball = Actor.extend({

  size: {x:12, y:12},
  offset: {x:0, y:0},
  spriteOffset : {x:6, y:6},
  name: "Ball",

  type: ig.Entity.TYPE.A, // Player friendly group
  checkAgainst: ig.Entity.TYPE.A,
  collides: ig.Entity.COLLIDES.PASSIVE,

  animSheet: new ig.AnimationSheet('media/ball.png', 12, 12),

  init: function( x, y, settings ) {
    // Add animations for the animation sheet
    this.addAnim( 'idle', 1, [0] );

    // Call the parent constructor
    this.parent( x, y, settings );
  }

});

});
