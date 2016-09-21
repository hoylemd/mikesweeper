var Game = require('./game.js');
var Tile = require('./tile.js');
var game_states = require('./states.js');

function MinesweeperGame() {
  // game-specific stuff to excise
  this.GRID_COLUMNS = 16;
  this.GRID_ROWS = 16;

  this.MINE_COUNT = 32;

  var BACKGROUND_COLOUR = 0x999999;

  this.width = this.GRID_COLUMNS * Tile.TILE_WIDTH;
  this.height = this.GRID_ROWS * Tile.TILE_HEIGHT;

  this.cheats = {
  };

  this.grid = null;
  this.mines = null;
  this.flags = null;
  this.remaining_mines = 0;

  Game.call(this, game_states);

  this.reset = function MinesweeperGame_reset() {
    for (var i = 0; i < this.GRID_COLUMNS; i += 1) {
      for (var j = 0; j < this.GRID_ROWS; j += 1) {
        var tile = this.grid[i][j];
        tile.visible = false;
        this.stage.removeChild(tile);
        this.grid[i][j] = null;
      }
    }

    Game.prototype.reset.apply(this);
  };

  this.addTile = function MineSweeperGame_addTile(tile) {
    this.grid[tile.column][tile.row] = tile;
    this.stage.addChild(tile);
    this.game_objects.push(tile);
  };

  this.get_adjacent_tiles = function MinesweeperGame_get_adjacent_tiles(
      column, row) {
    var tiles = [];

    var left = column - 1;
    var right = column + 1;
    var up = row - 1;
    var down = row + 1;

    var left_ok = left >= 0;
    var right_ok = right < this.GRID_COLUMNS;
    var up_ok = up >= 0;
    var down_ok = down < this.GRID_ROWS;

    if (left_ok) {
      if (up_ok) {
        tiles.push(this.grid[left][up]);
      }
      tiles.push(this.grid[left][row]);
      if (down_ok) {
        tiles.push(this.grid[left][down]);
      }
    }

    if (up_ok) {
      tiles.push(this.grid[column][up]);
    }
    if (down_ok) {
      tiles.push(this.grid[column][down]);
    }

    if (right_ok) {
      if (up_ok) {
        tiles.push(this.grid[right][up]);
      }
      tiles.push(this.grid[right][row]);
      if (down_ok) {
        tiles.push(this.grid[right][down]);
      }
    }

    return tiles;
  }

  this.reveal_area = function MinesweeperGame_reveal_area(seed) {
    var stack = [seed];

    while(stack.length) {
      var next = stack.pop();
      if (!next.adjacent) {
        var adjacents = this.get_adjacent_tiles(next.column, next.row);
        for (var i = 0; i < adjacents.length; i += 1) {
          var adjacent = adjacents[i];
          if (!adjacent.excavated) {
            adjacent.reveal();

            if (!adjacent.adjacent) {
              stack.push(adjacent);
            }
          }
        }
      }
    }
  }
}
MinesweeperGame.prototype = Object.create(Game.prototype);

module.exports = MinesweeperGame;
