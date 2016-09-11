/* Class for game Tiles */

// from pixi.js:
//   PIXI

// Alias
var TextureCache = PIXI.utils.TextureCache;

var TILE_WIDTH = 128;
var TILE_HEIGHT = 128;


function Tile(column, row) {
  var none_texture = TextureCache['none.png'];
  var x_texture = TextureCache['X.png'];
  var o_texture = TextureCache['O.png'];

  PIXI.Sprite.call(this, none_texture);
  this.visible = true;

  this.events = {}; // Events have a name (string key) and an array of arguments

  this.owner = null;

  this.column = column;
  this.x = column + (TILE_WIDTH * column);
  this.row = row;
  this.y = row + (TILE_WIDTH * row);

  this.update = function Tile_update(timedelta) {
    var new_events = this.events;
    this.events = {};
    return new_events;
  }

  this.set_owner = function Tile_set_owner(owner) {
    if (this.owner) {
      return false;
    }

    this.owner = owner;
    console.log(owner.name + " claimed (" + this.column + "," + this.row + ")");
    if (owner.name === 'human') {
      this.texture = x_texture;
    } else if (owner.name === 'ai') {
      this.texture = o_texture;
    }

    return true;
  };

  // Input handlers
  this.interactive = true;

  this.click = function Tile_click() {
    this.events['click'] = [];
  };

  // Set interactions
  this.on('mouseup', this.click)
      .on('touchend', this.click);
}
Tile.prototype = Object.create(PIXI.Sprite.prototype);

Tile.TILE_WIDTH = TILE_WIDTH;
Tile.TILE_HEIGHT = TILE_HEIGHT;
