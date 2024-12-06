import Player from "../player.js";

describe("Player class defines if player is human or bot", () => {
  const testPlayer1 = new Player("human");
  const testPlayer2 = new Player("bot");

  test("Player is defined as human or bot", () => {
    expect(testPlayer1.type).toBe("human");
    expect(testPlayer2.type).toBe("bot");
  });
});
