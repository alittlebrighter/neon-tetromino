swipeControls = (function() {

  var startX, startY, canvas = document.getElementById("game"),
    status = "off";

  function touchStart(e) {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
    e.preventDefault();
  }

  function touchEnd(e) {
    var diffX = e.changedTouches[0].clientX - startX,
      diffY = e.changedTouches[0].clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0)
        tetris.controlActive("right");
      else
        tetris.controlActive("left");
    } else {
      if (diffY > 0)
        tetris.controlActive("down");
      else
        tetris.controlActive("pivot");
    }
    e.preventDefault();
  }

  function setup() {
    canvas.addEventListener('touchstart', touchStart, false);
    canvas.addEventListener('touchend', touchEnd, false);
    status = "on";
  }

  function teardown() {
    canvas.removeEventListener('touchstart', touchStart);
    canvas.removeEventListener('touchend', touchEnd);

    status = "off";
  }

  function getStatus() {
    return status;
  }

  return {
    setup: setup,
    teardown: teardown,
    status: getStatus
  }
})();

tapControls = (function() {

  var delay = 125,
    intervals = {
      left: {},
      right: {},
      down: {}
    }, container = document.getElementById("tap-controls-container"),
    status = "off";

  var tapStartFuncs = {
    left: function(e) {
      tetris.controlActive("left");
      intervals.left = window.setInterval(tetris.controlActive, delay, ["left"]);
      e.preventDefault();
    },
    right: function(e) {
      tetris.controlActive("right");
      intervals.right = window.setInterval(tetris.controlActive, delay, ["right"]);
      e.preventDefault();
    },
    down: function(e) {
      tetris.controlActive("down");
      intervals.down = window.setInterval(tetris.controlActive, delay, ["down"]);
      e.preventDefault();
    },
    pivot: function(e) {
      tetris.controlActive("pivot");
      e.preventDefault();
    }
  };

  var tapEndFuncs = {
    left: function() {
      window.clearInterval(intervals.left);
    },
    right: function() {
      window.clearInterval(intervals.right);
    },
    down: function() {
      window.clearInterval(intervals.down);
    },
  }

    function setup() {
      container.style.display = "block";

      document.getElementById("control-tap-left").addEventListener("touchstart", tapStartFuncs.left, false);
      document.getElementById("control-tap-right").addEventListener("touchstart", tapStartFuncs.right, false);
      document.getElementById("control-tap-down").addEventListener("touchstart", tapStartFuncs.down, false);
      document.getElementById("control-tap-rotate").addEventListener("touchstart", tapStartFuncs.pivot, false);

      document.getElementById("control-tap-left").addEventListener("touchend", tapEndFuncs.left, false);
      document.getElementById("control-tap-right").addEventListener("touchend", tapEndFuncs.right, false);
      document.getElementById("control-tap-down").addEventListener("touchend", tapEndFuncs.down, false);

      status = "on";
    }

    function teardown() {
      document.getElementById("control-tap-left").removeEventListener("touchstart", tapStartFuncs.left);
      document.getElementById("control-tap-right").removeEventListener("touchstart", tapStartFuncs.right);
      document.getElementById("control-tap-down").removeEventListener("touchstart", tapStartFuncs.down);
      document.getElementById("control-tap-rotate").removeEventListener("touchstart", tapStartFuncs.pivot);

      document.getElementById("control-tap-left").removeEventListener("touchend", tapEndFuncs.left);
      document.getElementById("control-tap-right").removeEventListener("touchend", tapEndFuncs.right);
      document.getElementById("control-tap-down").removeEventListener("touchend", tapEndFuncs.down);

      container.style.display = "none";

      status = "off";
    }

    function getStatus() {
      return status;
    }

  return {
    setup: setup,
    teardown: teardown,
    status: getStatus
  }
})();