function what_time_is_it() {
  return new Date().getTime();
}

function random_int(min, max) {
  min = Math.ceil(min || 0);
  if (!max) {
    max = min;
    min = 0;
  }

  return Math.floor(Math.random() * (max - min)) + min;
}

// Left in because I don't want to try to re-derive it
function grid_rotate(grid, turns) {
   if (!turns) return grid;

  var new_grid = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  new_grid[0][0] = grid[2][0];
  new_grid[1][0] = grid[2][1];
  new_grid[2][0] = grid[2][2];

  new_grid[0][1] = grid[1][0];
  new_grid[1][1] = grid[1][1];
  new_grid[2][1] = grid[1][2];

  new_grid[0][2] = grid[0][0];
  new_grid[1][2] = grid[0][1];
  new_grid[2][2] = grid[0][2];

  return grid_rotate(new_grid, turns - 1);
}

// left in because I don't want to re-derive it
function unrotate_coords(coordinates, turns) {
  if (!turns) return coordinates;

  if (coordinates.x === 1 && coordinates.y === 2) {
    return coordinates;
  }

  return unrotate_coords(
    new Coordinates(3 - (coordinates.y + 1) , coordinates.x),
    turns - 1);
}

module.exports = {
  what_time_is_it: what_time_is_it,
  random_int: random_int
}
