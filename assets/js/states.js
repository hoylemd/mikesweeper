var random_int = require('./utils.js').random_int;
var GameState = require('./game_state.js');
var Tile = require('./tile.js');

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
    game.mines = [];
    game.flags = [];

    // create the tiles
    for (var x = 0; x < game.GRID_COLUMNS; x += 1) {
      game.grid[x] = [];
      for (var y = 0; y < game.GRID_ROWS; y += 1) {
        var tile = new Tile(x, y);

        game.addTile(tile);
      }
    }

    // add the mines
    for (var i = 0; i < game.MINE_COUNT; i += 1) {
      var done = false;
      while (!done) {
        var x = random_int(game.GRID_COLUMNS);
        var y = random_int(game.GRID_ROWS);

        var tile = game.grid[x][y];

        if (!tile.mined) {
          tile.mined = true;
          var adjacent_tiles = game.get_adjacent_tiles(x, y);
          for (var j in adjacent_tiles) {
            var adjacent = adjacent_tiles[j];
            adjacent.increment_adjacent();
          }

          game.remaining_mines += 1;
          game.mines.push(tile);
          done = true;
        }
      }
    }

    // start!
    game.log('Welcome to MikeSweeper!');
    game.log('There are ' + game.remaining_mines + ' mines.');
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

  function handle_exploded(object, arguments) {
    game.transition('game_over');
  }

  function handle_reveal_area(object, arguments) {
    game.reveal_area(object);
  }

  function handle_flagged(object) {
    if (object.flagged) {
      game.flags.push(object);
    } else {
      game.flags.splice(game.flags.indexOf(object), 1);
    }

    // update remaining mine count.
    if (object.mined) {
      game.remaining_mines += object.flagged ? -1 : 1;
    }

    if (game.remaining_mines <= 0) {
      game.transition('game_over');
    }
  }

  function handle_tile_clicked(object, shift) {
    if (shift) {
      object.flag();
    } else {
      object.dig();
    }
  }

  this.event_handlers = {
    'log': handle_log,
    'exploded': handle_exploded,
    'reveal_area': handle_reveal_area,
    'flagged': handle_flagged,
    'tile_clicked': handle_tile_clicked
  };

  this.update = function MainState_update(timedelta) {
    console.log('main');
  }
};
MainState.prototype = Object.create(GameState.prototype);
all_states['main'] = MainState;

function GameOverState(game) {
  GameState.call(this, game);

  this.name = 'game_over';

  if (game.remaining_mines) {
    game.log('You blew up!');
  } else {
    game.log('Cool! You got them all!');
  }
  game.log('Click on the field to play again.');

  for (var i in game.mines) {
    game.mines[i].reveal_mine();
  }

  function handle_click(object) {
    game.reset()
    game.transition('initializing');
  }

  this.event_handlers = {
    'tile_clicked': handle_click
  };
};
GameOverState.prototype = Object.create(GameState.prototype);
all_states['game_over'] = GameOverState;
all_states.__initial__ = 'loading_assets';

module.exports = all_states;
