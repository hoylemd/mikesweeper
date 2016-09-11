// from pixi.js:
//   PIXI
// from game_state.js
//   GameState
// from tile.js:
//   Tile

// Global list of states
var all_states = {};

function LoadingAssetsState(game) {
  GameState.call(this, game);

  this.name = 'loading_assets';

  this.event_handlers = {};

  this.loading_started = false;
  this.loading_done = false;

  this.update =  function LoadingAssets_update(timedelta) {
    if (!this.loading_started) {
      console.log('Loading assets...')

      var that = this;
      function done_loading() {
        that.loading_done = true;
      }

      // Define Textures and Atlases to load here
      var textures = [];
      var texture_atlases = ['assets/sprites/sprites.json'];
      // Done defining Textures and Atlases

      PIXI.loader.add(textures)
                 .add(texture_atlases)
                 .load(done_loading);
      this.loading_started = true;
    } else if (this.loading_done){
      console.log('done loading assets!');
      this.game.transition('initializing');
    } else {
      console.log('still loading...');
    }
  };
}
LoadingAssetsState.prototype = Object.create(GameState.prototype);
all_states['loading_assets'] = LoadingAssetsState;

function InitializingState(game) {
  GameState.call(this, game);

  this.name = 'initializing';

  this.event_handlers = {};

  this.update = function InitializingState_update(timedelta) {
    // initialize
    game.grid = [];


    // create the tiles
    for (var x = 0; x < game.GRID_COLUMNS; x += 1) {
      game.grid[x] = [];
      for (var y = 0; y < game.GRID_COLUMNS; y += 1) {
        var tile = new Tile(x, y);

        game.addTile(tile);
      }
    }

    // add the mines

    // start!
    game.log('Welcome to MikeSweeper!');
    game.transition('main');
  };
}
InitializingState.prototype = Object.create(GameState.prototype);
all_states['initializing'] = InitializingState;

function MainState(game) {
  GameState.call(this, game);

  this.name = 'main';

  function handle_log(object, arguments) {
    game.log(arguments.message);
  }

  this.event_handlers = {
    'log': handle_log
  };

  this.update = function MainState_update(timedelta) {
    console.log('main');
  }
};
MainState.prototype = Object.create(GameState.prototype);
all_states['main'] = MainState;

function get_all_states() {
  all_states.__initial__ = 'loading_assets';
  return all_states;
}
