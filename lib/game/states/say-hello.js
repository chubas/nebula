ig.module(
  'game.states.say-hello'
)
.defines(function () {
  SayHelloState = {
    stateName : "say-hello",
    update : function () {
      console.log("Hey, hello... I'm a state.");
    }
  }
});

