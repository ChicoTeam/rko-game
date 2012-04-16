/* -----

	rko-game
	
	------					*/


// define custom base object
var Obj = Object.extend(
{
	init: function() {
		
	},
	look: function() {
		var result = "";

		for(var key in this) {
			if(typeof this[key] === "function") {
				if(result.length > 0) {
					result += ", ";
				}
				result += key + "()";
			}
		}

		return result;
	},
	size: 10,
	makeBigger: function(size) {
		if(!size)
			return "Usage: makeBigger(size)";
		else
			return this.size + size;
	}
});



// define melonJS app
var jsApp	=
{
	worldObjects: {},

	// Initialize the jsApp
	onload: function()
	{
		// put melonjs into worldObjects for hacking fun
		this.worldObjects.me = me;

		this.worldObjects.o = new Obj();

		if (!me.video.init('jsapp', 400, 280))
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

		// enable the keyboard (to navigate in the map)
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,	 "up");
		me.input.bindKey(me.input.KEY.DOWN,	 "down");
		me.input.bindKey(me.input.KEY.C,	 "console");

        //enable mouse events NEW

		// start the game
		me.state.change(me.state.PLAY);
		
	},


	reset: function()
	{	
		me.game.reset();

		// load a level
		me.levelDirector.loadLevel("village");	
	},


	// rendering loop								
	onUpdateFrame: function()
	{
		var speed = 3;

		if (me.input.isKeyPressed('console'))
      {
      		if($('#sandbox').is(':visible')) {
      			setTimeout(function(){
      				$('#sandbox').hide();
      			},150);
      		}
      		else {
      			setTimeout(function(){
      				$('#sandbox').show();
      			},150);     			
      		}
		}
	
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
