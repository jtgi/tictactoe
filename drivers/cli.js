const TicTacToe = require('../lib/TicTacToe');
const rand = require('../util/rand');
const readline = require('readline-sync')

function main() {
  const game = new TicTacToe(
    { name: 'X' },
    { name: 'O', isBot: true, generateMove: (board, pos) => pos[rand(pos.length - 1)] }
  );

  game.on('onTurnComplete', event => {
    if (event.player === 'O') {
      console.log(`AI Bot "${event.player}" moved to (${event.x}, ${event.y})`);
    }
  });

  game.on('onGameOver', event => {
    if (event.isTie) {
      console.log('Tie game. Better luck next time');
    } else if (event.player === 'O') {
      console.log(`You've lost to AI Bot. Great job.`);
    } else {
      console.log(`Congratulations ${event.player}, you win.`);
    }
});

  readline.question('WELCOME TO TICTACTOE\n' + 
                    'Use input format "x y". Example "0 1" is 0 down, 1 right.\n' +
                    'Press Enter to start...');
  game.start();

  while(!game.isGameOver()) {
    game.printBoard();
    console.log('\n')

    try {
      const [x, y] = readline.question(`${game.currentPlayer.name}, your move: `)
                             .split(' ')
                             .map(num => parseInt(num.trim()));
      game.move(x, y);
    } catch(e) {
      console.log(`${e.message}. Try again.`);
    }
  }
}

main();