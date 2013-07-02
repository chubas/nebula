ig.module(
  'game.entities.ListenRadius'
)
.requires(
  'game.entities.actor'
)
.defines(function () {
  ListenRadius = Actor.extend({
    name  : "Listen Radius",
    color : "rgba(192,192,0,0.25)",
    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.NEVER,
    update : function () {
      this._center();
      this.parent();
    },
    check : function (other) {
      if (other.name === "Listen Radius" && this.ancestor.spawner === other.ancestor.spawner && other.ancestor.state === "following") {
        this.dispatch("spotted", { who : other.ancestor.objective.target, priority : 100});
      }
      this.parent();
    },

    _center : function () {
      this.pos.x = this.ancestor.pos.x - (this.size.x - this.ancestor.size.x) / 2;
      this.pos.y = this.ancestor.pos.y - (this.size.y - this.ancestor.size.y) / 2;
    }
  });
})
