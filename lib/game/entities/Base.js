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
    size: {x: 96, y:96},
    offset: {x: 0, y: 0},
    direction : 0,
    directionStep : 0.1,
    state : "idle",

    maxVel: {x: 100, y: 200},
    friction: {x: 600, y: 0},

    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.A,
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
        if (this.state === "aiming") {
          if( ig.input.state('action') ){
            x = this.pos.x + this.offset.x + this.size.x / 2;
            y = this.pos.y + this.offset.y + this.size.y / 2;
              this._spawnMinion({
                x : x,
                y : y,
                direction : this._calculateSpawnDirection(),
                hue : Math.random()*256
              });
          }

          if ( ig.input.state('left') ) {
            this._rotate(-this.directionStep);
          }

          if ( ig.input.state('right') ) {
            this._rotate(this.directionStep);
          }
        }

        // move!
        this.parent();
    },

    draw : function () {
      this.parent();
      this._drawDirection();
    },

    check : function ( other ) {
      if (other.name === "Player") {
        if (ig.input.pressed('interact')) {
          if (this.state !== 'aiming') {
            this.state = 'aiming';
            this._mount(other);
          } else {
            this.state = "idle";
            this._unmount();
          }
        }
      }
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
      ctx.fillStyle = "#f0f";
      ctx.fillRect(x,y,squareSize,squareSize);
      ctx.restore();
    },

    _mount : function (actor) {
      this._mount = actor;
      this._centerMount();
    },

    _unmount : function (actor) {
      delete this._mount;
    },

    _centerMount : function () {
      var center = this.center();
      this._mount.pos.x = center.x - this._mount.size.x / 2;
      this._mount.pos.y = center.y - this._mount.size.y / 2;
    },

    _spawnMinion : function (config) {
      this.dispatch('spawn', config);
    }
});

});
