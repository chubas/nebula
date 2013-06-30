ig.module(
  'game.StateSupport'
)
.defines(function () {
  StateSupport = {
  	_registeredStates : [],
  	_states : [],
  	registerState : function (state) {
  		this._registeredStates.push(state);
  	},

  	unregisterState : function (state) {
  		var i;

  		i = this._states.indexOf(state);
  		this._registeredStates.splice(i, 1);
  	},

  	_currentState : function () {
  		if (this._states.length > 0 )  {
	  		return this._states[this._states.length - 1];
  		}
  	},

  	setState : function (stateName) {
  		var foundState;

  		foundState = this.findState(stateName);

  		if (foundState) {
  			if (this._states.length > 0) {
  				this._states[this._states.length-1] = foundState;
  			} else {
  				this._states.push(foundState);
  			}
  			this.dispatch('changedState', this._currentStateName(), foundState.stateName);
  		}
  	},

  	pushState : function (stateName) {
  		var foundState = this.findState(stateName);

  		if (foundState) {
        this.dispatch('changedState', this._currentStateName(), foundState.stateName);
  			this._states.push(foundState);
  		}
  	},

  	popState : function () {
      var foundName;

      if (this._states.length > 1) {
        foundName = this._states[this._states.length - 2].stateName
      }

      this.dispatch('changedState', this._currentStateName(), foundName);
  		this._states.pop();
  	},

  	findState : function (stateName) {
  		return this._registeredStates.filter( function (state) {
  			return state.stateName === stateName;
  		})[0];
  	},

    stateCall : function (methodName) {
      var foundState = this._currentState();

      if (foundState && foundState[methodName]) {
        foundState[methodName].apply(this, Array.prototype.slice.call(arguments, 1, arguments.length));
      }
    },

    _currentStateName : function () {
      var foundState = this._currentState();
      if (foundState) {
        return foundState.stateName;
      }
    }
  }
});


