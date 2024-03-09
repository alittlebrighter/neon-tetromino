function getRandomIndex(arr) {
  return arr[Math.round(Math.random() * 100) % arr.length];
}

function numberCompare(a, b) {
  a = parseFloat(a);
  b = parseFloat(b);

  if (a === b)
    return 0;
  else if (a < b)
    return -1;
  else if (a > b)
    return 1;
}

function fakeEvent() {
  this.handlers = {};
}

fakeEvent.prototype.register = function(e, cb) {
  this.handlers[e] = cb;
};

fakeEvent.prototype.dispatchEvent = function(e, arg) {
  if (arg)
    this.handlers[e](arg);
  else
    this.handlers[e]();
};

var tetris = (function() {

  var canvas, ctx, blockSize, startX, startY, grid, activePiece, pieces = [],
    eloop, hitBottom, state = "stopped",
    timeElapsed = 0,
    defaultDirection, events = new fakeEvent(),
    moveDown = 0,
    config = {
      speed: {
        current: 500,
        max: 300,
        min: 600
      },
      mode: 'normal',
      blockGrid: {
        width: 12,
        height: 24
      },
      wallWidth: 4.25,
      colors: {
        walls: 'rgb(248,248,255)',
        blocks: [
          'rgb(0,255,0)', // green
          'rgb(255, 153, 51)', // orange
          'rgb(243,243,21)', // yellow
          'rgb(255,0,170)', // pink
          'rgb(170,0,255)', // purple
          'rgb(0,229,255)' // blue
        ]
      }
    }, blockGroups = [
      // pivot is assumed to be the first block pushed into blocks
      function(index) { // T
        return [index, index + config.blockGrid.width, index + 1, index - 1];
      },
      function(index) { // L
        return [index, index + 1, index + config.blockGrid.width, index + config.blockGrid.width * 2];
      },
      function(index) { // reverse L
        return [index, index - 1, index + config.blockGrid.width, index + config.blockGrid.width * 2];
      },
      function(index) { // S
        return [index, index + 1, index + config.blockGrid.width, index + config.blockGrid.width - 1];
      },
      function(index) { // Z
        return [index, index - 1, index + config.blockGrid.width, index + config.blockGrid.width + 1];
      },
      function(index) { // I
        return [index + config.blockGrid.width, index, index + config.blockGrid.width * 2, index + config.blockGrid.width * 3];
      },
      function(index) { // O
        return [index, index + 1, index + config.blockGrid.width, index + config.blockGrid.width + 1];
      }
    ],
    directionTranslator = function(action, currentIndex) {
      if (action == "down")
        return currentIndex + config.blockGrid.width;
      else if (action == "left")
        return currentIndex - 1;
      else if (action == "right")
        return currentIndex + 1;
      else if (action == "up")
        return currentIndex - config.blockGrid.width;
      else
        return currentIndex;
    };

  function assignCanvas(canvasId) {
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext("2d");
  }

  function initialize() {

    blockSize = (Math.floor(canvas.height * 0.95) + config.wallWidth) / config.blockGrid.height;
    if (canvas.width * 0.95 < blockSize * config.blockGrid.width + config.wallWidth * 2)
      blockSize = (Math.floor(canvas.width * 0.95) + config.wallWidth) / config.blockGrid.width;

    startX = Math.round(canvas.width / 2 - blockSize * config.blockGrid.width / 2) + 0.5
    startY = Math.round(canvas.height / 2 - blockSize * config.blockGrid.height / 2) + 0.5;

    drawWalls();
    initializeGrid();
  }

  function drawWalls() {
    ctx.strokeStyle = config.colors.walls;

    var wallStartX = startX - 3;
    ctx.moveTo(wallStartX, startY);
    ctx.lineTo(wallStartX, Math.round(startY + blockSize * config.blockGrid.height) + 3.5);
    ctx.lineTo(wallStartX + blockSize * config.blockGrid.width + 6.5, Math.round(startY + blockSize * config.blockGrid.height) + 3.5);
    ctx.lineTo(wallStartX + blockSize * config.blockGrid.width + 6.5, startY);
    ctx.stroke();
  }

  function initializeGrid() {

    ctx.clearRect(startX, startY, config.blockGrid.width * blockSize, config.blockGrid.height * blockSize);
    grid = [];

    for (var i = 0; i < config.blockGrid.height; i++) {
      for (var j = 0; j < config.blockGrid.width; j++) {
        grid.push(new gridSquare(startX, startY, j, i));
      }
    }
  }

  function gridSquare(startX, startY, xIndex, yIndex) {
    this.row = yIndex;
    this.x = startX + (xIndex % config.blockGrid.width) * blockSize;
    this.y = startY + yIndex * blockSize;
    this.drawX = Math.round(startX + (xIndex % config.blockGrid.width) * blockSize) + 1.5;
    this.drawY = Math.round(startY + yIndex * blockSize) + 1.5;
    this.drawBlockSize = Math.floor(blockSize) - 2.5;
    this.occupied = false;
  }

  gridSquare.prototype.draw = function(color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.drawX, this.drawY, this.drawBlockSize, this.drawBlockSize);
    this.occupied = true;
  };

  gridSquare.prototype.paint = function(color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.drawX, this.drawY, this.drawBlockSize, this.drawBlockSize);
  };

  gridSquare.prototype.clear = function() {
    ctx.clearRect(this.x, this.y, blockSize, blockSize);
    this.occupied = false;
  };

  gridSquare.prototype.erase = function() {
    ctx.clearRect(this.x, this.y, blockSize, blockSize);
  };

  // a piece is a group of blocks
  function piece(gridStartIndex, indexes, color) {
    this.color = color || getRandomIndex(config.colors.blocks);
    this.indexMap = indexes || getRandomIndex(blockGroups)(gridStartIndex);
  }

  piece.prototype.draw = function() {
    for (var index in this.indexMap)
      grid[this.indexMap[index]].draw(this.color);
  };

  piece.prototype.clear = function() {
    for (var index in this.indexMap)
      grid[this.indexMap[index]].clear();
  };

  piece.prototype.erase = function() {
    for (var index in this.indexMap)
      grid[this.indexMap[index]].erase();
  };

  piece.prototype.pickup = function() {
    for (var index in this.indexMap)
      grid[this.indexMap[index]].occupied = false;
  };

  piece.prototype.putdown = function() {
    for (var index in this.indexMap)
      grid[this.indexMap[index]].occupied = true;
  };

  piece.prototype.move = function(direction) {
    var proposal = this.indexMap.concat(),
      collisions = 0;

    this.pickup();

    for (var index in this.indexMap) {
      proposal[index] = directionTranslator(direction, this.indexMap[index]);
      if (Math.floor(proposal[index] / config.blockGrid.width) < config.blockGrid.height && // hit bottom
        !(proposal[index] % config.blockGrid.width == 0 && this.indexMap[index] % config.blockGrid.width == config.blockGrid.width - 1) && // hit right wall
        !(proposal[index] % config.blockGrid.width == config.blockGrid.width - 1 && this.indexMap[index] % config.blockGrid.width == 0) && // hit left wall
        !grid[proposal[index]].occupied) { // hit another block
        continue;
      } else {
        collisions++;
        break;
      }
    }

    if (collisions === 0) {
      this.clear();
      this.indexMap = proposal.concat();
      this.draw();
      return true;
    } else {
      this.putdown();
      return false;
    }
  };

  piece.prototype.pivot = function() {
    this.pickup();

    var pivot = this.indexMap[0],
      proposal = this.indexMap.concat(),
      collisions = 0;
    for (var i = 1; i < this.indexMap.length; i++) {
      if (this.indexMap[i] % config.blockGrid.width == pivot % config.blockGrid.width) {
        // block is directly above or below pivot
        var yDelta = Math.floor(this.indexMap[i] / config.blockGrid.width) - Math.floor(pivot / config.blockGrid.width);

        if (yDelta > 0) { // block is below pivot
          for (var d = 0; d < yDelta; d++) {
            proposal[i] = proposal[i] - config.blockGrid.width - 1;
          }
        } else { // block is above pivot
          for (var de = 0; de > yDelta; de--) {
            proposal[i] = proposal[i] + config.blockGrid.width + 1;
          }
        }
      } else if (Math.floor(this.indexMap[i] / config.blockGrid.width) == Math.floor(pivot / config.blockGrid.width)) {
        // block is in the same row as pivot
        var xDelta = (this.indexMap[i] % config.blockGrid.width) - (pivot % config.blockGrid.width);

        if (xDelta > 0) { // block is right of pivot
          for (var xd = 0; xd < xDelta; xd++) {
            proposal[i] = proposal[i] - 1 + config.blockGrid.width;
          }
        } else { // block is left of pivot
          for (var xde = 0; xde > xDelta; xde--) {
            proposal[i] = proposal[i] + 1 - config.blockGrid.width;
          }
        }
      } else {
        // block is diagonal from pivot
        if (this.indexMap[i] == pivot - config.blockGrid.width + 1) { // block is up and right of pivot
          proposal[i] = proposal[i] + config.blockGrid.width * 2;
        } else if (this.indexMap[i] == pivot - config.blockGrid.width - 1) { // block is up and left of pivot
          proposal[i] = proposal[i] + 2;
        } else if (this.indexMap[i] == pivot + config.blockGrid.width - 1) { // block is down and left of pivot
          proposal[i] = proposal[i] - config.blockGrid.width * 2;
        } else { // block is down and right of pivot
          proposal[i] = proposal[i] - 2;
        }
      }

      if (Math.floor(proposal[i] / config.blockGrid.width) < config.blockGrid.height && // hit bottom
        !(proposal[i] % config.blockGrid.width <= 1 && this.indexMap[i] % config.blockGrid.width >= config.blockGrid.width - 2) && // hit right wall
        !(proposal[i] % config.blockGrid.width >= config.blockGrid.width - 2 && this.indexMap[i] % config.blockGrid.width <= 1) && // hit left wall
        !grid[proposal[i]].occupied) { // hit another block
        continue;
      } else {
        collisions++;
        break;
      }
    }

    if (collisions === 0) {
      this.clear();
      this.indexMap = proposal.concat();
      this.draw();
      return true;
    } else {
      this.putdown();
      return false;
    }
  };

  function eraseRows(rows) {
    for (var row in rows) {
      var startX = grid[rows[row] * config.blockGrid.width].x,
        startY = grid[rows[row] * config.blockGrid.width].y,
        piecesToSplice = {}, piecesToAdd = [];

      for (var p in pieces) {
        var tmpIndexes = pieces[p].indexMap.concat(),
          indexesToSplice = [],
          pieceAbove = new piece(0, [], pieces[p].color),
          pieceBelow = new piece(0, [], pieces[p].color);

        for (var index in pieces[p].indexMap) {
          var iRow = Math.floor(pieces[p].indexMap[index] / config.blockGrid.width);
          if (iRow == rows[row]) {
            grid[pieces[p].indexMap[index]].clear();
            tmpIndexes.splice(tmpIndexes.indexOf(pieces[p].indexMap[index]), 1);
            piecesToSplice[p] = true;

            for (var i in pieces[p].indexMap) {
              if (Math.floor(pieces[p].indexMap[i] / config.blockGrid.width) < rows[row])
                pieceAbove.indexMap.push(pieces[p].indexMap[i]);
              else if (Math.floor(pieces[p].indexMap[i] / config.blockGrid.width) > rows[row])
                pieceBelow.indexMap.push(pieces[p].indexMap[i]);
            }
          }
        }

        if (pieceAbove.indexMap.length > 0)
          piecesToAdd.push(pieceAbove);

        if (pieceBelow.indexMap.length > 0)
          piecesToAdd.push(pieceBelow);
      }

      piecesToSplice = Object.keys(piecesToSplice).sort(numberCompare).reverse();
      for (var pIndex in piecesToSplice) {
        pieces[piecesToSplice[pIndex]].clear();
        pieces.splice(piecesToSplice[pIndex], 1);
      }

      for (var pc in piecesToAdd)
        piecesToAdd[pc].draw();

      pieces = pieces.concat(piecesToAdd);
    }
  }

  function rowCheck() {
    var rowsToErase = [];
    for (var row = config.blockGrid.height - 1; row >= 0; row--) {
      var rowComplete = true;
      for (j = 0; j < config.blockGrid.width; j++) {
        if (grid[config.blockGrid.width * parseInt(row) + j].occupied)
          continue;
        else {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete)
        rowsToErase.push(row);
    }
    if (rowsToErase.length > 0) {
      events.dispatchEvent('score', Math.pow(config.blockGrid.width, rowsToErase.length));
      eraseRows(rowsToErase.sort().reverse());
    }
  }

  function moveActivePiece(direction) {

    if (direction == "pivot") {
      pieces[0].pivot();
    } else if (pieces[0].move(direction)) {
      if (direction == "down")
        moveDown++;
    } else if (direction == "down") {
      hitBottom++;
    }
  }

  // main event loop
  var main = function() {
    if (timeElapsed < 2 && moveDown < 2 && hitBottom == 1) {
      end();
    } else if (hitBottom > 0) {
      pause();

      rowCheck();

      if (config.mode !== "speed") {
        if (config.speed.current > config.speed.min && config.speed.current < config.speed.max)
          config.speed.current = config.speed.current - (timeElapsed + Math.floor(config.blockGrid.height / 2) / 4);
        else if (config.speed < config.speed.min)
          config.speed.current = config.speed.current + Math.abs(timeElapsed + Math.floor(config.blockGrid.height / 2));
        else if (config.speed.current > config.speed.max)
          config.speed.current = config.speed.current - Math.abs(timeElapsed + Math.floor(config.blockGrid.height / 2));
      }

      timeElapsed = 0;
      moveDown = 0;
      pieces.unshift(new piece((config.blockGrid.width - config.blockGrid.width % 2) / 2));
      pieces[0].draw();
      hitBottom = 0;
      pause();

      if (config.mode == "night")
        for (var pc in pieces)
          pieces[pc].draw();
    } else {
      moveActivePiece("down");
      for (var p = pieces.length - 1; p >= 1; p--) {
        pieces[p].move(defaultDirection);

        if (config.mode == "night" && pieces.length > 1 &&
          timeElapsed + moveDown > Math.floor(pieces[1].indexMap[0] / config.blockGrid.width) * (1 / 3))
          pieces[p].erase();
      }
      timeElapsed++;
    }
  };

  function start() {
    initialize();

    if (config.mode == "slide")
      defaultDirection = "right";
    else
      defaultDirection = "down";

    if (config.mode == "speed")
      config.speed.current = 150;
    else
      config.speed.current = 500;

    timeElapsed = 0;
    moveDown = 0;
    hitBottom = 0;

    for (var pc in pieces)
      pieces[pc].draw();

    pieces.unshift(new piece((config.blockGrid.width - config.blockGrid.width % 2) / 2));

    eloop = window.setInterval(main, config.speed.current);

    state = "running";
  }

  function pause() {
    if (state == "paused") {
      state = "running";
      eloop = window.setInterval(main, config.speed.current);
    } else {
      state = "paused";
      window.clearInterval(eloop);
    }
  }

  function end() {
    window.clearInterval(eloop);
    events.dispatchEvent("gameover");
  }

  function colors(newColors) {
    if (newColors)
      config.colors = newColors;

    return config.colors;
  }

  function changeMode(newMode) {
    if (newMode)
      config.mode = newMode;

    return config.mode;
  }

  function dimensions(newDimensions) {
    if (newDimensions)
      config.blockGrid = newDimensions;

    return config.blockGrid;
  }

  score = {
    total: 0,
    add: function(newScore) {
      this.total += newScore;

      return this.total;
    },
    reset: function() {
      this.total = 0;

      return this.total;
    }
  };

  function registerGameOverHandler(handler) {
    events.register('gameover', handler);
  }

  function registerScoreHandler(handler) {
    events.register('score', handler);
  }

  function setConfig(newConfig) {
    config = newConfig;
  }

  function getConfig() {
    return config;
  }

  function setPieces(newPieces) {
    if (newPieces) {
      pieces = newPieces;

      for (var pc in pieces) {
        pieces[pc] = new piece(0, pieces[pc].indexMap, pieces[pc].color);
      }
    } else
      pieces = [];
  }

  function getPieces() {
    return pieces;
  }

  return {
    getters: {
      config: getConfig,
      pieces: getPieces
    },
    setters: {
      config: setConfig,
      pieces: setPieces
    },
    assignCanvas: assignCanvas,
    start: start,
    pause: pause,
    end: end,
    controlActive: moveActivePiece,
    restart: start,
    mode: changeMode,
    colors: colors,
    dimensions: dimensions,
    score: score,
    registerGameOverHandler: registerGameOverHandler,
    registerScoreHandler: registerScoreHandler
  }
})();