// pieces.js
const pieces = {
  white: {
    pawn: '♙', rook: '♖', knight: '♘', bishop: '♗', queen: '♕', king: '♔'
  },
  black: {
    pawn: '♟', rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚'
  }
};

const initialPositions = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

function placePieces() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = initialPositions[row][col];
      if (piece) {
        const square = document.getElementById(`square-${row}-${col}`);
        square.textContent = piece;
        square.classList.add("piece");
      }
    }
  }
}

// Updated movePiece function in gameLogic.js
function movePiece(fromSquare, toSquare) {
    toSquare.textContent = fromSquare.textContent;
    toSquare.classList.add("piece"); // Apply piece class to new square
    fromSquare.textContent = "";
    fromSquare.classList.remove("piece"); // Remove piece class from original square
  }
  