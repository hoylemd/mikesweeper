// from game.js
//   Game
// from ai.js
//   AI

function TicTacToeGame() {
  // game-specific stuff to excise
  var GRID_COLUMNS = 3;
  var GRID_ROWS = 3;

  var BACKGROUND_COLOUR = 0x999999;

  this.width = GRID_COLUMNS * Tile.TILE_WIDTH + 2;
  this.height = GRID_ROWS * Tile.TILE_HEIGHT + 2;

  this.human = {name: 'human'};
  this.ai = new AI(this);
  this.player = this.human;
  this.players = {
    'human': this.human,
    'ai': this.ai
  };

  this.cheats = {
    let_player_win: false,
    force_coin: null,
  };

  this.grid = null;
  this.victory_line = null;

  Game.call(this);

  this.simple_grid = function TicTacToeGame_simple_grid() {
    var tile_grid = this.grid;
    var grid = [['','',''],
                ['','',''],
                ['','','']]

    //construct simpler grid
    for (var i = 0; i < 3; i += 1) {
      for (var j = 0; j < 3; j += 1) {
        var tile = tile_grid[i][j];
        grid[i][j] = tile.owner ? tile.owner.name : '';
      }
    }

    return grid;
  };

  function check_line(first, second, third) {
    return first && first === second && first === third;
  }

  function no_valid_moves(grid) {
    return ((grid[0][0] && grid[1][0] && grid[2][0]) &&
            (grid[0][1] && grid[1][1] && grid[2][1]) &&
            (grid[0][2] && grid[1][2] && grid[2][2]));
  }

  this.game_result = function TicTacToeGame_game_result(
      winner_name, direction, position) {
    return {
      winner: this.players[winner_name] || null,
      direction: direction || null,
      position: position || null
    };
  }

  this.check_for_winner = function TicTacToeGame_check_for_winner(grid) {
    grid = grid || this.simple_grid();

     for (var i = 0; i < 3; i += 1) {
      // check vertical
      if (check_line(grid[i][0], grid[i][1], grid[i][2])) {
        return this.game_result(grid[i][0], 'vertical', i);
      }

      // check horizontal
      if (check_line(grid[0][i], grid[1][i], grid[2][i])) {
        return this.game_result(grid[0][i], 'horizontal', i);
      }
    }

    // check diagonal
    if (check_line(grid[0][0], grid [1][1], grid[2][2])) {
      return this.game_result(grid[0][0], 'diagonal', 0);
    }
    if (check_line(grid[2][0], grid [1][1], grid[0][2])) {
      return this.game_result(grid[2][0], 'diagonal', 1);
    }

    if (no_valid_moves(grid)) {
      return this.game_result();
    }
    return null;
  };

  this.switch_player = function TicTacToeGame_switch_player() {
    this.player = this.player === this.human ? this.ai : this.human;
  };

  this.reset = function TicTacToe_reset() {
    this.stage.removeChild(this.lines);

    for (var i = 0; i < 3; i += 1) {
      for (var j = 0; j < 3; j += 1) {
        var tile = this.grid[i][j];
        tile.visible = false;
        this.stage.removeChild(tile);
        this.grid[i][j] = null;
      }
    }

    this.victory_line.visible = false;
    this.stage.removeChild(this.victory_line);

    Game.prototype.reset.apply(this);
  };
}
TicTacToeGame.prototype = Object.create(Game.prototype);
