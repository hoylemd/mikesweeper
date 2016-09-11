// from game.js
//   Game
// from tile.js
//   Tile

function MinesweeperGame() {
  // game-specific stuff to excise
  this.GRID_COLUMNS = 16;
  this.GRID_ROWS = 16;

  var BACKGROUND_COLOUR = 0x999999;

  this.width = this.GRID_COLUMNS * Tile.TILE_WIDTH;
  this.height = this.GRID_ROWS * Tile.TILE_HEIGHT;

  this.cheats = {
  };

  this.grid = null;

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
}
MinesweeperGame.prototype = Object.create(Game.prototype);
