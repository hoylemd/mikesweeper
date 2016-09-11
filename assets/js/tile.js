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
  this.addChild(ground_sprite);

  var contents_sprite = new PIXI.Sprite(flag_texture);
  contents_sprite.visible = false;
  this.addChild(contents_sprite);

  var highlight = new PIXI.Sprite(TextureCache['highlight.png']);
  highlight.visible = false;
  this.addChild(highlight);

  var adjacent_text = new PIXI.Text('')
  adjacent_text.visible - false;
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
    console.log(this.name + ' clicked');
    this.events['click'] = [];
  };

  this.mouseover = function Tile_mouseover() {
    highlight.visible = true;
  };

  this.mouseout = function Tile_mouseout() {
    highlight.visible = false;
  };

  // Set interactions (maybe I don't need this)
  this.on('mouseup', this.click)
      .on('touchend', this.click);

  this.name = '(' + this.column + ',' + this.row + ')';
}
Tile.prototype = Object.create(PIXI.Container.prototype);

Tile.TILE_WIDTH = TILE_WIDTH;
Tile.TILE_HEIGHT = TILE_HEIGHT;
