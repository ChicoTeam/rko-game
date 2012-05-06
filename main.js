/* -----

	rko-game
	
	------					*/


// define melonJS app
var jsApp	=
{
	// Initialize the jsApp
	onload: function()
	{
		// put melonjs into console sandbox for hacking fun
		window.sandbox.model.sandbox.me = me;

		// var width = window.innerWidth,
		// 	height = window.innerWidth*1.33,
		var	mapWidth = 25*32,
			mapHeight = 45*32;

		// if (window.innerHeight < height || height > mapHeight) {
		// 	width = window.innerHeight*.75;
		// 	height = window.innerHeight;
		// }

		// if (window.innerWidth < width || width > mapWidth) {
		// 	width = mapWidth;
		// 	height = mapWidth*1.33;
		// }


		this.width = window.innerWidth,
		this.height = window.innerHeight;

		if (this.height > mapHeight) {
			this.height = mapHeight;
		}
		if (this.width > mapWidth) {
			this.width = mapWidth;
		}

		$('#sandbox').css('width',this.width);
		$('#sandbox').css('height',this.height);
		$('#consoleButton').css('margin-left',this.width-50);
		$('#sandbox .output').css('width',this.width-50);
		$('#sandbox .input').css('width',this.width-70);

		var titleWidth = $('#title').width();
		var titleHeight = $('#title').height();

		$('#title').css('top',(this.height/2)-titleHeight/2).css('left',(this.width/2)-titleWidth/2);
		$('#title').click(function(){
			$(this).remove();
		});

		if (!me.video.init('jsapp', this.width, this.height))
		{
			alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
			return;
		}
	
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);

		me.debug.renderHitBox=true;
	},
	
	
	//	callback when everything is loaded								
	loaded: function ()
	{

		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, this);

		// add our player entity in the entity pool
   		me.entityPool.add("mainplayer", PlayerEntity);
   		me.entityPool.add("enemyentity", EnemyEntity);

		// // add a default HUD to the game mngr (with no background)
		// me.game.addHUD(0, 0, this.width, 50, "transparent");

		// // add the HUD text item
		// me.game.HUD.addItem("hud_button", new ConsoleButton(3, 0, 0, 0));


		// enable the keyboard (to navigate in the map)
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,	 "up");
		me.input.bindKey(me.input.KEY.DOWN,	 "down");
		me.input.bindKey(me.input.KEY.ESC,	 "console");

        //enable mouse events
        me.input.registerMouseEvent('mousedown', me.viewport, this.clicked.bind(this));
        me.input.registerMouseEvent('mouseup', me.viewport, this.clicked.bind(this));


		// start the game
		me.state.change(me.state.PLAY);
		
	},


	reset: function()
	{	
		me.game.reset();

		// load a level
		me.levelDirector.loadLevel("village");	


        //try loading convos
        me.game.getEntityByName("enemyentity")[0].setConversations(
                [{
                    initial: "Hello, and welcome to Hackman JS. You can move around by touching anywhere on the screen. (try this now)",
                    expected: /.+/i,
                    incorrect: "...Is that how you greet people?"
                },
                {
                    initial: "Good, now if you want to get started with the series of tutorials, move to the guardian",
                    expected: /.+/i,
                    incorrect: null
                }]
            );
        me.game.getEntityByName("enemyentity")[1].setConversations(
                [{
                    initial: "Hi... You do say hi dont you? (Say hi)",
                    expected: /hi/i,
                    incorrect: "Well i dont believe that is a hi but that is close enough"
                },
                {
                    initial: "Now in order to test your future capabilities, im going to ask you to perform some basic arithmetic. What is 1 + 1?",
                    expected: /2/i,
                    incorrect: "Wow, thats wrong. I think you may not be the one. Try that again..."
                },
                {
                    initial: "Good!, now what are 2 numbers that add up to 10",
                    expected: /10/i,
                    incorrect: "Thats very wrong. Have another go at it..."
                },
                {
                    initial: "Great! Now im going to ask you to multiply or divide numbers, but DO NOT calculate them somewhere else. Calculate them using the textbox, its easy",
                    expected: /[0-9.-]+/i,
                    incorrect: ""
                },
                {
                    initial: "Im guessing you know how to divide. Try to divide 6324 by 6",
                    expected: /1054/i,
                    incorrect: "Nope, try again:"
                }]
            );

        //me.game.getEntityByName("enemyentity")[2].setConversations(
                //[{
                    //initial: "blah blah?",
                    //expected: /.*/i,
                    //incorrect: "BLAH BLAH!"
                //},
                //{
                    //initial: "blah blah?",
                    //expected: /.*/i,
                    //incorrect: "BLAH BLAH!"
                //},
                //{
                    //initial: "good luck",
                    //expected: /.*/i,
                    //incorrect: null
                //}]
            //);
	},

    /* ------
    this catches the mouse down event and updates the player's waypoint
    ------ */
    clicked: function(e) {
        if (e.type == "mousedown")
        {
            me.game.getEntityByName("mainplayer")[0].updateWaypoint(me.input.mouse.pos);
            //console.log(me.input.mouse.pos);
        }
        else if (e.type == "mouseup")
        {
            me.game.getEntityByName("mainplayer")[0].updateWaypoint( {x: -1, y: -1} );
            //console.log('up');
        }
    },

	// rendering loop								
	onUpdateFrame: function()
	{
		var speed = 3;
	
		// update our sprites
		me.game.update();
	
		// draw the rest of the game
		me.game.draw();
	}

}; // jsApp



//bootstrap
window.onReady(function() 
{
	jsApp.onload();
});

jQuery(document).ready(function(){
	$('#consoleButton').click(function(){
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
	});
});
