/* -----

game object
   
------   */

/*-------------------
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    // constructor
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
 
        // set the walking & jumping speed
        this.setVelocity(4, 4);

        this.gravity = 0;
	
       	this.updateColRect(8,48,-1,0);	
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
        // flag to determine if character is in a conversation
        this.isInConveration = false;

        this.says = "";
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
 
        // check for collision
        var res = me.game.collide(this);
        if (res) {
            // if we collide with an enemy
            // if (res.obj.type == me.game.ENEMY_OBJECT) {
            //     console.log("collision");
            // }
        }
        else if (this.isInConveration) {
            this.isInConveration = false;
            //console.log("player left conversation");
        }

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }
 
});



/* --------------------------
an enemy Entity
------------------------ */
var EnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "wheelie_right";
        settings.spritewidth = 64;
 
        // call the parent constructor
        this.parent(x, y, settings);
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
 
        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
 
        // keep it from falling off the map (lol)
        this.gravity = 0;

        // make it collidable
        this.collidable = true;

        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
        if (!obj.isInConveration) {
            this.step = 0;
            obj.isInConveration = true;
            obj.saysLast = obj.says;

            $('#sandbox').show();
            window.sandbox.model.on('sync', function(){
                obj.says = eval(_.last(window.sandbox.model.get('history')).result);
            });

        }
        this.saysLast = this.says;

        // conversation steps
        switch(this.step) {
            case 0:
                this.says = "Hi! (type 'Hi!' to say hi back)";
                if (obj.says == 'Hi!')
                    this.step++;
                break;
            case 1:
                this.says = "I'm Joe. What is your name?";
                if (obj.says != 'Hi!')
                    this.step++;
                break;
            case 2:
                this.says = "Nice to meet you, " + obj.says;
                obj.name = obj.says;
                this.step++;
                break;
            // case 3:
            //     this.says = "So... what's up?";
            //     break;
        }

        // only say something if it hasn't already been said
        if (this.saysLast !== this.says) {
            console.log(this.says);
            window.sandbox.placeholder = this.says;
            window.sandbox.render();
        }


        // me.state.pause();
    },
 
    // manage the enemy movement
    update: function() {
        // do nothing if not visible
        if (!this.visible)
            return false;
 
        // check and update movement
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
