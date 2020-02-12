const TicTacToe = require('../lib/TicTacToe');
const rand = require('../util/rand');

function main() {
  const game = new TicTacToe(
    { name: 'X', generateMove: (board, pos) => pos[rand(pos.length - 1)] },
    { name: 'O', generateMove: (board, pos) => pos[rand(pos.length - 1)] }
  );

  game.on('onStart', event => console.log(`Let the games begin! ${event.player}'s turn`));
  game.on('onGameOver', event => console.log(`Congratulations ${event.player}, you win.`));
  game.on('onTurnComplete', event => console.log(`${event.player} moved to (${event.x}, ${event.y})`));
  game.on('onTurnBegin', () => {});

  game.start();
  game.printBoard();
}

main();