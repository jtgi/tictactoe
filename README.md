# Usage
```
make install
make start
```

# Problem
TIC TAC TOE!
Your code should read moves (as either tuples of moves or positions 0-8) from stdin on a turn-by-turn basis and output the state of the board after each move.
If there are illegal moves you should inform the user and then attempt to read the next move.
On game end (full board or a player winning) print out "Game Over" + the result.

# Approach
Input: x y is a 0 based x-y offset
  where x = horizontal offset
        y = vertical offset
 
  e.g. given position (1, 2), 1 down, 2 right.

```
  0 1 2
0 _|_|_
1 _|_|_
2  | |
```

## Adding AI
- TicTacToe constructor accepts a player object. If the player is provided with a `generateMove` function the engine will detect and invoke it automatically, [https://github.com/jtgi/2020/blob/master/w4-tictactoe/drivers/cli.js#L8](example). If both players provide generation functions as in [https://github.com/jtgi/2020/blob/master/w4-tictactoe/drivers/autoplay.js#L6-L7](autoplay) it'll just play itself. 

## Components:
- lib/tictactoe.js
  - maintains game state
  - exposes basic game manipulation
  - issues events throughout game lifecycle
- drivers/*
  - a few simple implementations of tic tac toe
  - cli.js: shows how you can use the simpler lib apis to build on top of with a cli read and write dynamic. Plays against a dumb 'AI' that chooses at position at random.
  - autoplay.js: configures two dumb AIs against each other.

# Other
- the class is too stateful, would rewrite in a more stateless functional style. especially with node's es6 support. 
