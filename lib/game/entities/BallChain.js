ig.module(
  'game.entities.BallChain'
)
.requires(
  'game.entities.Weapon',
  'game.entities.Ball'
).
defines(function() {

  BallChain = Actor.extend({

    // STATES:
    //
    // idle : swing
    // swinging : moving
    // moving : crashing, recalling, stopping

    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.NONE,

    color : 'rgba(255, 0, 0, 0.8)',

    state : 'idle',

    _swingingSpeed : 4, // degrees per frame
    _swingingFrame : 0,

    _radius : 46,
    _ballSize :12,

    _ballCenterX : 0,
    _ballCenterY : 0,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      var ball = ig.game.spawnEntity(Ball, x, y, {
        name : 'ball'
      });
      this.appendChild(ball);
      this.state = 'swinging';
      this.direction = 0;
    },

    update: function() {
      this.parent();

      if(this.state == 'swinging') {
        this._swingingFrame++;
      } else {
        this._swingingFrame = 0;
      }

      this._updateBallCenter();
      this.ball.pos.x = this._ballCenterX;
      this.ball.pos.y = this._ballCenterY;
    },

    _updateBallCenter : function() {
      var angle = (this._swingingSpeed * this._swingingFrame) % 360;
      angle = angle * 0.0174532925; // Deg to radians
      var center = this.center();
      this._ballCenterX = center.x - (this.size.x / 2) + this._radius * Math.cos(angle);
      this._ballCenterY = center.y - (this.size.y / 2) + this._radius * Math.sin(angle);
    }

    // draw : function() {
    //   this.parent();

    //   var ctx = ig.system.context;

    //   if(this.state == 'swinging') {
    //     ctx.save();
    //     ctx.fillStyle = "#ff0";
    //     ctx.fillRect(this._ballCenterX, this._ballCenterY, this._ballSize, this._ballSize);
    //     ctx.restore();
    //   }
    // }

  });
});