/* -----

	rko-game
	
	------					*/


// create a "text object"
// to display the score value
HUDtextObject = me.HUD_Item.extend(
{	
   // constructor
   init: function(x, y)
   {
      // call the parent constructor
      this.parent(x, y);
      // create a font
      this.font = new me.Font("Courier New", 14, "black", "center");
   },
   // draw function
   draw : function (context, x, y)
   {
      this.font.draw (context, this.value, this.pos.x +x, this.pos.y +y);
   }
});



// define melonJS app
var jsApp	=
{
	worldObjects: {},

	jsEval: function(codeString) 
	{
		// try/catch so errors are handled in-game
		try{
			with(this.worldObjects) {return eval(codeString);}
		}
		catch(e) {
			return e.message;
		}
	},

	// Initialize the jsApp
	onload: function()
	{
		// put melonjs into worldObjects for hacking fun
		this.worldObjects.me = me;
		
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
	},
	
	
	//	callback when everything is loaded								
	loaded: function ()
	{

		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, this);

		// enable the keyboard (to navigate in the map)
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,	 "up");
		me.input.bindKey(me.input.KEY.DOWN,	 "down");
		me.input.bindKey(me.input.KEY.C,	 "console");

		// start the game
		me.state.change(me.state.PLAY);
		
	},


	reset: function()
	{	

// add a default HUD to the game mngr (with no background)
me.game.addHUD(0,0,400,280);
// add the HUD text item
me.game.HUD.addItem("hud_text", new HUDtextObject(10,20));


		me.game.reset();

		// load a level
		me.levelDirector.loadLevel("village");		
	},


	// rendering loop								
	onUpdateFrame: function()
	{
		var speed = 3;
	
		// navigate the map :)
		if (me.input.isKeyPressed('left'))
		{
			me.game.viewport.move(-speed,0);
			// force redraw
			me.game.repaint();
			
		}
		else if (me.input.isKeyPressed('right'))
      {
			me.game.viewport.move(speed,0);		
			// force redraw
			me.game.repaint();
		}
				
		if (me.input.isKeyPressed('up'))
		{
			me.game.viewport.move(0,-speed);
			// force redraw
			me.game.repaint();
		}
		else if (me.input.isKeyPressed('down'))
      {
			me.game.viewport.move(0,speed);
			// force redraw
			me.game.repaint();
		}
		else if (me.input.isKeyPressed('console'))
      {
      		var code = prompt("Enter code");
      		var result = this.jsEval(code);
      		// alert(result);
      		me.game.HUD.setItemValue("hud_text", result);
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
