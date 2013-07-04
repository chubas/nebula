ig.module(
    'game.Person'
)
.requires(
    'vendor.CustomEventSupport',
    'vendor.NodeSupport'
)
.defines(function(){

Person = ig.Class.extend({
  name : "",
  handle : null,
  score : 0,
  spawn : {
    player : { x : 300, y : 200 },
    base : { x : 300, y : 200}
  },

  init : function (config) {
    ig.merge(this, config);

    // Give 'em a handle.
    if (!this.handle) {
      this.handle = "Anon"+ Math.floor(Math.random() * 10000);
    }

    this.start();
  },

  start : function () {
    this.score = 0;
    this.spawnBase();
    this.spawnPlayer();
  },

  // Ensure only one player.
  spawnPlayer : function (x, y) {
    x = typeof x === "undefined" ? this.spawn.player.x : x;
    y = typeof y === "undefined" ? this.spawn.player.y : y;

    if (!this.player) {
        this.player = ig.game.spawnEntity( Player, x, y );
        this.appendChild(this.player);
    }
  },

  spawnBase : function (x, y) {
    var person = this;

    x = typeof x === "undefined" ? this.spawn.base.x : x;
    y = typeof y === "undefined" ? this.spawn.base.y : y;

    if (!this.base) {
      this.base = ig.game.spawnEntity( Base, this.spawn.base.x, this.spawn.base.y );
      this.appendChild(this.base);

      this.base.bind('spawn', function (ev) {
        person.spawnMinion( ev.x, ev.y, {
          direction : ev.direction,
        });
      })
    }
  },

  spawnMinion : function (x, y, options) {
    this.appendChild(ig.game.spawnEntity( Minion, x, y, options ));
  }
});

Person.inject(CustomEventSupport);
Person.inject(NodeSupport);

});
