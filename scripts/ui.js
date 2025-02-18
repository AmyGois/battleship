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

    endGameCard: () => {
      const main = document.querySelector("main");
      const template = document.querySelector("#endgame");
      const endGameUI = template.content.cloneNode(true);

      main.appendChild(endGameUI);
    },

    endGameMessages: {
      win: () => {
        const endMsg = document.querySelector("#endgame-msg");
        const winMsg = document.querySelector("#endgame-win-lose");

        endMsg.textContent = "Congratulations! You sank all the enemy's ships!";
        winMsg.textContent = "You win";
      },
      lose: () => {
        const endMsg = document.querySelector("#endgame-msg");
        const loseMsg = document.querySelector("#endgame-win-lose");

        endMsg.textContent = "Alas! The enemy sank all your ships!";
        loseMsg.textContent = "You lose";
      },
    },

    newEmptySetUp: () => {
      const main = document.querySelector("main");
      const template = document.querySelector("#setup");
      const setUpUi = template.content.cloneNode(true);

      main.innerHTML = "";
      main.appendChild(setUpUi);
      render.emptyBoard();
    },

    setUpBoard: (shipLength, shipDirection, ship) => {
      const board = document.querySelector(".board");
      const squares = board.querySelectorAll("button");

      squares.forEach((square) => {
        const xCoordinate = Number(square.dataset.x);
        const yCoordinate = Number(square.dataset.y);

        square.dataset.valid = true;
        square.dataset.shiplength = shipLength;
        square.dataset.direction = shipDirection;
        square.dataset.ship = ship;

        if (shipDirection === "horizontal") {
          for (let i = xCoordinate; i < xCoordinate + shipLength; i++) {
            const nextSquare = board.querySelector(
              `[data-x="${i}"][data-y="${yCoordinate}"]`
            );

            if (i >= 10 || nextSquare.classList.contains("has-ship") === true) {
              square.dataset.valid = false;
            }
          }
        } else if (shipDirection === "vertical") {
          for (let i = yCoordinate; i < yCoordinate + shipLength; i++) {
            const nextSquare = board.querySelector(
              `[data-y="${i}"][data-x="${xCoordinate}"]`
            );

            if (i >= 10 || nextSquare.classList.contains("has-ship") === true) {
              square.dataset.valid = false;
            }
          }
        }
      });
    },

    shipDragOver: (e, board, square, xCoordinate, yCoordinate) => {
      const shipLength = Number(square.dataset.shiplength);

      if (square.dataset.valid === "true") {
        e.preventDefault();
        if (square.dataset.direction === "horizontal") {
          for (let i = xCoordinate; i < xCoordinate + shipLength; i++) {
            const nextSquare = board.querySelector(
              `[data-x="${i}"][data-y="${yCoordinate}"]`
            );
            nextSquare.classList.add("hover");
          }
        } else if (square.dataset.direction === "vertical") {
          for (let i = yCoordinate; i < yCoordinate + shipLength; i++) {
            const nextSquare = board.querySelector(
              `[data-y="${i}"][data-x="${xCoordinate}"]`
            );
            nextSquare.classList.add("hover");
          }
        }
      }
    },

    shipDragLeave: (e, board, square, xCoordinate, yCoordinate) => {
      const shipLength = Number(square.dataset.shiplength);

      if (square.dataset.valid === "true") {
        e.preventDefault();
        if (square.dataset.direction === "horizontal") {
          for (let i = xCoordinate; i < xCoordinate + shipLength; i++) {
            const nextSquare = board.querySelector(
              `[data-x="${i}"][data-y="${yCoordinate}"]`
            );
            nextSquare.classList.remove("hover");
          }
        } else if (square.dataset.direction === "vertical") {
          for (let i = yCoordinate; i < yCoordinate + shipLength; i++) {
            const nextSquare = board.querySelector(
              `[data-y="${i}"][data-x="${xCoordinate}"]`
            );
            nextSquare.classList.remove("hover");
          }
        }
      }
    },

    shipDrop: (board, square, xCoordinate, yCoordinate, shipLength) => {
      if (square.dataset.direction === "horizontal") {
        for (let i = xCoordinate; i < xCoordinate + shipLength; i++) {
          const nextSquare = board.querySelector(
            `[data-x="${i}"][data-y="${yCoordinate}"]`
          );
          nextSquare.classList.remove("hover");
          nextSquare.classList.add("has-ship");
        }
      } else if (square.dataset.direction === "vertical") {
        for (let i = yCoordinate; i < yCoordinate + shipLength; i++) {
          const nextSquare = board.querySelector(
            `[data-y="${i}"][data-x="${xCoordinate}"]`
          );
          nextSquare.classList.remove("hover");
          nextSquare.classList.add("has-ship");
        }
      }
    },

    carousel: () => {
      const carousel = document.querySelector(".carousel");
      const slider = carousel.querySelector(".carousel-slides");
      const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
      const radioBtnsDiv = carousel.querySelector(".carousel-radioBtns");
      const previousBtn = carousel.querySelector(".carousel-previousBtn");
      const nextBtn = carousel.querySelector(".carousel-nextBtn");
      let radioBtns = [];
      let currentSlideIndex = 0;

      const moveSlider = () => {
        const slideWidth = carousel.offsetWidth;
        const widthToMove = slideWidth * -currentSlideIndex;
        slider.style.transform = `translateX(${widthToMove}px)`;
        radioBtns[currentSlideIndex].checked = true;
      };

      const moveToPreviousSlide = () => {
        if (currentSlideIndex === 0) {
          currentSlideIndex = slides.length - 1;
        } else {
          currentSlideIndex--;
        }
        moveSlider();
      };
      previousBtn.addEventListener("click", moveToPreviousSlide);

      const moveToNextSlide = () => {
        if (currentSlideIndex === slides.length - 1) {
          currentSlideIndex = 0;
        } else {
          currentSlideIndex++;
        }
        moveSlider();
      };
      nextBtn.addEventListener("click", () => {
        moveToNextSlide();
      });

      const radioMoveSlider = (radioValue) => {
        currentSlideIndex = Number(radioValue);
        moveSlider();
      };

      /* Make radio buttons */
      slides.forEach((slide) => {
        const slideIndex = slides.indexOf(slide);
        const radioBtn = document.createElement("input");

        slide.dataset.slideIndex = slideIndex;
        radioBtn.type = "radio";
        radioBtn.name = "carousel-slide";
        radioBtn.value = slideIndex;
        radioBtn.addEventListener("click", () =>
          radioMoveSlider(radioBtn.value)
        );
        radioBtnsDiv.appendChild(radioBtn);
        radioBtns.push(radioBtn);
      });
    },

    placedShipCard: (ship) => {
      const placedShip = document.getElementById(ship);

      placedShip.classList.add("placed");
      placedShip.draggable = false;
    },

    startGameBtn: () => {
      const startBtn = document.querySelector("#start-game-btn");

      startBtn.classList.remove("hidden");
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

    endGame: (playerWins) => {
      render.endGameCard();

      if (playerWins === true) {
        render.endGameMessages.win();
      } else if (playerWins === false) {
        render.endGameMessages.lose();
      }

      addListeners.newGameBtn();
    },

    placeShip: (ship, direction, x, y, player) => {
      switch (ship) {
        case "carrier":
          player.gameboard.placeCarrier(direction, x, y);
          break;
        case "battleship":
          player.gameboard.placeBattleship(direction, x, y);
          break;
        case "destroyer":
          player.gameboard.placeDestroyer(direction, x, y);
          break;
        case "submarine":
          player.gameboard.placeSubmarine(direction, x, y);
          break;
        case "patrolboat":
          player.gameboard.placePatrolBoat(direction, x, y);
          break;
        default:
          console.log("Something went wrong placing the ship!");
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

          if (enemyPlayer.gameboard.allShipsSunk() === true) {
            setTimeout(() => {
              gamePlay.endGame(true);
            }, 1000);
          } else {
            setTimeout(() => {
              gamePlay.botHitSquare(enemyPlayer, humanPlayer, humanBoard);

              if (humanPlayer.gameboard.allShipsSunk() === true) {
                setTimeout(() => {
                  gamePlay.endGame(false);
                }, 1000);
              } else {
                render.boardEnabled(enemyBoard);
              }
            }, 1000);
          }
        });
      });
    },

    newGameBtn: () => {
      const playAgainBtn = document.querySelector("#play-again-btn");

      playAgainBtn.addEventListener("click", () => {
        init.newSetUp();
      });
    },

    setUpBoard: (newPlayer, counter) => {
      const board = document.querySelector(".board");
      const squares = board.querySelectorAll("button");

      squares.forEach((square) => {
        const xCoordinate = Number(square.dataset.x);
        const yCoordinate = Number(square.dataset.y);

        square.addEventListener("dragover", (e) => {
          render.shipDragOver(e, board, square, xCoordinate, yCoordinate);
        });

        square.addEventListener("dragleave", (e) => {
          render.shipDragLeave(e, board, square, xCoordinate, yCoordinate);
        });

        square.addEventListener("drop", (e) => {
          const shipLength = Number(square.dataset.shiplength);

          e.preventDefault();
          if (square.dataset.valid === "true") {
            render.shipDrop(
              board,
              square,
              xCoordinate,
              yCoordinate,
              shipLength
            );

            render.placedShipCard(square.dataset.ship);
            gamePlay.placeShip(
              square.dataset.ship,
              square.dataset.direction,
              xCoordinate,
              yCoordinate,
              newPlayer
            );

            counter++;
            if (counter === 5) {
              render.startGameBtn();
            }
          }
        });
      });
    },

    toggleSwitch: () => {
      const toggle = document.querySelector("#ship-direction");
      const ships = document.querySelectorAll(".ship");

      toggle.addEventListener("click", () => {
        if (toggle.checked === true) {
          ships.forEach((ship) => {
            ship.classList.add("vertical");
            ship.dataset.direction = "vertical";
          });
        } else {
          ships.forEach((ship) => {
            ship.classList.remove("vertical");
            ship.dataset.direction = "horizontal";
          });
        }
      });
    },

    ships: () => {
      const carrier = document.querySelector("#carrier");
      const battleship = document.querySelector("#battleship");
      const destroyer = document.querySelector("#destroyer");
      const submarine = document.querySelector("#submarine");
      const patrolBoat = document.querySelector("#patrolboat");

      carrier.addEventListener("dragstart", () => {
        render.setUpBoard(5, carrier.dataset.direction, carrier.id);
      });
      battleship.addEventListener("dragstart", () => {
        render.setUpBoard(4, battleship.dataset.direction, battleship.id);
      });
      destroyer.addEventListener("dragstart", () => {
        render.setUpBoard(3, destroyer.dataset.direction, destroyer.id);
      });
      submarine.addEventListener("dragstart", () => {
        render.setUpBoard(3, submarine.dataset.direction, submarine.id);
      });
      patrolBoat.addEventListener("dragstart", () => {
        render.setUpBoard(2, patrolBoat.dataset.direction, patrolBoat.id);
      });
    },

    startGameBtn: (player, enemy) => {
      const startBtn = document.querySelector("#start-game-btn");

      startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        init.newGame(player, enemy);
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

    newSetUp: () => {
      const player = new Player();
      const computerPlayer = new PlayerBot();
      let counter = 0;

      computerPlayer.gameboard.placeShipsRandomly();

      render.newEmptySetUp();
      addListeners.setUpBoard(player, counter);

      render.carousel();
      addListeners.toggleSwitch();
      addListeners.ships();
      addListeners.startGameBtn(player, computerPlayer);
    },
  };

  return { init };
})();

ui.init.newSetUp();
