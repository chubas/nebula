ig.module(
  'game.entities.ViewRadius'
)
.requires(
  'game.entities.actor'
)
.defines(function () {
  /*
   * This class is a simple radius (square :P) that dispatches a spotted
   * redraw when something is spotted.
   *
   * Properties:
   * priority
   * radius
   */
  ViewRadius = Actor.extend({
    name         : "View Radius",
    color        : "rgba(192,0,0,0.5)",
    type         : ig.Entity.TYPE.A, // Player friendly group
    checkAgainst : ig.Entity.TYPE.A,
    collides     : ig.Entity.COLLIDES.NEVER,
    priority     : 0,
    radius       : 16,

    init : function (x, y, settings) {
        this.parent( x, y, settings );

        this.size.x = this.radius;
        this.size.y = this.radius;
    },

    update : function () {
      this._center();
      this.parent();
    },
    check : function (other) {
      this.dispatch("spotted", { who : other, priority : this.priority });
      this.parent();
    },

    _center : function () {
      this.pos.x = this.ancestor.pos.x - (this.size.x - this.ancestor.size.x) / 2;
      this.pos.y = this.ancestor.pos.y - (this.size.y - this.ancestor.size.y) / 2;
    }
  });
})
