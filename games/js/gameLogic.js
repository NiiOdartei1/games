let selectedSquare = null;
let currentTurn = "white";
let whiteKingCaptured = false;
let blackKingCaptured = false;

document.querySelectorAll(".square").forEach(square => {
  square.addEventListener("click", () => {
    if (selectedSquare) {
      if (isValidMove(selectedSquare, square)) {
        const capturedPiece = square.textContent; 
        
        movePiece(selectedSquare, square);
        
        // Check if any king was captured after moving the piece
        if (capturedPiece === '♔') { // Check if the white king is captured
          whiteKingCaptured = true;
          alert("Black wins! White's king has been captured.");
          resetGame();
          return; // Ensure no further checks occur
        } else if (capturedPiece === '♚') { // Check if the black king is captured
          blackKingCaptured = true;
          alert("White wins! Black's king has been captured.");
          resetGame();
          return; // Ensure no further checks occur
        }
        
        // Check for checkmate only if no king was captured
        checkForCheckmate();

        // Toggle the turn
        currentTurn = currentTurn === "white" ? "black" : "white"; 
        updateTurnIndicator(); 
      }
      selectedSquare.classList.remove("selected");
      clearHighlights(); 
      selectedSquare = null;
    } else if (square.textContent && isPieceOfCurrentTurn(square)) {
      selectedSquare = square;
      square.classList.add("selected");
      highlightPossibleMoves(selectedSquare); 
    }
  });
});

// Highlight possible moves for the selected piece
function highlightPossibleMoves(selectedSquare) {
  const piece = selectedSquare.textContent;
  const fromRow = parseInt(selectedSquare.id.split('-')[1]);
  const fromCol = parseInt(selectedSquare.id.split('-')[2]);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const toSquare = document.getElementById(`square-${row}-${col}`);
      if (isValidMove(selectedSquare, toSquare)) {
        toSquare.classList.add("highlight");
      }
    }
  }
}

// Clear highlighted squares
function clearHighlights() {
  document.querySelectorAll(".square").forEach(square => {
    square.classList.remove("highlight");
  });
}

// Update the turn indicator
function updateTurnIndicator() {
  const turnIndicator = document.getElementById("turn-indicator");
  turnIndicator.textContent = `Current Turn: ${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}`;
}

// Check if a piece is of the current turn
function isPieceOfCurrentTurn(square) {
  const piece = square.textContent;
  return (currentTurn === "white" && "♙♖♘♗♕♔".includes(piece)) ||
         (currentTurn === "black" && "♟♜♞♝♛♚".includes(piece));
}

// Define valid movements for each piece type
function isValidMove(fromSquare, toSquare) {
  const piece = fromSquare.textContent;
  const fromRow = parseInt(fromSquare.id.split('-')[1]);
  const fromCol = parseInt(fromSquare.id.split('-')[2]);
  const toRow = parseInt(toSquare.id.split('-')[1]);
  const toCol = parseInt(toSquare.id.split('-')[2]);

  const isCapturing = toSquare.textContent && isOpponentPiece(toSquare);

  switch (piece) {
    case '♙': // White pawn
      return (!isCapturing && toCol === fromCol && (toRow === fromRow - 1 || (fromRow === 6 && toRow === fromRow - 2)) && !toSquare.textContent) ||
             (isCapturing && Math.abs(toCol - fromCol) === 1 && toRow === fromRow - 1);

    case '♟': // Black pawn
      return (!isCapturing && toCol === fromCol && (toRow === fromRow + 1 || (fromRow === 1 && toRow === fromRow + 2)) && !toSquare.textContent) ||
             (isCapturing && Math.abs(toCol - fromCol) === 1 && toRow === fromRow + 1);

    case '♖': // Rook
    case '♜':
      return (fromRow === toRow || fromCol === toCol) && !hasObstruction(fromRow, fromCol, toRow, toCol) &&
             (!toSquare.textContent || isCapturing);

    case '♘': // Knight
    case '♞':
      return ((Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) || 
              (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2)) && 
             (!toSquare.textContent || isCapturing);

    case '♗': // Bishop
    case '♝':
      return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol) && !hasObstruction(fromRow, fromCol, toRow, toCol) &&
             (!toSquare.textContent || isCapturing);

    case '♕': // Queen
    case '♛':
      return (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) &&
             !hasObstruction(fromRow, fromCol, toRow, toCol) && 
             (!toSquare.textContent || isCapturing);

    case '♔': // King
    case '♚':
      return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1 &&
             (!toSquare.textContent || isCapturing);

    default:
      return false;
  }
}

// Move the piece from one square to another
function movePiece(fromSquare, toSquare) {
  toSquare.textContent = fromSquare.textContent;
  toSquare.classList.add("piece");
  fromSquare.textContent = "";
  fromSquare.classList.remove("piece");
}

// Check for obstructions
function hasObstruction(fromRow, fromCol, toRow, toCol) {
  const rowIncrement = (toRow - fromRow) === 0 ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
  const colIncrement = (toCol - fromCol) === 0 ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);

  let currentRow = fromRow + rowIncrement;
  let currentCol = fromCol + colIncrement;

  while (currentRow !== toRow || currentCol !== toCol) {
    if (document.getElementById(`square-${currentRow}-${currentCol}`).textContent) {
      return true; 
    }
    currentRow += rowIncrement;
    currentCol += colIncrement;
  }
  return false; 
}

// Check if the destination square contains an opponent’s piece
function isOpponentPiece(square) {
  const piece = square.textContent;
  return (currentTurn === "white" && "♟♜♞♝♛♚".includes(piece)) ||
         (currentTurn === "black" && "♙♖♘♗♕♔".includes(piece));
}

// Reset the game
function resetGame() {
  document.querySelectorAll(".square").forEach(square => {
    square.textContent = "";
    square.classList.remove("piece");
  });

  initializeBoard();

  selectedSquare = null;
  currentTurn = "white";
  whiteKingCaptured = false;
  blackKingCaptured = false;

  updateTurnIndicator();
}

// Initialize the chessboard
function initializeBoard() {
  const pieces = {
    white: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
    black: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜']
  };

  document.querySelectorAll(".square").forEach(square => {
    square.textContent = ""; 
    square.classList.remove("piece"); 
  });

  for (let col = 0; col < 8; col++) {
    document.getElementById(`square-0-${col}`).textContent = pieces.black[col];
    document.getElementById(`square-1-${col}`).textContent = '♟';
  }

  for (let col = 0; col < 8; col++) {
    document.getElementById(`square-7-${col}`).textContent = pieces.white[col];
    document.getElementById(`square-6-${col}`).textContent = '♙';
  }

  updateTurnIndicator();
}

// Check for checkmate
function checkForCheckmate() {
  const kingSquare = findKingSquare(currentTurn);
  
  if (isInCheck(kingSquare, currentTurn)) {
    // If in check, see if there are any valid moves to escape
    if (!hasValidMoves()) {
      alert(`${currentTurn === "white" ? "Black" : "White"} wins! ${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)} is in checkmate.`);
      resetGame();
    }
  }
}

// Check if moving a piece would leave the king in check
function isInCheck(kingSquare, turn) {
  const opponentTurn = turn === "white" ? "black" : "white";
  return Array.from(document.querySelectorAll(".square")).some(square => {
    return isPieceOfCurrentTurn(square) && isValidMove(square, kingSquare);
  });
}

// Ensure no valid moves remain
function hasValidMoves() {
  return Array.from(document.querySelectorAll(".square")).some(square => {
    if (isPieceOfCurrentTurn(square)) {
      return Array.from(document.querySelectorAll(".square")).some(targetSquare => {
        if (isValidMove(square, targetSquare)) {
          const kingSquare = findKingSquare(currentTurn);
          movePiece(square, targetSquare);
          const isKingSafe = !isInCheck(kingSquare, currentTurn);
          undoMove(square, targetSquare); // Rollback the move
          return isKingSafe;
        }
      });
    }
  });
}

// Simulate moves and check for check condition
function simulateMoveAndCheck(fromSquare, toSquare) {
  const originalPiece = toSquare.textContent;
  movePiece(fromSquare, toSquare);

  const kingSquare = findKingSquare(currentTurn);
  const isKingSafe = !isInCheck(kingSquare, currentTurn);

  fromSquare.textContent = fromSquare.textContent;  // Revert the move
  toSquare.textContent = originalPiece;
  return isKingSafe;
}

// Find the king's square
function findKingSquare(turn) {
  const kingSymbol = turn === "white" ? '♔' : '♚';
  return Array.from(document.querySelectorAll(".square")).find(square => square.textContent === kingSymbol);
}

// Check if the king is in check
function isInCheck(kingSquare, turn) {
  const opponentTurn = turn === "white" ? "black" : "white";
  return Array.from(document.querySelectorAll(".square")).some(square => {
    const piece = square.textContent;
    return isOpponentPiece(square) && isValidMove(square, kingSquare);
  });
}

// Check if there are any valid moves remaining
function hasValidMoves() {
  return Array.from(document.querySelectorAll(".square")).some(square => {
    return isPieceOfCurrentTurn(square) && Array.from(document.querySelectorAll(".square")).some(targetSquare => {
      return isValidMove(square, targetSquare);
    });
  });
}

let whiteCapturedCount = 0;
let blackCapturedCount = 0;

// Function to capture a piece
function capturePiece(color) {
    if (color === 'white') {
        whiteCapturedCount++;
    } else if (color === 'black') {
        blackCapturedCount++;
    }

    // Update the displayed counts
    updateCapturedPieces(whiteCapturedCount, blackCapturedCount);
}

// Example: Capture a piece (to be called within your game logic)
capturePiece('white'); // Call this function when a white piece is captured

