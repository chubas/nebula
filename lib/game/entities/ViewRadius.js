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
    collides: ig.Entity.COLLIDES.NEVER,
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

    _center : function () {
      this.pos.x = this.ancestor.pos.x - (this.size.x - this.ancestor.size.x) / 2;
      this.pos.y = this.ancestor.pos.y - (this.size.y - this.ancestor.size.y) / 2;
    }
  });
})
