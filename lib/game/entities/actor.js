ig.module(
  'game.entities.actor'
)
.requires(
  'impact.entity'
)
.defines(function () {

  EntityActor = ig.Entity.extend({
    name : 'Generic Actor'
  });
});
