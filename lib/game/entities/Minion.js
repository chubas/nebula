ig.module(
    'game.entities.Minion'
)
.requires(
    'impact.entity'
)
.defines(function(){

Minion = ig.Entity.extend({
    
    // The players (collision) size is a bit smaller than the animation
    // frames, so we have to move the collision box a bit (offset)
    size: {x: 8, y:14},
    offset: {x: 4, y: 2},
    
    finalPos : {x:0,y:0},

    maxVel: {x: 100, y: 200},
    friction: {x: 600, y: 0},
    
    type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,
    
    animSheet: new ig.AnimationSheet( 'media/minion.png', 16, 16 ), 

    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        
        // Add the animations
        this.addAnim( 'walkingDown', 0.1, [0,1,2,3,4,3,2,1] );
        this.addAnim( 'walkingUp'  , 0.1, [5,6,7,8,9,8,7,6] );
    },

    update: function() {

        this.goTo( this.finalPos.x, this.finalPos.y );

        // move!
        this.parent();
    },

    goTo : function(x,y){
        this.mySpeed = 50+Math.floor((Math.random()*50)+1);

        x = ig.input.mouse.x;
        y = ig.input.mouse.y;

        this.pos.x += (x-this.pos.x)/this.mySpeed;
        this.pos.y += (y-this.pos.y)/this.mySpeed;

        if(y < this.pos.y){
            this.currentAnim = this.anims.walkingUp;
        }else{
            this.currentAnim = this.anims.walkingDown;
        }
    },

    tintImage : function (tintColor) {
        var imgElement = document.getElementById("minion-shade");

        var ctx = ig.system.canvas;
        ctx.drawImage(imgElement,0,0);

        var map = ctx.getImageData(0,0,ig.system.realWidth,ig.system.realHeight);
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
    }

});

});