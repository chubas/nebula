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
    }
  });

  Actor.inject(CustomEventSupport);
  Actor.inject(NodeSupport);
});
