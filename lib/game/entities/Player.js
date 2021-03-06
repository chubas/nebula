ig.module(
    'game.entities.Player'
)
.requires(
    'game.entities.actor'
)
.defines(function(){

Player = Actor.extend({

    // The players (collision) size is a bit smaller than the animation
    // frames, so we have to move the collision box a bit (offset)
    name : "Player",
    size: {x: 16, y: 16},
    offset: {x: 0, y: 0},
    direction : 0,
    walkSpeed : 60,

    maxVel: {x: 75, y: 75},
    friction: {x: 100, y: 100},

    weapon: null,
    isControllable : false,
    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        var weapon = ig.game.spawnEntity(BallChain, x - 40, y - 40, { name : 'weapon' });
        this.appendChild(weapon);

        this.followRadius = ig.game.spawnEntity(ViewRadius,
                                             this.pos.x - 40,
                                             this.pos.y - 40, {
                                             radius : 96,
                                             priority : 75
                                             });
        this.appendChild(this.followRadius);
    },

    update: function() {
      if (this.isControllable === false) {
        return;
      }

      if( ig.input.state === 'action' && this.state !== 'aiming' ) {

      } else if ( this.state !== "aiming") {

        if ( ig.input.state('left') ) {
          this.vel.x = -this.maxVel.x;
        }

        if ( ig.input.state('right') ) {
          this.vel.x = this.maxVel.x;
        }

        if ( ig.input.state('down') ) {
          this.vel.y = this.maxVel.y;
        }

        if ( ig.input.state('up') ) {
          this.vel.y = -this.maxVel.y;
        }

        if ( !ig.input.state('left') && !ig.input.state('right')) {
          this.vel.x = 0;
        }

        if ( !ig.input.state('up') && !ig.input.state('down')) {
          this.vel.y = 0;
        }
      } else {
        this.vel = {x: 0, y: 0};
      }

      // move!
      this.weapon.pos.x = this.pos.x + (this.size.x / 2) - (this.weapon.size.x / 2);
      this.weapon.pos.y = this.pos.y + (this.size.y / 2) - (this.weapon.size.y / 2);

      this.parent();
    },

    check : function (other) {
      // This can surely be put better.
      if (other.name === "Base") {
        if (ig.input.pressed('interact') && this.isControllable) {
          if (this.state !== "aiming") {
            if (other.state !== "aiming") {
              this.state = "aiming";
              this.vel = {x: 0, y: 0};
              this.accel = {x: 0, y: 0};
            }
          } else {
            this.state = "idle";
          }
        }
      }
    },

    draw : function () {
      var ctx, scale, x, y, sizeX, sizeY, center, centerX, centerY;

      ctx = ig.system.context;
      scale = ig.system.scale;
      x = this.pos.x * scale - ig.game.screen.x * scale;
      y = this.pos.y * scale - ig.game.screen.y * scale;
      sizeX = this.size.x * scale;
      sizeY = this.size.y * scale;

      ctx.save();
      ctx.fillStyle = '#4d4';
      ctx.fillRect(x,y,sizeX,sizeY);
      this.parent();
      ctx.restore();
    }
});

});
