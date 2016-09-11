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

function print_grid(grid) {
  function mark(x, y) {
    var value = grid[x][y];
    if (value === 'player') {
      return 'X';
    }
    if (value === 'ai') {
      return 'O';
    }
    return ' ';
  }

  var str = '';
  str += '[' + mark(0, 0) + '][' + mark(1, 0) + '][' + mark(2, 0) + ']\n';
  str += '[' + mark(0, 1) + '][' + mark(1, 1) + '][' + mark(2, 1) + ']\n';
  str += '[' + mark(0, 2) + '][' + mark(1, 2) + '][' + mark(2, 2) + ']';

  return str;
}

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

function unrotate_coords(coordinates, turns) {
  if (!turns) return coordinates;

  if (coordinates.x === 1 && coordinates.y === 2) {
    return coordinates;
  }

  return unrotate_coords(
    new Coordinates(3 - (coordinates.y + 1) , coordinates.x),
    turns - 1);
}
