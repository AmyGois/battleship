import Gameboard from "../gameboard.js";

describe("Gameboard class creates objects with list of squares, 5 ships & info on attacks", () => {
  const testBoard = new Gameboard();

  describe("Gameboard has 'board' property, whith list of squares, with info on squares", () => {
    test("Gameboard has board property that is array", () => {
      expect(Array.isArray(testBoard.board)).toBe(true);
    });

    test("Board property is an array of 10 arrays, each with 10 items", () => {
      expect(testBoard.board.length).toBe(10);
      expect(testBoard.board[0].length).toBe(10);
    });

    test("Each item in board property has properties: 'shipName' & 'isHit'", () => {
      expect(testBoard.board[0][0]).toHaveProperty("ship");
      expect(testBoard.board[0][0]).toHaveProperty("isHit");
    });
  });

  describe("Gameboard has 5 ships that can be placed on the board", () => {
    test("Gameboard has 'ships' property that is an object", () => {
      expect(typeof testBoard.ships).toBe("object");
    });

    test("Gameboard can place carrier on board", () => {
      testBoard.placeCarrier("horizontal", 1, 5);
      expect(testBoard.board[1][5].ship).toBe(testBoard.ships.carrier);
      expect(testBoard.board[1][9].ship).toBe(testBoard.ships.carrier);
    });

    test("Gameboard can place battleship on board", () => {
      testBoard.placeBattleship("horizontal", 2, 5);
      expect(testBoard.board[2][5].ship).toBe(testBoard.ships.battleship);
      expect(testBoard.board[2][8].ship).toBe(testBoard.ships.battleship);
    });

    test("Gameboard can place destroyer on board", () => {
      testBoard.placeDestroyer("horizontal", 3, 5);
      expect(testBoard.board[3][5].ship).toBe(testBoard.ships.destroyer);
      expect(testBoard.board[3][7].ship).toBe(testBoard.ships.destroyer);
    });

    test("Gameboard can place submarine on board", () => {
      testBoard.placeSubmarine("horizontal", 4, 5);
      expect(testBoard.board[4][5].ship).toBe(testBoard.ships.submarine);
      expect(testBoard.board[4][7].ship).toBe(testBoard.ships.submarine);
    });

    test("Gameboard can place patrol boat on board", () => {
      testBoard.placePatrolBoat("vertical", 1, 2);
      expect(testBoard.board[1][2].ship).toBe(testBoard.ships.patrolBoat);
      expect(testBoard.board[2][2].ship).toBe(testBoard.ships.patrolBoat);
    });

    test("Ship can't be placed on square with other ship on it", () => {
      expect(() => testBoard.placeBattleship("horizontal", 1, 5)).toThrow(
        "Ship can't be placed on top of another ship!"
      );
    });

    test("Ship can't be placed beyond the board", () => {
      expect(() => testBoard.placeBattleship("horizontal", -1, 11)).toThrow(
        "Invalid coordinates!"
      );
    });

    test("Ships can automatically be placed at random locations on the board", () => {
      const testBoard2 = new Gameboard();

      function checkForShip(ship) {
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            if (testBoard2.board[i][j].ship === ship) {
              return true;
            }
          }
        }

        return false;
      }

      testBoard2.placeShipsRandomly();

      expect(checkForShip(testBoard2.ships.carrier)).toBe(true);
      expect(checkForShip(testBoard2.ships.battleship)).toBe(true);
      expect(checkForShip(testBoard2.ships.destroyer)).toBe(true);
      expect(checkForShip(testBoard2.ships.submarine)).toBe(true);
      expect(checkForShip(testBoard2.ships.patrolBoat)).toBe(true);
    });
  });

  describe("Gameboard records attacks from opponent, and indicates when ships are hit & sunk", () => {
    test("Gameboard records that square was hit", () => {
      testBoard.receiveAttack(9, 9);
      expect(testBoard.board[9][9].isHit).toBe(true);
    });

    test("Attack with coordinates beyond the board throws error", () => {
      expect(() => testBoard.receiveAttack(-1, 11)).toThrow(
        "Invalid coordinates!"
      );
    });

    test("Attack on coordinates that have already been hit throws error", () => {
      expect(() => testBoard.receiveAttack(9, 9)).toThrow(
        "This square has already been hit!"
      );
    });

    test("Attacks to all squares a ship is on sinks the ship", () => {
      testBoard.receiveAttack(1, 2);
      expect(testBoard.receiveAttack(2, 2).shipSunk).toBe("patrol boat");
      expect(testBoard.ships.patrolBoat.isSunk()).toBe(true);
    });

    test("Gameboard records when all ships have been sunk", () => {
      expect(testBoard.allShipsSunk()).toBe(false);
      testBoard.receiveAttack(1, 5);
      testBoard.receiveAttack(1, 6);
      testBoard.receiveAttack(1, 7);
      testBoard.receiveAttack(1, 8);
      testBoard.receiveAttack(1, 9);
      testBoard.receiveAttack(2, 5);
      testBoard.receiveAttack(2, 6);
      testBoard.receiveAttack(2, 7);
      testBoard.receiveAttack(2, 8);
      testBoard.receiveAttack(3, 5);
      testBoard.receiveAttack(3, 6);
      testBoard.receiveAttack(3, 7);
      testBoard.receiveAttack(4, 5);
      testBoard.receiveAttack(4, 6);
      testBoard.receiveAttack(4, 7);
      expect(testBoard.allShipsSunk()).toBe(true);
    });
  });
});
