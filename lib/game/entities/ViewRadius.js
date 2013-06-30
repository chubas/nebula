ig.module(
  'game.entities.ViewRadius'
)
.requires(
  'game.entities.actor'
)
.defines(function () {
  ViewRadius = Actor.extend({
    color : "rgba(192,0,0,0.5)",
    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    update : function () {
      this._center();
      this.parent();
    },
    check : function (other) {
      if (other.name === "Minion" && this.ancestor.spawner !== other.spawner) {
        this.dispatch("spotted", { who : other, priority : 50});
      }
      this.parent();
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
      ctx.fillStyle = this.color;
      ctx.fillRect(x,y,sizeX,sizeY);
      ctx.fillStyle = "#f0f"
      this.parent();
      ctx.restore();
    },

    _center : function () {
      this.pos.x = this.ancestor.pos.x - (this.size.x - this.ancestor.size.x) / 2;
      this.pos.y = this.ancestor.pos.y - (this.size.y - this.ancestor.size.y) / 2;
    }
  });
})
