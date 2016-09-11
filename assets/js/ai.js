// from coordiates.js:
//   Coordinates
//   IndexCoordinates
// from utils.js:
//   grid_rotate(grid, turns)
//   unrotate_coords(coordinates, turns)

function AI(game) {
  this.game = game;
  this.opponent = game.human.name;
}
AI.prototype = {
  game: null,

  name: 'ai',
  let_player_win: false,
  opponent: '',

  rotations: 0,

  rotate_grid: function AI_rotate_grid(grid) {
    return grid_rotate(grid, this.rotations);
  },

  unrotate_coordinates: function AI_unrotate_coordinates(coordinates) {
    return unrotate_coords(coordinates, this.rotations);
  },

  check_immediate_moves: function AI_check_immediate_moves(grid) {
    var moves = {
      valid: [],
      winning: null,
      blocking: null
    }

    for (var i = 0; i < 9; i += 1) {
      var coords = new IndexCoordinates(i);

      // if this is a valid move
      if(!grid[coords.x][coords.y]) {
        // check if this will just win the game

        // will AI win if they go here?
        grid[coords.x][coords.y] = this.name;
        if (this.game.check_for_winner(grid)) {
          console.log('winning!');
          moves.winning = coords;
        }

        // will Player win if they go here?
        grid[coords.x][coords.y] = this.opponent;
        if (this.game.check_for_winner(grid)) {
          console.log('blocking human');
          moves.blocking = coords;
        }

        // if not, erase that
        grid[coords.x][coords.y] = '';

        // remember the valid move
        moves.valid.push(coords);
      }
    }

    return moves;
  },

  turn_rules: [
    function AI_turn_0(grid) {
      // Going first, so grab the corner
      return new Coordinates(0, 0);
    },
    function AI_turn_1(raw_grid) {
      var grid = this.rotate_grid(raw_grid);
      if (grid[1][1]) {
        console.log('countering center');
        return this.unrotate_coordinates(new Coordinates(0, 0));
      }
      console.log('countering non-center');
      return this.unrotate_coordinates(new Coordinates(1, 1));
    },
    function AI_turn_2(grid) {
      if (grid[2][2] === this.opponent) {
        console.log('countering big L');
        return new Coordinates(2, 0);
      } else {
        console.log('attempting big L');
        return new Coordinates(2, 2);
      }
    },
    function AI_turn_3(grid) {
      var rotated_grid = this.rotate_grid(grid);
      // block the corner strategy
      if (rotated_grid[0][0] === this.opponent &&
          rotated_grid[2][2] === this.opponent) {
        console.log('blocking corner');
        return this.unrotate_coordinates(new Coordinates(1, 0));
      }

      // block corner-side strategy
      if ((rotated_grid[1][0] === this.opponent &&
           rotated_grid[0][2] === this.opponent) ||
          (rotated_grid[1][0] === this.opponent &&
           rotated_grid[2][2] === this.opponent)) {
        console.log('blocking corner-side');
        return this.unrotate_coordinates(new Coordinates(0, 0));
      }

      return null;
    },
  ],

  think: function AI_think() {
    var grid = this.game.simple_grid();

    var moves = this.check_immediate_moves(grid);

    // no moves, game over
    if (!moves.valid) {
      return null;
    }

    // just take the first move if we're cheating
    if (this.let_player_win) {
      return moves.valid[0];
    }

    // execute immediate move
    var candidate = candidate = moves.winning || moves.blocking || null;
    if (candidate) {
      return candidate;
    }

    // determine what turn we're on
    var turns_taken = 9 - moves.valid.length;

    // if we're going second, determine grid rotaton
    if (turns_taken === 1) {
      // normalize, so if they went corner or edge, it's in pos 0 or 1
      if (grid[2][0] === this.opponent || grid[2][1] === this.opponent) {
        this.rotations = 1;
      }
      if (grid[2][2] === this.opponent || grid[1][2] === this.opponent) {
        this.rotations = 2;
      }
      if (grid[0][2] === this.opponent || grid[0][1] === this.opponent) {
        this.rotations = 3;
      }
    }

    if (this.turn_rules[turns_taken]) {
      candidate = this.turn_rules[turns_taken].call(this, grid)
    }

    // check that the move is valid
    if (candidate && !grid[candidate.x][candidate.y]) {
      return candidate;
    } else {
      console.log('rejectng invalid move ' + candidate);
    }

    // still don't have a decision? fuck it. first available move.
    console.log('no best move')
    return moves.valid[0];
  } ,

  choose_tile: function AI_choose_tile() {
    var coordinates = this.think();

    return this.game.grid[coordinates.x][coordinates.y];
  }
}
