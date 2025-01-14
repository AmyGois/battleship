import Ship from "./ship.js";

class Square {
  constructor() {
    this.ship = null;
    this.isHit = false;
  }
}

class Gameboard {
  #shipsSunk;

  constructor() {
    this.board = this.#buildBoard();
    this.ships = this.#buildShips();
    this.#shipsSunk = 0;
  }

  #buildBoard() {
    let newBoard = [];

    for (let i = 0; i < 10; i++) {
      newBoard[i] = [];

      for (let j = 0; j < 10; j++) {
        newBoard[i][j] = new Square();
      }
    }

    return newBoard;
  }

  #buildShips() {
    return {
      carrier: new Ship(5),
      battleship: new Ship(4),
      destroyer: new Ship(3),
      submarine: new Ship(3),
      patrolBoat: new Ship(2),
    };
  }

  #placeShip(ship, direction, x, y) {
    if (direction === "horizontal") {
      if (x < 0 || x > this.board.length) {
        throw new Error(this.#errorMsgs.invalidCoordinates);
      }

      for (let i = 0; i < ship.shipLength; i++) {
        if (y + i < 0 || y + i > this.board[0].length) {
          throw new Error(this.#errorMsgs.invalidCoordinates);
        }

        if (this.board[x][y + i].ship !== null) {
          throw new Error(this.#errorMsgs.shipOverlap);
        }
      }

      for (let i = 0; i < ship.shipLength; i++) {
        this.board[x][y + i].ship = ship;
      }
    } else if (direction === "vertical") {
      if (y < 0 || y > this.board[0].length) {
        throw new Error(this.#errorMsgs.invalidCoordinates);
      }

      for (let i = 0; i < ship.shipLength; i++) {
        if (x + i < 0 || x + i > this.board.length) {
          throw new Error(this.#errorMsgs.invalidCoordinates);
        }

        if (this.board[x + i][y].ship !== null) {
          throw new Error(this.#errorMsgs.shipOverlap);
        }
      }

      for (let i = 0; i <= ship.shipLength; i++) {
        this.board[x + i][y].ship = ship;
      }
    }
  }

  placeCarrier(direction, x, y) {
    this.#placeShip(this.ships.carrier, direction, x, y);
  }

  placeBattleship(direction, x, y) {
    this.#placeShip(this.ships.battleship, direction, x, y);
  }

  placeDestroyer(direction, x, y) {
    this.#placeShip(this.ships.destroyer, direction, x, y);
  }

  placeSubmarine(direction, x, y) {
    this.#placeShip(this.ships.submarine, direction, x, y);
  }

  placePatrolBoat(direction, x, y) {
    this.#placeShip(this.ships.patrolBoat, direction, x, y);
  }

  #placeRandom(ship) {
    try {
      function getRandomDirection() {
        const random = Math.floor(Math.random() * 2);

        if (random === 0) {
          return "horizontal";
        } else {
          return "vertical";
        }
      }
      const randomDirection = getRandomDirection();
      const randomX = Math.floor(Math.random() * 10);
      const randomY = Math.floor(Math.random() * 10);

      this.#placeShip(ship, randomDirection, randomX, randomY);
    } catch (error) {
      this.#placeRandom(ship);
    }
  }

  placeShipsRandomly() {
    this.#placeRandom(this.ships.carrier);
    this.#placeRandom(this.ships.battleship);
    this.#placeRandom(this.ships.destroyer);
    this.#placeRandom(this.ships.submarine);
    this.#placeRandom(this.ships.patrolBoat);
  }

  receiveAttack(x, y) {
    if (x < 0 || x > this.board.length || y < 0 || y > this.board[0].length) {
      throw new Error(this.#errorMsgs.invalidCoordinates);
    }

    if (this.board[x][y].isHit === true) {
      throw new Error(this.#errorMsgs.alreadyHitSquare);
    }

    let shipSunk = null;
    this.board[x][y].isHit = true;

    if (this.board[x][y].ship !== null) {
      this.board[x][y].ship.hit();

      if (this.board[x][y].ship.isSunk() === true) {
        shipSunk = this.sunkMessage(this.board[x][y].ship);
        this.#shipsSunk += 1;
      }
    }

    return { square: this.board[x][y], shipSunk: shipSunk };
  }

  sunkMessage(ship) {
    switch (ship) {
      case this.ships.carrier:
        return "carrier";
      case this.ships.battleship:
        return "battleship";
      case this.ships.destroyer:
        return "destroyer";
      case this.ships.submarine:
        return "submarine";
      case this.ships.patrolBoat:
        return "patrol boat";
      default:
        return this.#errorMsgs.somethingWrong;
    }
  }

  allShipsSunk() {
    if (this.#shipsSunk < Object.keys(this.ships).length) {
      return false;
    } else if (this.#shipsSunk === Object.keys(this.ships).length) {
      return true;
    }
  }

  #errorMsgs = {
    invalidCoordinates: "Invalid coordinates!",
    shipOverlap: "Ship can't be placed on top of another ship!",
    alreadyHitSquare: "This square has already been hit!",
    somethingWrong: "Something went wrong!",
  };
}

export default Gameboard;
