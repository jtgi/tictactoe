const TicTacToe = require('../lib/TicTacToe');
const rand = require('../util/rand');

function main() {
  const game = new TicTacToe(
    { name: 'X' },
    { name: 'O' }
  );

  game.on('onStart', event => console.log(`Let the games begin! ${event.player}'s turn`));
  game.on('onGameOver', event => console.log(`Congratulations ${event.player}, you win.`));
  game.on('onTurnComplete', event => console.log(`${event.player} moved to (${event.x}, ${event.y})`));

  game.start();
  while (!game.isGameOver()) {
    const pos = game.getOpenPositions();
    const index = pos[rand(pos.length - 1)];
    const [x, y] = index;
    game.move(x, y);
  }

  game.printBoard();
}

main();