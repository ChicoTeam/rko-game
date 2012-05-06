/* -----

game object
   
------   */

/*-------------------
a / entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    // constructor
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
 
        // set the walking & jumping speed
        this.setVelocity(4, 4);

        this.gravity = 0;
	
       	this.updateColRect(16,32,44,20);	

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
        // flag to determine if character is in a conversation
        this.isInConveration = false;

        this.says = "";

        //-------------waypoint stuff
        this.waypoint = { x: this.pos.x, y: this.pos.y };
        this.calculateCenter();
        //-------------end waypoint stuff
    },

    /**
    helper function to calculate the center of the player sprite
    */
    calculateCenter: function() {
        this.center = { x: ((this.pos.x - me.game.viewport.pos.x ) * 2 + this.width)/2,
                        y: ((this.pos.y - me.game.viewport.pos.y ) * 2 + this.height)/2 };
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

    /**
     * helper function for platform games
     * make the entity move left or right
     * @param {Boolean} left will automatically flip horizontally the entity sprite
     */
    doWalk2: function(direction) {

        switch(direction) {
            case 'up':
                this.vel.y = -this.accel.y * me.timer.tick;
                break;
            case 'down':
                this.vel.y = this.accel.y * me.timer.tick;
                break;
            case 'left':
                this.vel.x = -this.accel.x * me.timer.tick;
                this.flipX(true);
                break;
            case 'right':
                this.vel.x = this.accel.x * me.timer.tick;
                this.flipX(false);
                break;
            case 'stopx':
                this.vel.x = 0;
                break;
            case 'stopy':
                this.vel.y = 0;
                break;
            default:
                this.vel.y = 0;
                this.vel.x = 0;
                break;
        }
    },

    /* -----
    updates the waypoint associated with the player
    ----- */
    updateWaypoint: function(pos) {
        //console.log(this.center);
        if (pos.x == -1 && pos.y == -1)
        {
            this.waypoint = this.center;
	    //me.game.viewport.move(this.center.x-me.game.viewport.getWidth()/2,this.center.y-me.game.viewport.getHeight()/2);		
            //console.log('stop');
        }
        else
        {
            this.waypoint = pos;
	    //me.game.viewport.move(pos.x-me.game.viewport.getWidth()/2,pos.y-me.game.viewport.getHeight()/2);
            //console.log('start');
        }
	
    },

    /* -----
    updates the waypoint to a position so the player will stop moving,
        this is called when the mouse up event is fired from main.js
    ----- */
    /*
    updateWaypoint: function() {
        //might need to recalc center
        this.waypoint.x = this.center.x;
        this.waypoint.y = this.center.y;
        console.log('noargs');
    },
    */

    /* -----
    Helper function that checks if the point (waypoint) passed is contained by the players sprite
    Returns: true if the point is bounded by the player's sprite, otherwise false
    ----- */
    isBounded: function(point) {
        this.calculateCenter();

        if (this.pos.x < point.x && point.x < (this.pos.x + this.width) &&
            this.pos.y < point.y && point.y < (this.pos.y + this.height) )
        {
            return true;
        }

        return false;
    },

    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
 
        /*
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
        */

        if (!this.isBounded(this.waypoint))
        {
            if (this.center.x < this.waypoint.x)
                this.doWalk2('right');
            else if (this.center.x > this.waypoint.x)
                this.doWalk2('left');
            else
                this.doWalk2('stopx');

            if (this.center.y < this.waypoint.y)
                this.doWalk2('down');
            else if (this.center.y > this.waypoint.y)
                this.doWalk2('up');
            else
                this.doWalk2('stopy');
        }
        else
        {
            //waypoint is bounded, so need to stop movement
            this.doWalk2('');
        }

        // check & update player movement
        this.updateMovement();
 
        // check for collision
        var res = me.game.collide(this);
        if (res) {
            // if we collide with an enemy
             if (res.obj.type == me.game.ENEMY_OBJECT) 
	     {
		     this.pos.sub(res);
	     }

            
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
            obj.saysLast = "";
            obj.isInConveration = true;
 
            $('#sandbox').show();
            window.sandbox.model.destroy();
            window.sandbox.model.on('sync', function(){
                var lastHistory = _.last(window.sandbox.model.get('history'));
                if(lastHistory) {
                    var lastResult = lastHistory.result || "";
                    obj.says = eval(lastResult);
                }
            });
        }

        if (this.step != 0)
            this.saysLast = this.says;

        //this.says = this.conversations[this.step].initial;

        if (obj.says != obj.saysLast && this.step < this.conversations.length-1 && 
            obj.says.toString().match(this.conversations[this.step].expected) != null &&
            obj.says.toString().indexOf('Error') < 0)
        {
            this.step++;
            obj.saysLast = obj.says;
            this.says = this.conversations[this.step].initial;
        }
        else if (obj.says != obj.saysLast && 
            obj.says.toString().match(this.conversations[this.step].expected) == null)
        {
            this.says = this.conversations[this.step].incorrect;
            obj.saysLast = obj.says;
        }
    
        /*
        // conversation steps
        switch(this.step) {
            case 0:
                this.says = this.conversations[0].initial;
                if (obj.says.match(this.conversations[0].expected) != null)
                    this.step++;
                break;
                this.says = "Hi! (type \"Hi!\" to say hi back)";
                if (obj.says == 'Hi!')
                    this.step++;
                break;
            case 1:
                this.says = this.conversations[0].initial;
                if (obj.says.match(this.conversations[0].expected) != null)
                    this.step++;
                break;
                this.says = "I\'m Joe. What is your name?";
                if (obj.says != 'Hi!' && obj.says != obj.saysLast && typeof(obj.says) == "string" && obj.says.indexOf('Error') < 0)
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
        */

        // only say something if it hasn't already been said
        if (this.saysLast !== this.says) {
            console.log(this.says);
            // $('#sandbox textarea[placeholder]').attr('placeholder', this.says);
            // var command = "'"+this.says+"'";
            window.sandbox.model.addHistory({
                command : 'Joe says:',
                result : this.says
            });
            window.sandbox.update();
            obj.saysLast = obj.says;
            this.saysLast = this.says;
        }
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
            // update object animation
            this.parent(this);
            return true;
        }
        return false;
    },

    //updates the convos
    setConversations: function(convos) {
       this.conversations = convos;
       this.says = this.conversations[0].initial;
    }
});


// define object that can draw text on screen
var HUDtextObject = me.HUD_Item.extend(
{
   // constructor
   init: function(x, y)
   {
      // call the parent constructor
      this.parent(x, y);
      // create a font
      this.font = new me.Font("Courier New", 18, "white", "center");
   },
   // draw function
   draw : function (context, x, y)
   {
      this.font.draw (context, this.value, this.pos.x +x, this.pos.y +y);
   }
});



var ConsoleButton = me.ScreenObject.extend({
    showConsole: function() {
        if($('#sandbox').is(':visible')) {
            setTimeout(function(){
                $('#sandbox').hide();
                window.sandbox.model.destroy();
            },150);
        }
        else {
            setTimeout(function(){
                $('#sandbox').show();
            },150);                 
        }
        return false;
    },
    // constructor
    init: function(x, y, x_offset, y_offset) {
        this.parent(true);
        this.x = x;
        this.y = y;
        this.width = 45;
        this.height = 45;

        // init button image
        this.image = null;

        // represents the clickable area (the button image)
        this.rect = new me.Rect(
            new me.Vector2d(this.x + x_offset, this.y + y_offset), 
            this.width, this.height
            );

        // set up mouse click binding
        me.input.registerMouseEvent('mousedown', this.rect, this.showConsole);
    },

    onResetEvent: function() {
        
    },
 
    update: function() {
    },
 
    draw: function(context) {
        if (this.image == null) {
            // init stuff if not yet done
            this.image = me.loader.getImage("console_button"); 
        }
        context.drawImage(this.image, this.x, this.y);
    },
 
    onDestroyEvent: function() {
    
    }
});

