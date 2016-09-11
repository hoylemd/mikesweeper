// from game.js
//   Game
// from tile.js
//   Tile

function MinesweeperGame() {
  // game-specific stuff to excise
  this.GRID_COLUMNS = 16;
  this.GRID_ROWS = 16;

  this.MINE_COUNT = 16;

  var BACKGROUND_COLOUR = 0x999999;

  this.width = this.GRID_COLUMNS * Tile.TILE_WIDTH;
  this.height = this.GRID_ROWS * Tile.TILE_HEIGHT;

  this.cheats = {
  };

  this.grid = null;
  this.mines = null;
  this.remaining_mines = 0;

  Game.call(this);

  this.reset = function MinesweeperGame_reset() {
    this.stage.removeChild(this.lines);

    for (var i = 0; i < this.GRID_COLUMNS; i += 1) {
      for (var j = 0; j < this.GRID_ROWS; j += 1) {
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

  this.addTile = function MineSweeperGame_addTile(tile) {
    this.grid[tile.column][tile.row] = tile;
    this.stage.addChild(tile);
    this.game_objects.push(tile);
  };

  this.get_adjacent_tiles = function MinesweeperGame_get_adjacent_tiles(x, y) {
    var tiles = [];

    var left = x - 1;
    var right = x + 1;
    var up = y - 1;
    var down = y + 1;

    var left_ok = left >= 0;
    var right_ok = right < this.GRID_COLUMNS;
    var up_ok = up >= 0;
    var down_ok = down < this.GRID_ROWS;

    if (left_ok) {
      if (up_ok) {
        tiles.push(this.grid[left][up]);
      }
      tiles.push(this.grid[left][y]);
      if (down_ok) {
        tiles.push(this.grid[left][down]);
      }
    }

    if (up_ok) {
      tiles.push(this.grid[x][up]);
    }
    tiles.push(this.grid[x][y]);
    if (down_ok) {
      tiles.push(this.grid[x][down]);
    }

    if (right_ok) {
      if (up_ok) {
        tiles.push(this.grid[right][up]);
      }
      tiles.push(this.grid[right][y]);
      if (down_ok) {
        tiles.push(this.grid[right][down]);
      }
    }

    return tiles;
  }

  this.reveal_area = function MinesweeperGame_reveal_area(seed) {
    var stack = [];
  }
}
MinesweeperGame.prototype = Object.create(Game.prototype);
