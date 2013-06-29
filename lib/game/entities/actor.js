ig.module(
  'game.entities.actor'
)
.requires(
  'impact.entity',
  'vendor.CustomEventSupport',
  'vendor.NodeSupport'
)
.defines(function () {

  Actor = ig.Entity.extend({
    name : 'Generic Actor',
    update : function () {
      console.log("Hi");
    },
    receiveDamage : function ( amount, from ) {
      if (amount < 0) {
        this.dispatch('beforeRecover', { amount : amount, from : from });
      } else {
        this.dispatch('beforeDamage', { amount : amount, from : from });
      }

      this.parent();

      if (amount < 0) {
        this.dispatch('recover', { amount : amount, from : from });
      } else {
        this.dispatch('damage', { amount : amount, from : from });
      }
    },

    kill : function () {
      this.dispatch('beforeKill');
      this.parent();
      this.dispatch('kill');
    }
  });

  Actor.inject(CustomEventSupport);
  Actor.inject(NodeSupport);
});

.receiveDamage( amount, from )
