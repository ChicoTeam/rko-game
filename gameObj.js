/* -----

game object
   
------   */

/*-------------------
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
 
        // set the walking & jumping speed
        this.setVelocity(4, 4);

        this.gravity = 0;
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
    },
 

    /**
     * helper function for platform games
     * make the entity move left or right
     * @param {Boolean} left will automatically flip horizontally the entity sprite
     */
    doWalk: function(direction) {

        switch(direction) {
            case 'up':
                this.vel.x = 0;
                this.vel.y = -this.accel.y * me.timer.tick;
                break;
            case 'down':
                this.vel.x = 0;
                this.vel.y = this.accel.y * me.timer.tick;
                break;
            case 'left':
                this.vel.y = 0;
                this.vel.x = -this.accel.x * me.timer.tick;
                this.flipX(true);
                break;
            case 'right':
                this.vel.y = 0;
                this.vel.x = this.accel.x * me.timer.tick;
                this.flipX(false);
                break;
            default:
                this.vel.y = 0;
                this.vel.x = 0;
                break;
        }
    },

    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
 
        if (me.input.isKeyPressed('left')) {
            this.doWalk('left');
        } else if (me.input.isKeyPressed('right')) {
            this.doWalk('right');
        } else if (me.input.isKeyPressed('up')) {
            this.doWalk('up');
        } else if (me.input.isKeyPressed('down')) {
            this.doWalk('down');
        } else {
            this.vel.y = 0;
            this.vel.x = 0;
        }

        // check & update player movement
        this.updateMovement();
 
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }
 
});
