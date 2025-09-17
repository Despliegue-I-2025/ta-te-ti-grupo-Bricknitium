const express = require('express');
const app = express();
const PORT = 3010;

// Constantes para identificar jugadores
const BOT = 1;        // Nuestro bot (maximizador)
const OPPONENT = 2;   // Oponente (minimizador)

/**
 * Comprueba si quedan casillas vacías (valor 0).
 */
function isMovesLeft(board) {
  return board.includes(0);
}

/**
 * Evalúa el tablero:
 *   +10 si gana BOT,
 *   -10 si gana OPPONENT,
 *    0 en empate o sin ganador aún.
 */
function evaluate(board) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],  // filas
    [0,3,6], [1,4,7], [2,5,8],  // columnas
    [0,4,8], [2,4,6]            // diagonales
  ];

  for (let [a, b, c] of lines) {
    if (board[a] !== 0 && board[a] === board[b] && board[b] === board[c]) {
      return board[a] === BOT ? 10 : -10;
    }
  }
  return 0;
}

/**
 * Minimax con poda Alpha-Beta.
 * @param {number[]} board Estado actual del tablero.
 * @param {number} depth Profundidad de búsqueda.
 * @param {boolean} isMax True si es turno del maximizador.
 * @param {number} alpha Valor alfa.
 * @param {number} beta Valor beta.
 * @returns {number} La mejor puntuación desde este nodo.
 */
function minimax(board, depth, isMax, alpha, beta) {
  const score = evaluate(board);
  if (score === 10 || score === -10) return score;
  if (!isMovesLeft(board)) return 0;  // empate

  if (isMax) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === 0) {
        board[i] = BOT;
        const evalScore = minimax(board, depth + 1, false, alpha, beta);
        board[i] = 0;
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;      // poda beta
      }
    }
    return maxEval;

  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === 0) {
        board[i] = OPPONENT;
        const evalScore = minimax(board, depth + 1, true, alpha, beta);
        board[i] = 0;
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;      // poda alfa
      }
    }
    return minEval;
  }
}

/**
 * Recorre todas las casillas vacías y elige
 * la que maximiza la puntuación para BOT.
 */
function findBestMove(board) {
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      board[i] = BOT;
      const moveVal = minimax(board, 0, false, -Infinity, Infinity);
      board[i] = 0;

      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

// Endpoint GET /move?board=[0,1,0,2,0,0,0,0,0]
app.get('/move', (req, res) => {
  let board;
  try {
    board = JSON.parse(req.query.board);
  } catch (e) {
    return res.status(400).json({ error: 'Parámetro board inválido. Debe ser un array JSON.' });
  }

  if (!Array.isArray(board) || board.length !== 9) {
    return res.status(400).json({ error: 'El tablero debe ser un array de 9 posiciones.' });
  }

  if (!isMovesLeft(board)) {
    return res.status(400).json({ error: 'No hay movimientos disponibles.' });
  }

  const movimiento = findBestMove(board);
  res.json({ movimiento });
});

app.listen(PORT, () => {
  console.log(`Servidor de tatetí escuchando en el puerto ${PORT}`);
});