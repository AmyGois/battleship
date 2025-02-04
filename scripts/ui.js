import { Player, PlayerBot } from "./player.js";

const ui = (() => {
  const render = {
    emptyBoard: () => {
      const boards = document.querySelectorAll(".board");

      boards.forEach((board) => {
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            const btn = document.createElement("button");
            btn.dataset.x = `${j}`;
            btn.dataset.y = `${i}`;
            board.appendChild(btn);
          }
        }
      });
    },

    squareWithShip: (board, x, y) => {
      const square = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      square.classList.add("has-ship");
    },

    squareHit: (board, x, y) => {
      const square = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      square.classList.add("is-hit");
    },

    squareDisabled: (board, x, y) => {
      const square = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      square.classList.add("disabled");
    },

    allShipsOnBoard: (uiBoard, player) => {
      for (let i = 0; i < player.gameboard.board.length; i++) {
        for (let j = 0; j < player.gameboard.board[0].length; j++) {
          if (player.gameboard.board[i][j].ship !== null) {
            render.squareWithShip(uiBoard, i, j);
          }
        }
      }
    },

    boardDisabed: (board) => {
      board.classList.add("disabled");
    },

    boardEnabled: (board) => {
      board.classList.remove("disabled");
    },

    newEmptyGame: () => {
      const main = document.querySelector("main");
      const template = document.querySelector("#game");
      const gameUi = template.content.cloneNode(true);

      main.innerHTML = "";
      main.appendChild(gameUi);
      render.emptyBoard();
    },

    hitMessages: {
      enemyBoard: {
        emptySquare: () => {
          document.querySelector("#enemy-msg").textContent = "No ships here!";
        },
        shipHit: () => {
          document.querySelector("#enemy-msg").textContent = "It's a hit!";
        },
        shipSunk: (ship) => {
          document.querySelector(
            "#enemy-msg"
          ).textContent = `You sank the enemy's ${ship}!`;
        },
      },

      playerBoard: {
        emptySquare: () => {
          document.querySelector("#player-msg").textContent = "Phew! Missed!";
        },
        shipHit: () => {
          document.querySelector("#player-msg").textContent =
            "Oh no! You've been hit!";
        },
        shipSunk: (ship) => {
          document.querySelector(
            "#player-msg"
          ).textContent = `The enemy sank your ${ship}!`;
        },
      },
    },
  };

  const gamePlay = {
    hitSquare: (enemyPlayer, enemyBoard, x, y) => {
      const squareInfo = enemyPlayer.gameboard.receiveAttack(x, y);

      render.squareHit(enemyBoard, x, y);
      render.squareDisabled(enemyBoard, x, y);
      if (squareInfo.square.ship !== null) {
        render.squareWithShip(enemyBoard, x, y);
        if (squareInfo.shipSunk === null) {
          render.hitMessages.enemyBoard.shipHit();
        } else {
          render.hitMessages.enemyBoard.shipSunk(squareInfo.shipSunk);
        }
      } else {
        render.hitMessages.enemyBoard.emptySquare();
      }
      render.boardDisabed(enemyBoard);
    },

    botHitSquare: (botPlayer, humanPlayer, humanBoard) => {
      const coordinates = botPlayer.sendRandomAttack();
      const squareInfo = humanPlayer.gameboard.receiveAttack(
        coordinates.randomX,
        coordinates.randomY
      );

      render.squareHit(humanBoard, coordinates.randomX, coordinates.randomY);
      render.squareDisabled(
        humanBoard,
        coordinates.randomX,
        coordinates.randomY
      );
      if (squareInfo.square.ship !== null) {
        render.squareWithShip(
          humanBoard,
          coordinates.randomX,
          coordinates.randomY
        );
        if (squareInfo.shipSunk === null) {
          render.hitMessages.playerBoard.shipHit();
        } else {
          render.hitMessages.playerBoard.shipSunk(squareInfo.shipSunk);
        }
      } else {
        render.hitMessages.playerBoard.emptySquare();
      }
    },
  };

  const addListeners = {
    enemyBoard: (enemyBoard, enemyPlayer, humanPlayer, humanBoard) => {
      const squares = enemyBoard.querySelectorAll("button");

      squares.forEach((square) => {
        square.addEventListener("click", () => {
          gamePlay.hitSquare(
            enemyPlayer,
            enemyBoard,
            Number(square.dataset.x),
            Number(square.dataset.y)
          );
          setTimeout(() => {
            gamePlay.botHitSquare(enemyPlayer, humanPlayer, humanBoard);
            render.boardEnabled(enemyBoard);
          }, 1000);
        });
      });
    },
  };

  const init = {
    newGame: (player, enemy) => {
      render.newEmptyGame();
      render.allShipsOnBoard(document.querySelector("#player-board"), player);
      addListeners.enemyBoard(
        document.querySelector("#enemy-board"),
        enemy,
        player,
        document.querySelector("#player-board")
      );
    },
  };

  return { init };
})();

const testPlayer = new Player();
const computerPlayer = new PlayerBot();
testPlayer.gameboard.placeShipsRandomly();
computerPlayer.gameboard.placeShipsRandomly();

ui.init.newGame(testPlayer, computerPlayer);

export default ui;
