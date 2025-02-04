import Gameboard from "./gameboard.js";

class Player {
  constructor() {
    this.gameboard = new Gameboard();
  }
}

class PlayerBot extends Player {
  constructor() {
    super();
  }

  #enemyBoard = new Gameboard();

  sendRandomAttack() {
    let randomX;
    let randomY;

    do {
      randomX = Math.floor(Math.random() * 10);
      randomY = Math.floor(Math.random() * 10);
    } while (this.#enemyBoard.board[randomX][randomY].isHit === true);

    this.#enemyBoard.board[randomX][randomY].isHit = true;

    return { randomX, randomY };
  }
}

export { Player, PlayerBot };
