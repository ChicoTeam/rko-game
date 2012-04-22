/* -----

	rko-game
	
	------					*/





// define melonJS app
var jsApp	=
{
	worldObjects: {},

	// Initialize the jsApp
	onload: function()
	{
		// put melonjs into worldObjects for hacking fun
		this.worldObjects.me = me;

		this.worldObjects.o = new Obj();// for testing purposes only

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

		// add a default HUD to the game mngr (with no background)
		me.game.addHUD(0, 250, 400, 30, "transparent");

		// add the HUD text item
		me.game.HUD.addItem("hud_button", new Button(3,0));
		//me.game.HUD.setItemValue("hud_button", "Open Console");

		// enable the keyboard (to navigate in the map)
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,	 "up");
		me.input.bindKey(me.input.KEY.DOWN,	 "down");
		me.input.bindKey(me.input.KEY.C,	 "console");

        //enable mouse events
        //me.input.enableMouseEvent();

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
      				window.sandbox.model.destroy();
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
