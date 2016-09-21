function GameState(game) {
  this.game = game;
}
GameState.prototype = {
  name: 'Base State',

  game: null,

  update: function base_state_update(timedelta) {
  },

  event_handlers: [],
  handle_event: function base_state_handle_event(event, object, parameters) {
    var handler = this.event_handlers[event]
    if (handler) {
      handler.call(this, object, parameters);
      return true;
    }
    return false;
  }
};

module.exports = GameState;
