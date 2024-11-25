class Ship {
  #hits;
  #shipLength;

  constructor(length) {
    if (length === undefined || typeof length !== "number") {
      throw new Error("Ship length must be a number!");
    } else {
      this.#shipLength = length;
    }
    this.#hits = 0;
  }

  get shipLength() {
    return this.#shipLength;
  }

  hit() {
    this.#hits += 1;
  }

  isSunk() {
    if (this.#shipLength > this.#hits) {
      return false;
    }
    return true;
  }
}

export default Ship;
