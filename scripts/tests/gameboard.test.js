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
      testBoard.placeCarrier("horizontal", 5, 1);
      expect(testBoard.board[5][1].ship).toBe(testBoard.ships.carrier);
      expect(testBoard.board[9][1].ship).toBe(testBoard.ships.carrier);
    });

    test("Gameboard can place battleship on board", () => {
      testBoard.placeBattleship("horizontal", 5, 2);
      expect(testBoard.board[5][2].ship).toBe(testBoard.ships.battleship);
      expect(testBoard.board[8][2].ship).toBe(testBoard.ships.battleship);
    });

    test("Gameboard can place destroyer on board", () => {
      testBoard.placeDestroyer("horizontal", 5, 3);
      expect(testBoard.board[5][3].ship).toBe(testBoard.ships.destroyer);
      expect(testBoard.board[7][3].ship).toBe(testBoard.ships.destroyer);
    });

    test("Gameboard can place submarine on board", () => {
      testBoard.placeSubmarine("horizontal", 5, 4);
      expect(testBoard.board[5][4].ship).toBe(testBoard.ships.submarine);
      expect(testBoard.board[7][4].ship).toBe(testBoard.ships.submarine);
    });

    test("Gameboard can place patrol boat on board", () => {
      testBoard.placePatrolBoat("vertical", 2, 1);
      expect(testBoard.board[2][1].ship).toBe(testBoard.ships.patrolBoat);
      expect(testBoard.board[2][2].ship).toBe(testBoard.ships.patrolBoat);
    });

    test("Ship can't be placed on square with other ship on it", () => {
      expect(() => testBoard.placeBattleship("horizontal", 5, 1)).toThrow(
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
        let count = 0;
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            if (testBoard2.board[i][j].ship === ship) {
              count++;
            }
          }
        }

        return count;
      }

      testBoard2.placeShipsRandomly();

      expect(checkForShip(testBoard2.ships.carrier)).toBe(5);
      expect(checkForShip(testBoard2.ships.battleship)).toBe(4);
      expect(checkForShip(testBoard2.ships.destroyer)).toBe(3);
      expect(checkForShip(testBoard2.ships.submarine)).toBe(3);
      expect(checkForShip(testBoard2.ships.patrolBoat)).toBe(2);
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
      testBoard.receiveAttack(2, 1);
      expect(testBoard.receiveAttack(2, 2).shipSunk).toBe("patrol boat");
      expect(testBoard.ships.patrolBoat.isSunk()).toBe(true);
    });

    test("Gameboard records when all ships have been sunk", () => {
      expect(testBoard.allShipsSunk()).toBe(false);
      testBoard.receiveAttack(5, 1);
      testBoard.receiveAttack(6, 1);
      testBoard.receiveAttack(7, 1);
      testBoard.receiveAttack(8, 1);
      testBoard.receiveAttack(9, 1);
      testBoard.receiveAttack(5, 2);
      testBoard.receiveAttack(6, 2);
      testBoard.receiveAttack(7, 2);
      testBoard.receiveAttack(8, 2);
      testBoard.receiveAttack(5, 3);
      testBoard.receiveAttack(6, 3);
      testBoard.receiveAttack(7, 3);
      testBoard.receiveAttack(5, 4);
      testBoard.receiveAttack(6, 4);
      testBoard.receiveAttack(7, 4);
      expect(testBoard.allShipsSunk()).toBe(true);
    });
  });
});
