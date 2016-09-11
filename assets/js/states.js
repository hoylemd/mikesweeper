// from pixi.js:
//   PIXI
// from utils.js:
//   print_grid(grid)
// from tile.js:
//   Tile

function GameState(game) {
  this.game = game;
}
GameState.prototype = {
  name: 'Unnamed State',

  game: null,

  update: function base_state_update(timedelta) {
  },

  event_handlers: [],
  handle_event: function base_state_handle_event(event, object, parameters) {
    var handler = this.event_handlers[event]
    if (handler) {
      handler.call(this, object, parameters);
      return true;
    }
    return false;
  }
};

// Global list of states
var all_states = {};

function LoadingAssetsState(game) {
  GameState.call(this, game);

  this.name = 'loading_assets';

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
      var texture_atlases = ['assets/sprites/marks.json'];
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

  this.update = function InitializingState_update(timedelta) {

    var lines = new PIXI.Graphics();
    lines.lineStyle(2, 0x000000, 1);

    lines.moveTo(Tile.TILE_WIDTH + 1, 0);
    lines.lineTo(Tile.TILE_WIDTH + 1, game.height);

    lines.moveTo(2 * (Tile.TILE_WIDTH + 1), 0);
    lines.lineTo(2 * (Tile.TILE_WIDTH + 1), game.height);

    lines.moveTo(0, Tile.TILE_WIDTH + 1);
    lines.lineTo(game.width, Tile.TILE_WIDTH + 1);

    lines.moveTo(0, 2 * (Tile.TILE_WIDTH + 1));
    lines.lineTo(game.width, 2 * (Tile.TILE_WIDTH + 1));

    game.lines = lines;
    game.stage.addChild(lines);

    game.tiles = [];
    game.grid = [];

    for (var i = 0; i < 3; i += 1) {
      var new_row = [];
      for (var j = 0; j < 3; j += 1) {
        var new_tile = new Tile(i, j);
        new_row[j] = new_tile;
        game.tiles.push(new_tile);
        game.game_objects.push(new_tile);
        game.stage.addChild(new_tile);
      }
      game.grid[i] = new_row;
    }

    game.log("Flipping a coin to see who goes fist. " +
             "You go first if it's heads!");
    var coin_flip = Math.random() > 0.5 ? 'heads' : 'tails';
    coin_flip = game.cheats.force_coin || coin_flip;

    if (coin_flip === 'tails') {
      game.player = game.ai;
      game.log('Tails! I go first!');
    } else {
      game.player = game.human;
      game.log('Heads. You go first.');
    }

    this.game.transition('main');
  };
}
InitializingState.prototype = Object.create(GameState.prototype);
all_states['initializing'] = InitializingState;

function MainState(game) {
  GameState.call(this, game);

  this.name = 'main';
  this.turn_taken = false;

  this.claim_tile = function MainState_claim_tile(tile, owner) {
    if (!tile.set_owner(owner)) {
      this.game.log('(' + tile.column + ',' + tile.row + ') has already been ' +
               'claimed by ' + tile.owner.name);
      return;
    }

    if (owner === this.game.human) {
      this.game.log('You marked (' + tile.column + ',' + tile.row + ').');
    } else {
      this.game.log('I choose (' + tile.column + ', ' + tile.row + ').');
    }
    this.turn_taken = true;
  }

  function tile_click(object, arguments) {
    if (this.game.player === this.game.human) {
      this.claim_tile(object, this.game.human);
    }
  }

  this.event_handlers = {
    'click': tile_click
  }

  this.ai_timer = 0;
  this.update = function MainState_update(timedelta) {
    if (this.game.player === this.game.ai) {
      this.ai_timer += timedelta;

      if (this.ai_timer >= 500) {
        this.ai_timer = 0;
        var choice = this.game.ai.choose_tile();
        this.claim_tile(choice, this.game.ai);
      }
    }

    if (this.turn_taken) {
      this.turn_taken = false;
      var result = game.check_for_winner();

      if (result) {
        this.game.transition('game_over', result);
      } else {
        this.game.switch_player();
      }
    }
  }
};
MainState.prototype = Object.create(GameState.prototype);
all_states['main'] = MainState;

function GameOverState(game, arguments) {
  if (arguments && arguments.winner) {
    if (arguments.winner === game.human) {
      game.log("Game over. You... won? but... but I'm undefeatable..." +
               " YOU CHEATED!!!!!!!");
    } else {
      game.log("Game over! I win! See? " + arguments.direction + "ly!");
    }

    // create the line sprite
    var line_texture = TextureCache['line.png'];
    var line_sprite = new PIXI.Sprite(line_texture);
    line_sprite.anchor.x = 0.5;
    line_sprite.anchor.y = 0.5;

    var PI = 3.14159;

    // position it
    if (arguments.direction === 'horizontal') {
      line_sprite.x = 1.5 * Tile.TILE_WIDTH;
      line_sprite.y = Tile.TILE_HEIGHT * (0.5 + arguments.position);
    }
    if (arguments.direction === 'vertical') {
      line_sprite.rotation = 0.5 * PI;
      line_sprite.x = Tile.TILE_WIDTH * (0.5 + arguments.position);
      line_sprite.y = 1.5 * Tile.TILE_HEIGHT;
    }
    if (arguments.direction === 'diagonal') {
      line_sprite.rotation = (0.25 + arguments.position / 2) * PI;
      line_sprite.x = 1.5 * Tile.TILE_WIDTH;
      line_sprite.y = 1.5 * Tile.TILE_HEIGHT;
    }
    game.stage.addChild(line_sprite);
    game.victory_line = line_sprite;

  } else {
    game.log("Game over! it's a draw.");
  }
  game.log("Refresh, or click a tile to play again.");

  function tile_click(object, arguments) {
    game.transition('initializing');

    game.reset();
  }

  this.event_handlers = {
    'click': tile_click
  }

}
GameOverState.prototype = Object.create(GameState.prototype);
all_states['game_over'] = GameOverState;

function get_all_states() {
  all_states.__initial__ = 'loading_assets';
  return all_states;
}
