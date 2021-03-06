ig.module(
  'game.entities.actor'
)
.requires(
  'impact.entity',
  'vendor.CustomEventSupport',
  'vendor.NodeSupport',
  'game.states.say-hello'
)
.defines(function () {

  Actor = ig.Entity.extend({
    name : "Actor",
    health : 1,
    timer : new ig.Timer(),
    lastVel : {x: 0, y: 0},
    isSurrogate : false,
    update : function () {
      this.parent();
      this._updateLastVel();
      // TODO: if this guy isSurrogate, then just update from whatever
      // input we have. (e.g. bind to a socket and pull values from there)
    },
    draw : function () {
      this._drawBoundingBox();
      this.parent();
    },
    receiveDamage : function ( amount, from ) {
      if (amount < 0) {
        this.dispatch('beforeRecover', { amount : amount, from : from });
      } else {
        this.dispatch('beforeDamage', { amount : amount, from : from });
      }

      this.parent(amount, from);

      if (amount < 0) {
        this.dispatch('recover', { amount : amount, from : from });
      } else {
        this.dispatch('damage', { amount : amount, from : from });
      }
    },

    recover : function( amount, from ) {
      this.receiveDamage( -amount, from );
    },

    kill : function () {
      this.dispatch('beforeKill');
      this.parent();
      this.dispatch('kill');
    },

    center : function () {
      return { x : this.pos.x + this.offset.x + this.size.x / 2,
               y : this.pos.y + this.offset.y + this.size.y / 2 };
    },

    shouldCollide : function (other) {
      return true;
    },

    _updateLastVel : function () {
      this.lastVel.x = this.vel.x;
      this.lastVel.y = this.vel.y;
    },

    _drawBoundingBox : function () {
      var ctx, scale, x, y, sizeX, sizeY, center, centerX, centerY;

      // Only draw if explicitly told to.
      if (!ig.game.drawBoundingBox) { return; }

      ctx = ig.system.context;
      scale = ig.system.scale;
      x = this.pos.x * scale - ig.game.screen.x * scale;
      y = this.pos.y * scale - ig.game.screen.y * scale;
      sizeX = this.size.x * scale;
      sizeY = this.size.y * scale;

      ctx.save();
      ctx.fillStyle = this.color || "rgba(255,0,255,0.25)"
      ctx.fillRect(x,y,sizeX,sizeY);
      this.parent();
      ctx.restore();
    }
  });

  Actor.inject(CustomEventSupport);
  Actor.inject(NodeSupport);
});
