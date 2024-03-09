keyboardControls = {
  event: 'keydown',
  listener: function(e) {
    var preventDefault = true;

    if (e.keyCode == 38)
      tetris.controlActive("pivot");
    else if (e.keyCode == 40)
      tetris.controlActive("down");
    else if (e.keyCode == 39)
      tetris.controlActive("right");
    else if (e.keyCode == 37)
      tetris.controlActive("left");
    else if (e.keyCode == 32)
      tetris.pause();
    else
      preventDefault = false;

    if (preventDefault)
      e.preventDefault();
  },
  setup: function() {
    document.body.addEventListener(this.event, this.listener, false);
  },
  teardown: function() {
    document.body.removeEventListener(this.event, this.listener);
  }
}