/* -----

	rko-game
	
	------					*/

// define melonJS app
var jsApp	=
{
	worldObjects: {test:"a test object"},

	jsEval: function(codeString) 
	{
		with(this.worldObjects) {return eval(codeString);}
	},

	// Initialize the jsApp
	onload: function()
	{
		// alert(this.jsEval('fun'));
		
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
      		this.jsEval(prompt("Enter code"));
			// force redraw
			me.game.repaint();
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
