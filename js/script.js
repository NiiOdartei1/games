// gameLogic.js

// Track the current state
let selectedSquare = null;
let currentTurn = 'white';

// Handle square click events
function handleSquareClick(square) {
    if (selectedSquare) {
        if (selectedSquare !== square && isValidMove(selectedSquare, square)) {
            square.textContent = selectedSquare.textContent; // Move piece
            selectedSquare.textContent = ''; // Clear original square
            switchTurn();
        }
        deselectSquare();
    } else if (square.textContent && isCorrectTurn(square.textContent)) {
        selectSquare(square);
    }
}

// Highlight selected square
function selectSquare(square) {
    selectedSquare = square;
    square.classList.add('selected');
}

// Remove highlight from selected square
function deselectSquare() {
    if (selectedSquare) selectedSquare.classList.remove('selected');
    selectedSquare = null;
}

// Switch turn after a valid move
function switchTurn() {
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
}

// Check if it's the correct player's turn
function isCorrectTurn(piece) {
    return (currentTurn === 'white' && piece >= '♙' && piece <= '♔') ||
           (currentTurn === 'black' && piece >= '♟' && piece <= '♚');
}

// Validate moves based on piece type and positions
function isValidMove(fromSquare, toSquare) {
    const piece = fromSquare.textContent;
    const fromIndex = squares.indexOf(fromSquare);
    const toIndex = squares.indexOf(toSquare);
    const rowDiff = Math.abs(Math.floor(fromIndex / 8) - Math.floor(toIndex / 8));
    const colDiff = Math.abs((fromIndex % 8) - (toIndex % 8));

    switch (piece) {
        case '♙': return validatePawnMove(rowDiff, colDiff, fromIndex, toIndex, 'white', toSquare);
        case '♟': return validatePawnMove(rowDiff, colDiff, fromIndex, toIndex, 'black', toSquare);
        case '♖': case '♜': return validateRookMove(fromIndex, toIndex);
        case '♘': case '♞': return rowDiff * colDiff === 2; // Knight "L" move
        case '♗': case '♝': return validateBishopMove(fromIndex, toIndex);
        case '♕': case '♛': return validateRookMove(fromIndex, toIndex) || validateBishopMove(fromIndex, toIndex); // Queen
        case '♔': case '♚': return rowDiff <= 1 && colDiff <= 1; // King
        default: return false;
    }
}

// Validate pawn moves, including double-move and captures
function validatePawnMove(rowDiff, colDiff, fromIndex, toIndex, color, toSquare) {
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    const targetRow = Math.floor(fromIndex / 8);

    return (colDiff === 0 && rowDiff === 1 && !toSquare.textContent && direction === rowDiff) ||
           (colDiff === 0 && rowDiff === 2 && targetRow === startRow && !squares[(fromIndex + toIndex) / 2].textContent) ||
           (colDiff === 1 && rowDiff === 1 && toSquare.textContent && isOpponentPiece(color, toSquare.textContent));
}

// Validate rook moves by checking path clearance
function validateRookMove(fromIndex, toIndex) {
    const rowDiff = Math.floor(fromIndex / 8) - Math.floor(toIndex / 8);
    const colDiff = (fromIndex % 8) - (toIndex % 8);

    if (rowDiff !== 0 && colDiff !== 0) return false;

    const step = rowDiff === 0 ? (colDiff < 0 ? 1 : -1) : (rowDiff < 0 ? 8 : -8);
    for (let i = fromIndex + step; i !== toIndex; i += step) {
        if (squares[i].textContent) return false;
    }
    return true;
}

// Validate bishop moves by checking diagonal path clearance
function validateBishopMove(fromIndex, toIndex) {
    const rowDiff = Math.abs(Math.floor(fromIndex / 8) - Math.floor(toIndex / 8));
    const colDiff = Math.abs((fromIndex % 8) - (toIndex % 8));

    if (rowDiff !== colDiff) return false;

    const step = (toIndex > fromIndex ? 9 : -9) * (colDiff < 0 ? -1 : 1);
    for (let i = fromIndex + step; i !== toIndex; i += step) {
        if (squares[i].textContent) return false;
    }
    return true;
}

// Helper to check if target piece belongs to the opponent
function isOpponentPiece(color, targetPiece) {
    return (color === 'white' && targetPiece >= '♟' && targetPiece <= '♚') ||
           (color === 'black' && targetPiece >= '♙' && targetPiece <= '♔');
}
