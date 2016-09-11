// from game.js
//   Game
// from tile.js
//   Tile

function TicTacToeGame() {
  // game-specific stuff to excise
  var GRID_COLUMNS = 16;
  var GRID_ROWS = 16;

  var BACKGROUND_COLOUR = 0x999999;

  this.width = GRID_COLUMNS * Tile.TILE_WIDTH + 2;
  this.height = GRID_ROWS * Tile.TILE_HEIGHT + 2;

  this.cheats = {
  };

  this.grid = null;

  Game.call(this);

  this.reset = function TicTacToe_reset() {
    this.stage.removeChild(this.lines);

    for (var i = 0; i < GRID_COLUMNS; i += 1) {
      for (var j = 0; j < GRID_ROWS; j += 1) {
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
