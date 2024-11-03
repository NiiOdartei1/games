// chessboard.js
const chessboard = document.getElementById("chessboard");

function renderBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((row + col) % 2 === 0 ? "light" : "dark");
      square.id = `square-${row}-${col}`;
      chessboard.appendChild(square);
    }
  }
  placePieces(); // Call placePieces only after the board is rendered
}

renderBoard();
