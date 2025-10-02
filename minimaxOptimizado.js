const express = require('express');
const app = express();
const PORT = 3010;

// Constantes para identificar jugadores
const BOT = 1;
const OPPONENT = 2;

// Tabla de transposición para memorizar estados ya calculados
const transpositionTable = new Map();

// Patrones de apertura óptimos
const OPENING_BOOK = {
  // Tablero vacío: siempre centro o esquina
  '000000000': [4, 0, 2, 6, 8],
  // Si oponente toma centro, tomar esquina
  '000020000': [0, 2, 6, 8],
  // Si oponente toma esquina, tomar centro
  '200000000': [4],
  '020000000': [4],
  '000000002': [4],
  '000000020': [4]
};

/**
 * Genera una clave única para el estado del tablero incluyendo el turno
 */
function getBoardKey(board, isMax) {
  return board.join('') + (isMax ? 'M' : 'm');
}

/**
 * Comprueba si quedan casillas vacías
 */
function isMovesLeft(board) {
  return board.includes(0);
}

/**
 * Evalúa el tablero - SOLO para estados terminales
 */
function evaluate(board, depth) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],  // filas
    [0,3,6], [1,4,7], [2,5,8],  // columnas
    [0,4,8], [2,4,6]            // diagonales
  ];

  // Verificar victoria/derrota
  for (let [a, b, c] of lines) {
    if (board[a] !== 0 && board[a] === board[b] && board[b] === board[c]) {
      if (board[a] === BOT) {
        return 100 - depth;  // Victoria (prefiere rápida)
      } else {
        return depth - 100;  // Derrota (prefiere lenta)
      }
    }
  }

  return 0;  // No terminal o empate
}

/**
 * Ordena movimientos: centro > esquinas > bordes
 */
function orderMoves(board) {
  const moves = [];
  // Prioridades: centro > esquinas > bordes
  const priorities = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  
  for (let i of priorities) {
    if (board[i] === 0) {
      moves.push(i);
    }
  }
  
  return moves;
}

/**
 * Minimax con poda alpha-beta y transposición
 */
function minimax(board, depth, isMax, alpha, beta) {
  // Verificar tabla de transposición (con turno incluido)
  const boardKey = getBoardKey(board, isMax);
  if (transpositionTable.has(boardKey)) {
    return transpositionTable.get(boardKey);
  }

  const score = evaluate(board, depth);
  
  // Condiciones de parada: victoria/derrota o sin movimientos
  if (score !== 0 || !isMovesLeft(board)) {
    transpositionTable.set(boardKey, score);
    return score;
  }

  // Obtener movimientos ordenados
  const orderedMoves = orderMoves(board);
  
  if (isMax) {
    let maxEval = -Infinity;
    
    for (let i of orderedMoves) {
      board[i] = BOT;
      const evalScore = minimax(board, depth + 1, false, alpha, beta);
      board[i] = 0;
      
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      
      // Poda beta
      if (beta <= alpha) {
        break;
      }
    }
    
    transpositionTable.set(boardKey, maxEval);
    return maxEval;
    
  } else {
    let minEval = Infinity;
    
    for (let i of orderedMoves) {
      board[i] = OPPONENT;
      const evalScore = minimax(board, depth + 1, true, alpha, beta);
      board[i] = 0;
      
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      
      // Poda alfa
      if (beta <= alpha) {
        break;
      }
    }
    
    transpositionTable.set(boardKey, minEval);
    return minEval;
  }
}

/**
 * Busca en el libro de aperturas
 */
function getOpeningMove(board) {
  const boardKey = board.join('');
  
  if (OPENING_BOOK[boardKey]) {
    // Retorna el primer movimiento válido del libro
    for (let move of OPENING_BOOK[boardKey]) {
      if (board[move] === 0) {
        return move;
      }
    }
  }
  
  return null;
}

/**
 * Encuentra el mejor movimiento
 */
function findBestMove(board) {
  // Limpiar tabla de transposición periódicamente
  if (transpositionTable.size > 10000) {
    transpositionTable.clear();
  }

  // Verificar libro de aperturas primero
  const openingMove = getOpeningMove(board);
  if (openingMove !== null) {
    return openingMove;
  }

  let bestVal = -Infinity;
  let bestMove = -1;

  // Buscar movimientos ganadores inmediatos
  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      board[i] = BOT;
      const score = evaluate(board, 0);
      board[i] = 0;
      
      if (score > 0) {
        return i; // Movimiento ganador encontrado
      }
    }
  }

  // Buscar movimientos defensivos (bloquear victoria del oponente)
  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      board[i] = OPPONENT;
      const score = evaluate(board, 0);
      board[i] = 0;
      
      if (score < 0) {
        return i; // Bloquear victoria del oponente
      }
    }
  }

  // Búsqueda minimax completa con movimientos ordenados
  const orderedMoves = orderMoves(board);
  
  for (let i of orderedMoves) {
    board[i] = BOT;
    const moveVal = minimax(board, 0, false, -Infinity, Infinity);
    board[i] = 0;

    if (moveVal > bestVal) {
      bestVal = moveVal;
      bestMove = i;
    }
    
    // Early exit si encontramos victoria garantizada
    if (moveVal >= 90) {
      break;
    }
  }

  return bestMove;
}

// Middleware para parsing JSON
app.use(express.json());

// Endpoint GET /move?board=[0,1,0,2,0,0,0,0,0]
app.get('/move', (req, res) => {
  let board;
  try {
    board = JSON.parse(req.query.board);
  } catch (e) {
    return res.status(400).json({ error: 'Parámetro board inválido. Debe ser un array JSON.' });
  }

  // Validaciones
  if (!Array.isArray(board) || board.length !== 9) {
    return res.status(400).json({ error: 'El tablero debe ser un array de 9 posiciones.' });
  }

  if (!board.every(cell => [0, 1, 2].includes(cell))) {
    return res.status(400).json({ error: 'El tablero debe contener solo valores 0, 1, o 2.' });
  }

  if (!isMovesLeft(board)) {
    return res.status(400).json({ error: 'No hay movimientos disponibles.' });
  }

  const startTime = Date.now();
  const movimiento = findBestMove(board);
  const endTime = Date.now();

  res.json({ 
    movimiento,
    tiempo_ms: endTime - startTime,
    cache_size: transpositionTable.size
  });
});

// Endpoint para limpiar caché
app.post('/clear-cache', (req, res) => {
  transpositionTable.clear();
  res.json({ message: 'Caché limpiado' });
});

// Endpoint para estadísticas
app.get('/stats', (req, res) => {
  res.json({
    cache_size: transpositionTable.size,
    opening_positions: Object.keys(OPENING_BOOK).length
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de tatetí optimizado escuchando en el puerto ${PORT}`);
});