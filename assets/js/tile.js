/* Class for game Tiles */

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
  var mine_texture = TextureCache['mine.png'];
  var exploded_texture = TextureCache['exploded.png'];

  // graphics objects
  PIXI.Container.call(this);
  var ground_sprite = new PIXI.Sprite(ground_texture);
  this.ground_sprite = ground_sprite;
  this.addChild(ground_sprite);

  var contents_sprite = new PIXI.Sprite(mine_texture);
  contents_sprite.visible = false;
  this.addChild(contents_sprite);

  var flag_sprite = new PIXI.Sprite(TextureCache['flag.png']);
  flag_sprite.visible = false;
  this.addChild(flag_sprite);

  var highlight = new PIXI.Sprite(TextureCache['highlight.png']);
  highlight.visible = false;
  this.addChild(highlight);

  var adjacent_text = new PIXI.Text('')
  adjacent_text.visible = false;
  this.addChild(adjacent_text);

  // positioning
  this.column = column;
  this.x = TILE_WIDTH * column;
  this.row = row;
  this.y = TILE_WIDTH * row;

  // game info
  this.excavated = false;
  this.mined = false;
  this.adjacent = 0;
  this.flagged = false;

  // engine methods
  this.update = function Tile_update(timedelta) {
    var new_events = this.events;
    this.events = {};
    return new_events;
  }

  // Input handlers
  this.interactive = true;

  this.click = function Tile_click(event) {
    // flag if shift is held
    this.events['tile_clicked'] = event.data.originalEvent.shiftKey
  };

  this.mouseover = function Tile_mouseover() {
    highlight.visible = true;
  };

  this.mouseout = function Tile_mouseout() {
    highlight.visible = false;
  };

  // stage changers
  this.increment_adjacent = function Tile_increment_adjacent() {
    this.adjacent += 1;
    adjacent_text.text = '' + this.adjacent;
    // center the text
    adjacent_text.x = (this.width - adjacent_text.width) / 2;
    adjacent_text.y = (this.height - adjacent_text.height) / 2;
  };

  this.reveal = function Tile_reveal() {
    this.excavated = true;
    ground_sprite.texture = excavated_texture;
    if (this.mined) {
      contents_sprite.visible = true;
    } else if (this.adjacent) {
      adjacent_text.visible = true;
    }
  }

  this.dig = function Tile_dig() {
    this.reveal();

    if (this.mined) {
      contents_sprite.texture = exploded_texture;
      contents_sprite.visible = true;

      this.events['exploded'] = true;
    } else if (!this.adjacent) {
      this.events['reveal_area'] = true;
    }
  }

  this.flag = function Tile_flag() {
    this.flagged = !this.flagged;
    flag_sprite.visible = this.flagged;

    this.events['flagged'] = {state: this.flagged};
  };

  this.reveal_mine = function Tile_reveal_mine() {
    if (this.mined) {
      this.reveal();
    }
  };

  this.name = '(' + this.column + ',' + this.row + ')';
  this.stringify = function() {
    return 'Tile(' + this.column + ',' + this.row + ')' + '[' + this.adjacent + ']' + (this.mined ? '*' : '');
  }
}
Tile.prototype = Object.create(PIXI.Container.prototype);

Tile.TILE_WIDTH = TILE_WIDTH;
Tile.TILE_HEIGHT = TILE_HEIGHT;

module.exports = Tile;
