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
    offset: {x: 16, y: 16},
    direction : 0,
    directionStep : 0.1,

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
        var x, y;

        // TODO: a spawn method. spawn entities but not random direction.
        // rather use this.direction to calculate a probabilistic angle
        // where closer to direction is more probable, and further is
        // increasingly rare, but non-zero.
        if( ig.input.state('spawn') ){
          x = this.pos.x + this.offset.x + this.size.x / 2;
          y = this.pos.y + this.offset.y + this.size.y / 2;
            ig.game.spawnEntity( Minion, x, y, {
              direction : this._calculateSpawnDirection(),
              spawner : this
            });
        }

        if ( ig.input.state('left') ) {
          this._rotate(-this.directionStep);
          console.log(this.direction);
        }

        if ( ig.input.state('right') ) {
          this._rotate(this.directionStep);
        }

        // move!
        this.parent();
    },

    draw : function () {
      this.parent();
      this._drawDirection();
    },

    _calculateSpawnDirection : function () {
      return this.direction + Math.random() * Math.PI / 2;
    },

    _rotate : function (amount) {
      var mod = Math.PI * 2;
      this.direction = (((amount + this.direction) % mod) + mod ) % mod;
    },

    _drawDirection : function () {
      var ctx, scale, center, radius, x, y, squareSize;

      ctx = ig.system.context;
      scale = ig.system.scale;
      center = this.center();
      radius = 100;
      squareSize = 5;

      x = center.x + radius * Math.cos(this.direction);
      y = center.y + radius * Math.sin(this.direction);

      ctx.save();
      ctx.fillStyle = "#f0f"
      ctx.fillRect(x,y,squareSize,squareSize);
      ctx.restore();
    }
});

});
