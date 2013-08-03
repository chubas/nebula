ig.module(
  'game.entities.BallChain'
)
.requires(
    'game.entities.Weapon'
).
defines(function() {

  BallChain = Actor.extend({

    // STATES:
    //
    // idle : swing
    // swinging : moving
    // moving : crashing, recalling, stopping

    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,

    color : 'rgba(255, 0, 0, 0.8)',

    state : 'idle',

    swingingSpeed : 4, // 1 degree per frame
    swingingFrame : 0,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.state = 'swinging';
      this.direction = 0;
    },

    update: function() {
      this.parent();
      if(this.state == 'swinging') {
        this.swingingFrame++;
      } else {
        this.swingingFrame = 0;
      }
    },

    draw : function() {
      this.parent();

      var ctx, scale, center, radius, x, y, squareSize, angle;

      ctx = ig.system.context;
      scale = ig.system.scale;
      center = this.center();

      if(this.state == 'swinging') {
        radius = 46;
        squareSize = 12;

        angle = (this.swingingSpeed * this.swingingFrame) % 360;
        angle = angle * 0.0174532925; // Deg to radians

        x = center.x + radius * Math.cos(angle);
        y = center.y + radius * Math.sin(angle);

        ctx.save();
        ctx.fillStyle = "#ff0";
        ctx.fillRect(x,y,squareSize,squareSize);
        ctx.restore();
      } else {

      }
    }

  });
});