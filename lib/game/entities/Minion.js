ig.module(
    'game.entities.Minion'
)
.requires(
    'game.entities.actor',
    'game.entities.ViewRadius',
    'game.entities.ListenRadius',
    'vendor.Chameleon'
)
.defines(function(){

Minion = Actor.extend({

    // The players (collision) size is a bit smaller than the animation
    // frames, so we have to move the collision box a bit (offset)
    size: {x: 8, y:14},
    offset: {x: 0, y: 0},
    spriteOffset : {
      x : 3,
      y : 1
    },
    health    : 10,
    name      : "Minion",
    direction : 0,
    walkSpeed : 15,
    state     : 'walking',
    maxFollow : 5,
    _followed : 0,
    hue       : 0,

    maxVel: {x: 15, y: 15},

    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.ACTIVE,

    animSheet: new ig.AnimationSheet( 'media/minion.png', 16, 16),

    init: function( x, y, settings ) {
        this.parent( x, y, settings );

        // Add the animations
        this.addAnim( 'walkingDown', 0.1, [0,1,2,3,4,3,2,1] );
        this.addAnim( 'walkingUp'  , 0.1, [5,6,7,8,9,8,7,6] );

        // Spawn viewer object.
        this.viewRadius = ig.game.spawnEntity(ViewRadius,
                                        this.pos.x - 28, this.pos.y - 25, {
                                          radius : 64,
                                          priority : 50
                                        }
                                      );

        // This can be done much better. ViewRadius and ListenRadius change only
        // on size and collision check. Should generalize. But what do I know, it's 6AM
        this.listenRadius = ig.game.spawnEntity(ViewRadius,
                                               this.pos.x - 44, this.pos.y - 41, {
                                                radius   : 96,
                                                priority : 100,
                                                color    : "rgba(192, 192, 0, 0.25)"
                                               })

        this.appendChild(this.viewRadius);
        this.appendChild(this.listenRadius);
        // Spawn other viewer object.

        this._bindEvents();
    },

    update: function() {
        this._checkFollowing();
        this._setDirection();
        this._move();
        this._checkBounds();
        // move!
        this.parent();
    },

    collideWith : function (other, axis) {
      if (other.name === "Minion" && this.ancestor !== other.ancestor) {
        this.receiveDamage(1, other);
      }

      this.parent(other, axis);
    },

    shouldCollide : function (other) {
      if (other.name === "Minion" && this.ancestor === other.ancestor) {
        return false;
      }

      // This is temporary stuff. We should define something to differentiate
      // friendlies from non-friendlies. Probably a _player property with a
      // unique player ID for each player. (Instead of spawner and stuff)
      if (other.name === "Player") {
        return false;
      }
      return true;
    },

    draw : function () {
      this.parent();

      if (this.hue > 0 ) {
        var ctx, img, x, y, imageData, data, hue, i, hsvColor, finalRgb;

        ctx = ig.system.context;
        img = this.animSheet.image.data;
        x = this.pos.x;
        y = this.pos.y;
        imageData = ctx.getImageData(x + this.spriteOffset.x, y + this.spriteOffset.y, 16, 16)
        data = imageData.data;

        // Instead of changing hue, we could get the diff between source color and target color.
        for(i = 0; i < data.length; i += 4) {

          hsvColor = Chameleon.Color.RGBToHSV(data[i], data[i + 1], data[i + 2]);
          hsvColor.h = (hsvColor.h + this.hue ) % 360;
          finalRgb = Chameleon.Color.HSVToRGB(hsvColor.h, hsvColor.s, hsvColor.v);

          data[i] = finalRgb.r;
          data[i + 1] = finalRgb.g;
          data[i + 2] = finalRgb.b;
        }

        ctx.putImageData(imageData, this.pos.x, this.pos.y);
      }
    },

    kill : function () {
      this.parent();
      this.viewRadius.kill();
      this.listenRadius.kill();
      delete this.viewRadius;
      delete this.listenRadius;
    },

    _bindEvents : function () {
      var minion = this;
      minion.viewRadius.bind('spotted', function (ev) {
        if (ev.who.name === "Minion" && this.ancestor !== ev.who.ancestor) {
          if (minion.state !== 'idle') {
            minion._follow(ev.who, ev.priority);
          }
        }
      });
      minion.listenRadius.bind('spotted', function (ev) {
        if (ev.who.name === "View Radius" && ev.who.ancestor.ancestor === this.ancestor && ev.who.ancestor.state === "following") {
          if (minion.state !== 'idle') {
            minion._follow(ev.who.ancestor, ev.priority);
          }
        }
      });
    },

    // Starts following dude, if not following or if better priority.
    _follow : function (actor, priority) {
      var minion = this;

      // Don't even try to follow a saturated dude, dude.
      if (actor._followed >= minion.maxFollow) { return; }

      if (!minion.objective || minion.objective.priority > priority) {
        // this should be used for the swarming limit logic.
        actor._followed += 1;

        minion.objective = { target : actor, priority : priority };

        minion.__deathHandler = function (ev) {
          minion._unfollow();
        }

        minion.objective.target.bind('kill', minion.__deathHandler);
        minion.state = "following";
      }
    },

    // Stops following.
    _unfollow : function () {
      if (this.state === "following") {
        if (this.__deathHandler) {
          this.objective.targe -= 1;
          this.objective.target.unbind('kill', this.__deathHandler);
          delete this.__deathHandler;
        }
        this.objective = null;
        this.state = "walking";
      }
    },

    tintImage : function (tintColor) {
        var imgElement = document.getElementById("minion-shade");

        var ctx = ig.system.canvas;
        ctx.drawImage(imgElement,0,0);

        var map = ctx.getImageData(0,0,this.size.x, this.size.y);
        var imdata = map.data;

        // convert image to grayscale
        var r,g,b,avg;
        for(var p = 0, len = imdata.length; p < len; p+=4) {
            r = imdata[p]
            g = imdata[p+1];
            b = imdata[p+2];
            // alpha channel (p+3) is ignored

            avg = Math.floor((r+g+b)/3);

            imdata[p] = imdata[p+1] = imdata[p+2] = avg;
        }

        ctx.putImageData(map,0,0);

        // overlay filled rectangle using lighter composition
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.5;
        ctx.fillStyle=tintColor;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // replace image source with canvas data
        imgElement.src = canvas.toDataURL();
    },

    _move : function () {
      if (this.state === "walking" || this.state === "following") {
        this.accel.x = this.walkSpeed * Math.cos(this.direction);
        this.accel.y = this.walkSpeed * Math.sin(this.direction);
      }

      if (this.state === "idle") {
        this.accel = { x: 0 , y: 0}
      }
    },

    _setDirection : function () {
      var dx, dy, otherCenter, thisCenter;
      if (this.state === "following" && this.objective) {

        thisCenter = this.center();
        otherCenter = this.objective.target.center();

        dx = otherCenter.x - thisCenter.x;
        dy = otherCenter.y - thisCenter.y;

        this.direction = Math.atan2(dy, dx);
      }
    },

    _checkFollowing : function () {
      if (this.state === "following" && (!this.objective.target || this.objective.target._killed)) {
        delete this.objective;
        this.state = "walking";
      }
    },

    _checkBounds : function () {
      if ((this.pos.x + this.size.x < 0 ||
           this.pos.x > ig.system.width) && (
           this.pos.y + this.size.y < 0 ||
           this.pos.y > ig.system.height)) {
        this.kill();
      }
    }

});

});
