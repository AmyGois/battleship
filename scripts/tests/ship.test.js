import Ship from "../ship.js";

describe("Ship class creates objects with length, hits (private) & 'is sunk' properties", () => {
  const testShip = new Ship(4);

  test("New Ship creates object with correct ship length property", () => {
    expect(testShip.shipLength).toBe(4);
  });

  test("isSunk() returns true if number of hits equals length, false otherwise", () => {
    expect(testShip.isSunk()).toBe(false);
    testShip.hit();
    expect(testShip.isSunk()).toBe(false);
    testShip.hit();
    testShip.hit();
    testShip.hit();
    expect(testShip.isSunk()).toBe(true);
  });

  test("Ship constructor throws error if length argument isn't a number, or is nonexistant", () => {
    expect(() => new Ship("bad")).toThrow(Error);
    expect(() => new Ship()).toThrow(Error);
  });
});
