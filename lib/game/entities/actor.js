ig.module(
  'game.entities.actor'
)
.requires(
  'impact.entity',
  'vendor.CustomEventSupport',
  'vendor.NodeSupport',
  'game.StateSupport',
  'game.states.say-hello'
)
.defines(function () {

  Actor = ig.Entity.extend({
    name : 'Generic Actor',
    init : function () {
      this.registerState(SayHelloState);
    },

    update : function () {
      this.stateCall('update');
    },
    render : function () {
      this.stateCall('render');
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

    recover : function( amount, from ) {
      this.receiveDamage( -amount, from );
    },

    kill : function () {
      this.dispatch('beforeKill');
      this.parent();
      this.dispatch('kill');
    }
  });

  Actor.inject(CustomEventSupport);
  Actor.inject(NodeSupport);
  Actor.inject(StateSupport);
});
