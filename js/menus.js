// helpers
function transitionIn(elem, classname) {
  elem.style.display = "block";
  elem.className = classname;
}

function transitionOut(elem, classname, timeout) {
  elem.className = classname;
  window.setTimeout(function() {
    elem.style.display = "none";
  }, timeout)
}

// prevent scrolling
document.body.addEventListener('touchmove', function(e) {
  e.preventdefault();
});

document.getElementById("menu-handle").addEventListener('click', function() {
  tetris.pause();

  var el = document.getElementById("pause-menu");

  if (el.className == "panel-hide") {
    el.className = "panel-show";
  } else {
    el.className = "panel-hide";
  }
}, false);

function saveGame() {
  window.localStorage.setItem("neontetris-savedgame", JSON.stringify({
    config: tetris.getters.config(),
    score: tetris.score.total,
    pieces: tetris.getters.pieces(),
  }));
}

function endGame() {
  document.getElementById("pause-menu").className = "panel-hide";
  document.getElementById("score-display").innerHTML = 0;
  tetris.score.total = 0;
  tetris.end();
}

const offColor = "#FFF";
const onColor = "#00FF00";

function arrowToggle() {
  var el = document.getElementById("arrows"),
    color;
  if (tapControls.status() == "off") {
    color = onColor;
    tapControls.setup();
  } else {
    color = offColor;
    tapControls.teardown();
  }

  var fills = el.contentDocument.getElementsByClassName("fill");
  for (var f = 0; f < fills.length; f++) {
    fills[f].setAttribute("fill", color);
  }

  var strokes = el.contentDocument.getElementsByClassName("stroke");
  for (var s = 0; s < strokes.length; s++) {
    strokes[s].setAttribute("stroke", color);
  }
}

function swipeToggle() {
  var el = document.getElementById("swipe"),
    color;
  if (swipeControls.status() == "off") {
    color = onColor;
    swipeControls.setup();
  } else {
    color = offColor;
    swipeControls.teardown();
  }

  var fills = el.contentDocument.getElementsByClassName("fill");
  for (var f = 0; f < fills.length; f++) {
    fills[f].setAttribute("fill", color);
  }

  var strokes = el.contentDocument.getElementsByClassName("stroke");
  for (var s = 0; s < strokes.length; s++) {
    strokes[s].setAttribute("stroke", color);
  }
}

function isMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

window.onload = function() {
  if (isMobile()) {
    arrowToggle();
    swipeToggle();
  }
  keyboardControls.setup();
}

var startDiv = document.getElementById("start");

function changeGridSize(change) {
  var widthBox = document.getElementsByName("width"),
    heightBox = document.getElementsByName("height");

  //for (var i = 0; i < widthBox.length; i++) {
    if (change == "bigger") {
      widthBox[0].value = parseInt(widthBox[0].value) + 3;
      heightBox[0].value = parseInt(heightBox[0].value) + 6;
    }
    if (change == "smaller") {
      widthBox[0].value = parseInt(widthBox[0].value) - 3;
      heightBox[0].value = parseInt(heightBox[0].value) - 6;
    }

    if (widthBox[0].value < 9) {
      widthBox[0].value = 9;
      heightBox[0].value = 18;
    }
  //}
}

function gridSizeListeners() {
  var contract = document.getElementsByClassName("size-button smaller"),
    expand = document.getElementsByClassName("size-button bigger");

  for (var i = 0; i < contract.length; i++) {
    contract[i].addEventListener('click', function() {
      changeGridSize("smaller");
    }, false);
    expand[i].addEventListener('click', function() {
      changeGridSize("bigger");
    }, false);
  }
}

function gameoverHandler() {
  transitionIn(document.getElementById('gameover'), "menu slide-in");

  document.getElementsByName("width")[0].value = tetris.dimensions().width;
  document.getElementsByName("height")[0].value = tetris.dimensions().height;
  gridSizeListeners();

  if (window.localStorage) {
    var highScore = window.localStorage.getItem("neontetris-" + tetris.mode() + "-highscore") || -1;

    if (tetris.score.total > highScore) {
      highScore = tetris.score.total;
      window.localStorage.setItem("neontetris-" + tetris.mode() + "-highscore", highScore);
    }
    document.getElementById('high-score').innerHTML = highScore;
  }

  document.getElementById('final-score').innerHTML = tetris.score.total;
  tetris.score.reset();
}
tetris.registerGameOverHandler(gameoverHandler);

function scoreHandler(addScore) { // TODO this should probably be an object, handlers should probably be objects
  tetris.score.add(addScore);

  document.getElementById("score-display").innerHTML = tetris.score.total;

  var elem = document.getElementById('notification');
  elem.innerHTML = "+" + addScore;
  elem.className = "notification show";
  window.setTimeout(function() {
    document.getElementById('notification').className = "notification hide";
  }, 1000);
}
tetris.registerScoreHandler(scoreHandler)

var marquee = startDiv.getElementsByTagName("span"),
  colors = tetris.colors();
for (var i = 0; i < marquee.length; i++) {
  marquee[i].style.color = getRandomIndex(colors.blocks);

}

transitionIn(startDiv, "menu slide-in");
gridSizeListeners();

document.getElementById("marquee").className = "animate";

var container = document.getElementById("container");
var canvas = document.getElementById("game");
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;

function startGame(mode) {
  var widthBox = document.getElementsByName("width")[0];
  var heightBox = document.getElementsByName("height")[0];

  var menus = document.getElementsByClassName("menu");
  for (var i = 0; i < menus.length; i++) {
    transitionOut(menus[i], "menu slide-out", 1000);
  }

  var savedGame = JSON.parse(window.localStorage.getItem("neontetris-savedgame"));
  if (mode == "resume" && savedGame) {
    tetris.setters.config(savedGame.config);
    savedGame.pieces.shift();
    tetris.setters.pieces(savedGame.pieces);
    tetris.score.total = parseInt(savedGame.score);

    document.getElementById("score-display").innerHTML = tetris.score.total;
  } else {
    if (mode)
      tetris.mode(mode);

    tetris.dimensions({
      width: parseInt(widthBox.value),
      height: parseInt(heightBox.value)
    });
    tetris.setters.pieces();
    document.getElementById("score-display").innerHTML = 0;
  }

  tetris.assignCanvas("game");

  tetris.start();
}