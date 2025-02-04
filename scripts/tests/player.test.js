import { Player, PlayerBot } from "../player.js";
import Gameboard from "../gameboard.js";

describe("Player class has a gameboard", () => {
  const testPLayer1 = new Player();

  test("Gameboard matches Gameboard class", () => {
    expect(testPLayer1.gameboard).toBeInstanceOf(Gameboard);
  });
});

describe("PlayerBot class is subclass of Player, that can make automatic random plays", () => {
  const testBot1 = new PlayerBot();

  test("PLayerBot is subclass of Player", () => {
    expect(Object.getPrototypeOf(PlayerBot)).toBe(Player);
  });

  test("Attack by PlayerBot returns valid random x & y coordinates", () => {
    const results = testBot1.sendRandomAttack();

    expect(results.randomX).toBeGreaterThanOrEqual(0);
    expect(results.randomX).toBeLessThan(10);
    expect(results.randomY).toBeGreaterThanOrEqual(0);
    expect(results.randomY).toBeLessThan(10);
  });

  test("PlayerBot doesn't repeat attacks to same coordinates", () => {
    function isRepeated() {
      const listOfAttacks = [];

      for (let i = 0; i < 99; i++) {
        const results = testBot1.sendRandomAttack();
        listOfAttacks.push(results);
      }

      while (listOfAttacks.length > 1) {
        for (let j = 0; j < listOfAttacks.length - 1; j++) {
          if (
            listOfAttacks[listOfAttacks.length - 1].randomX ===
              listOfAttacks[j].randomX &&
            listOfAttacks[listOfAttacks.length - 1].randomY ===
              listOfAttacks[j].randomY
          ) {
            return true;
          }
        }
        listOfAttacks.pop(listOfAttacks[listOfAttacks.length - 1]);
      }
      return false;
    }

    const repeated = isRepeated();
    expect(repeated).toBeFalsy();
  });
});
