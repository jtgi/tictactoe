const EventEmitter = require('events');
const _ = require('lodash');

const ON_TURN_BEGIN = 'onTurnBegin';
const ON_TURN_COMPLETE = 'onTurnComplete';
const ON_GAME_OVER = 'onGameOver';
const ON_START = 'onStart';

class TicTacToe extends EventEmitter {
  constructor(player1, player2) {
    super();

    this.player1 = player1;
    this.player2 = player2;
    this.moveLog = [];
    this.moveCount = 0;

    this._setTurn(player1);
    this.nextPlayer = player2;
    this._resetBoard();
    this.started = false;
  }

  start() {
    this.started = true;
    this.emit(ON_START, { player: this.currentPlayer.name });

    if (this.currentPlayer.generateMove) {
      this._generateNextMove();
    }
  }

  move(x, y) {
    if (!this.started || this.isGameOver()) {
      return;
    }

    if (this._isOutOfBounds(x, y)) {
      throw new Error(`Position (${x}, ${y}) is invalid.`);
    }

    if (this._isOccupied(x, y)) {
      throw new Error(`Position (${x}, ${y}) is already occupied by ${this.board[x][y]}`);
    }

    this.board[x][y] = this.currentPlayer.name;

    const event = {
      id: this.moveCount++,
      player: this.currentPlayer.name,
      board: this.board,
      x,
      y
    };

    this.moveLog.push(_.cloneDeep(event));
    this.emit(ON_TURN_COMPLETE, _.cloneDeep(event));

    if (this.isGameOver()) {
      this._endGame(this.currentPlayer);
      return;
    }

    const playerThatMoved = this.currentPlayer;
    this._setTurn(this.nextPlayer);
    this.nextPlayer = playerThatMoved;

    if (this.currentPlayer.generateMove) {
      this._generateNextMove();
    }
  }

  getOpenPositions() {
    const open = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[i][j] === '#' && open.push([i, j]);
      }
    }

    return open;
  }

  isGameOver() {
    return this._isOrthogonalVictory() || this._isDiagonalVictory() || this._isTie();
  }

  printBoard() {
    const b = this.board;
    console.log(`
       |     |     
    ${b[0][0]}  |  ${b[0][1]}  |  ${b[0][2]}  
  _____|_____|_____
       |     |     
    ${b[1][0]}  |  ${b[1][1]}  |  ${b[1][2]}  
  _____|_____|_____
       |     |     
    ${b[2][0]}  |  ${b[2][1]}  |  ${b[2][2]}  
       |     |     `.replace(/#/g, ' '));
  }

  _generateNextMove() {
    const res = this.currentPlayer.generateMove(this.board, this.getOpenPositions());
    return res instanceof Promise ?
      res.then(([x, y]) => this.move(x, y)).catch(console.error) : 
      this.move(res[0], res[1])
  }

  _isOccupied(x, y) {
    return this.board[x][y] !== '#';
  }

  _isOutOfBounds(x, y) {
    return (_.isUndefined(x) || _.isUndefined(y) || x > 2 || x < 0 || y > 2 || y < 0);
  }

  _resetBoard() {
    this.board = [
      ['#','#','#'],
      ['#','#','#'],
      ['#','#','#']
    ];
  }

  _setTurn(player) {
    this.currentPlayer = player;

    const event = _.cloneDeep({
      player: this.currentPlayer.name,
      board: this.board
    });

    this.emit(ON_TURN_BEGIN, event);
  }

  _isOrthogonalVictory() {
    const b = this.board;
    for (let i = 0; i < 3; i++) {
      if ((b[i][0] == b[i][1] && b[i][1] === b[i][2] && b[i][2] !== '#') ||
          (b[0][i] == b[1][i] && b[1][i] === b[2][i] && b[2][i] !== '#')) {
        return true;
      }
    }

    return false;
  }

  _isDiagonalVictory() {
    const b = this.board;
    return ((b[0][0] == b[1][1] && b[1][1] === b[2][2] && b[2][2] !== '#') ||
            (b[2][0] == b[1][1] && b[1][1] === b[0][2] && b[0][2] !== '#'));
  }

  _isTie() {
    return this.moveCount >= 9;
  }

  _endGame(winner) {
    const data = _.cloneDeep({
      player: winner.name,
      tie: this._isTie,
      board: this.board,
      moves: this.moveLog
    });

    this.emit(ON_GAME_OVER, data);
  }
}

module.exports = TicTacToe;