import Player from "./player.js";

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
  };

  return { render };
})();

export default ui;
