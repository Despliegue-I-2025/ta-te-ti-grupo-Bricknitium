/**
 * Utilidades para facilitar las pruebas del algoritmo Minimax
 */

const { BOT, OPPONENT } = require('./MinimaxLogic');

/**
 * Convierte un tablero de notación visual a array
 * @param {string} boardString - Tablero en formato visual
 * @returns {number[]} Array de 9 elementos
 * 
 * @example
 * const board = boardFromString(`
 *   X | O | X
 *   ---------
 *   O | X | O
 *   ---------
 *   _ | _ | _
 * `);
 * // [1, 2, 1, 2, 1, 2, 0, 0, 0]
 */
function boardFromString(boardString) {
    return boardString
        .replace(/\s+/g, '')
        .replace(/[|\-]/g, '')
        .split('')
        .filter(char => ['X', 'O', '_'].includes(char))
        .map(char => {
            if (char === 'X') return BOT;
            if (char === 'O') return OPPONENT;
            return 0;
        });
}

/**
 * Convierte un array de tablero a notación visual
 * @param {number[]} board - Array de 9 elementos
 * @returns {string} Representación visual del tablero
 * 
 * @example
 * console.log(boardToString([1, 2, 1, 2, 1, 2, 0, 0, 0]));
 * // X | O | X
 * // ---------
 * // O | X | O
 * // ---------
 * // _ | _ | _
 */
function boardToString(board) {
    const symbols = board.map(cell => {
        if (cell === BOT) return 'X';
        if (cell === OPPONENT) return 'O';
        return '_';
    });
    
    return `
 ${symbols[0]} | ${symbols[1]} | ${symbols[2]}
-----------
 ${symbols[3]} | ${symbols[4]} | ${symbols[5]}
-----------
 ${symbols[6]} | ${symbols[7]} | ${symbols[8]}`;
}

/**
 * Crea un tablero con posiciones específicas ocupadas
 * @param {Object} positions - Objeto con índices y valores
 * @returns {number[]} Array de 9 elementos
 * 
 * @example
 * const board = createBoard({
 *   0: BOT,
 *   4: OPPONENT,
 *   8: BOT
 * });
 * // [1, 0, 0, 0, 2, 0, 0, 0, 1]
 */
function createBoard(positions = {}) {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    Object.entries(positions).forEach(([index, value]) => {
        board[parseInt(index)] = value;
    });
    return board;
}

/**
 * Genera todos los tableros posibles con un número específico de movimientos
 * Útil para pruebas exhaustivas
 * @param {number} moves - Número de movimientos realizados
 * @returns {number[][]} Array de tableros
 */
function generateBoardsWithMoves(moves) {
    // Implementación básica - puede optimizarse
    const boards = [];
    
    function generate(board, remainingMoves, turn) {
        if (remainingMoves === 0) {
            boards.push([...board]);
            return;
        }
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === 0) {
                board[i] = turn;
                generate(board, remainingMoves - 1, turn === BOT ? OPPONENT : BOT);
                board[i] = 0;
            }
        }
    }
    
    generate([0,0,0,0,0,0,0,0,0], moves, BOT);
    return boards;
}

/**
 * Simula una partida completa entre dos estrategias
 * @param {Function} botStrategy - Función que retorna el movimiento del BOT
 * @param {Function} opponentStrategy - Función que retorna el movimiento del OPPONENT
 * @returns {Object} Resultado de la partida
 * 
 * @example
 * const result = simulateGame(
 *   (board) => findBestMove(board),
 *   (board) => 0 // Oponente siempre juega primera casilla disponible
 * );
 * console.log(result);
 * // { winner: 'BOT', moves: 5, finalBoard: [...] }
 */
function simulateGame(botStrategy, opponentStrategy) {
    const { isMovesLeft, evaluate } = require('./MinimaxLogic');
    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let turn = BOT;
    let moves = 0;
    const history = [];
    
    while (isMovesLeft(board) && evaluate(board) === 0 && moves < 9) {
        let move;
        
        if (turn === BOT) {
            move = botStrategy([...board]);
        } else {
            move = opponentStrategy([...board]);
        }
        
        if (move < 0 || move > 8 || board[move] !== 0) {
            throw new Error(`Movimiento inválido: ${move} en turno ${moves + 1}`);
        }
        
        board[move] = turn;
        history.push({ move, turn, board: [...board] });
        turn = turn === BOT ? OPPONENT : BOT;
        moves++;
    }
    
    const score = evaluate(board);
    let winner = 'DRAW';
    if (score === 10) winner = 'BOT';
    if (score === -10) winner = 'OPPONENT';
    
    return {
        winner,
        moves,
        finalBoard: board,
        history,
        score
    };
}

/**
 * Estrategia aleatoria (para testing)
 * @param {number[]} board - Tablero actual
 * @returns {number} Índice del movimiento
 */
function randomStrategy(board) {
    const availableMoves = board
        .map((cell, index) => cell === 0 ? index : null)
        .filter(index => index !== null);
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

/**
 * Estrategia de primera casilla disponible (para testing)
 * @param {number[]} board - Tablero actual
 * @returns {number} Índice del movimiento
 */
function firstAvailableStrategy(board) {
    return board.findIndex(cell => cell === 0);
}

/**
 * Valida que un movimiento sea legal
 * @param {number[]} board - Tablero actual
 * @param {number} move - Índice del movimiento
 * @returns {boolean} True si el movimiento es válido
 */
function isValidMove(board, move) {
    return move >= 0 && move <= 8 && board[move] === 0;
}

/**
 * Obtiene todas las casillas vacías
 * @param {number[]} board - Tablero actual
 * @returns {number[]} Array de índices vacíos
 */
function getAvailableMoves(board) {
    return board
        .map((cell, index) => cell === 0 ? index : null)
        .filter(index => index !== null);
}

/**
 * Clona un tablero
 * @param {number[]} board - Tablero a clonar
 * @returns {number[]} Copia del tablero
 */
function cloneBoard(board) {
    return [...board];
}

/**
 * Verifica si dos tableros son iguales
 * @param {number[]} board1 - Primer tablero
 * @param {number[]} board2 - Segundo tablero
 * @returns {boolean} True si son iguales
 */
function boardsEqual(board1, board2) {
    return board1.every((cell, index) => cell === board2[index]);
}

/**
 * Cuenta cuántas casillas están ocupadas por cada jugador
 * @param {number[]} board - Tablero actual
 * @returns {Object} Conteo de piezas
 */
function countPieces(board) {
    return {
        bot: board.filter(cell => cell === BOT).length,
        opponent: board.filter(cell => cell === OPPONENT).length,
        empty: board.filter(cell => cell === 0).length
    };
}

/**
 * Genera tableros de prueba comunes
 * @returns {Object} Objeto con tableros predefinidos
 */
function getTestBoards() {
    return {
        empty: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        
        botWinRow: [BOT, BOT, BOT, OPPONENT, OPPONENT, 0, 0, 0, 0],
        botWinCol: [BOT, OPPONENT, 0, BOT, OPPONENT, 0, BOT, 0, 0],
        botWinDiag: [BOT, OPPONENT, 0, 0, BOT, 0, OPPONENT, 0, BOT],
        
        opponentWinRow: [OPPONENT, OPPONENT, OPPONENT, BOT, BOT, 0, 0, 0, 0],
        opponentWinCol: [OPPONENT, BOT, 0, OPPONENT, BOT, 0, OPPONENT, 0, 0],
        opponentWinDiag: [OPPONENT, BOT, 0, 0, OPPONENT, 0, BOT, 0, OPPONENT],
        
        draw: [BOT, OPPONENT, BOT, OPPONENT, BOT, BOT, OPPONENT, BOT, OPPONENT],
        
        almostWinBot: [BOT, BOT, 0, OPPONENT, OPPONENT, 0, 0, 0, 0],
        almostWinOpponent: [OPPONENT, OPPONENT, 0, BOT, BOT, 0, 0, 0, 0],
        
        fork: [BOT, 0, 0, 0, OPPONENT, 0, 0, 0, BOT],
        
        centerTaken: [0, 0, 0, 0, OPPONENT, 0, 0, 0, 0],
        cornerTaken: [OPPONENT, 0, 0, 0, 0, 0, 0, 0, 0],
        
        complex: [BOT, OPPONENT, BOT, BOT, OPPONENT, OPPONENT, 0, 0, 0]
    };
}

/**
 * Ejecuta una serie de movimientos en secuencia
 * @param {number[]} moves - Array de índices de movimientos
 * @param {number} startTurn - Jugador que inicia (BOT o OPPONENT)
 * @returns {number[]} Tablero resultante
 */
function playMoves(moves, startTurn = BOT) {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let turn = startTurn;
    
    moves.forEach(move => {
        if (board[move] !== 0) {
            throw new Error(`Casilla ${move} ya está ocupada`);
        }
        board[move] = turn;
        turn = turn === BOT ? OPPONENT : BOT;
    });
    
    return board;
}

// Exportar todas las utilidades
module.exports = {
    // Conversión y visualización
    boardFromString,
    boardToString,
    createBoard,
    
    // Generación y simulación
    generateBoardsWithMoves,
    simulateGame,
    
    // Estrategias de prueba
    randomStrategy,
    firstAvailableStrategy,
    
    // Validación y utilidades
    isValidMove,
    getAvailableMoves,
    cloneBoard,
    boardsEqual,
    countPieces,
    
    // Tableros predefinidos
    getTestBoards,
    playMoves,
    
    // Constantes reexportadas para conveniencia
    BOT,
    OPPONENT
};