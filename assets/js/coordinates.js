function Coordinates(x, y) {
  this.x = x;
  this.y = y;
}
Coordinates.prototype = {x: 0, y: 0};

function IndexCoordinates(index) {
  this.x = index % 3;
  this.y = Math.floor(index / 3);
}
IndexCoordinates.prototype = Object.create(Coordinates.prototype);
