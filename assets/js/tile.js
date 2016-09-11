/* Class for game Tiles */

// from pixi.js:
//   PIXI

// Alias
var TextureCache = PIXI.utils.TextureCache;

var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;

function Tile(column, row) {
  // engine things
  this.events = {}; // Events have a name (string key) and a hash of arguments

  // textures
  var ground_texture = TextureCache['ground.png'];
  var excavated_texture = TextureCache['excavated.png'];
  var flag_texture = TextureCache['flag.png'];
  var exploded_texture = TextureCache['exploded.png'];

  // graphics objects
  PIXI.Container.call(this);
  var ground_sprite = new PIXI.Sprite(ground_texture);
  var contents_sprite = new PIXI.Sprite(flag_texture);
  contents_sprite.visible = false;
  var adjacent_text = new PIXI.Text('')
  adjacent_text.visible - false;
  this.addChild(ground_sprite);
  this.addChild(contents_sprite);
  this.addChild(adjacent_text);

  // positioning
  this.column = column;
  this.x = TILE_WIDTH * column;
  this.row = row;
  this.y = TILE_WIDTH * row;

  // engine methods
  this.update = function Tile_update(timedelta) {
    var new_events = this.events;
    this.events = {};
    return new_events;
  }

  // Input handlers
  this.interactive = true;

  this.click = function Tile_click() {
    this.events['click'] = [];
  };

  this.mouseover = function Tile_mouseover() {
  };

  // Set interactions
  this.on('mouseup', this.click)
      .on('touchend', this.click);
}
Tile.prototype = Object.create(PIXI.Container.prototype);

Tile.TILE_WIDTH = TILE_WIDTH;
Tile.TILE_HEIGHT = TILE_HEIGHT;
