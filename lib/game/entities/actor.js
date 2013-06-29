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
    name : 'Generic Actor'
  });

  Actor.inject(CustomEventSupport);
  Actor.inject(NodeSupport);

});
