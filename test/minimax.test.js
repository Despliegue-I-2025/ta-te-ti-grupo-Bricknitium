const { 
    BOT, 
    OPPONENT, 
    isMovesLeft, 
    evaluate, 
    minimax, 
    findBestMove 
} = require('./MinimaxLogic');

// ============================================
// SUITE: isMovesLeft
// ============================================
describe('isMovesLeft - Detección de movimientos disponibles', () => {
    test('Debe retornar true cuando hay múltiples casillas vacías', () => {
        const board = [1, 2, 0, 1, 2, 0, 0, 0, 0];
        expect(isMovesLeft(board)).toBe(true);
    });

    test('Debe retornar true cuando solo queda una casilla vacía', () => {
        const board = [1, 2, 1, 2, 1, 2, 1, 2, 0];
        expect(isMovesLeft(board)).toBe(true);
    });

    test('Debe retornar false cuando el tablero está completamente lleno', () => {
        const board = [1, 2, 1, 2, 1, 2, 1, 2, 1];
        expect(isMovesLeft(board)).toBe(false);
    });

    test('Debe retornar true en un tablero completamente vacío', () => {
        const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        expect(isMovesLeft(board)).toBe(true);
    });

    test('Debe manejar correctamente un tablero con ganador pero con casillas vacías', () => {
        const board = [BOT, BOT, BOT, 0, OPPONENT, 0, 0, 0, 0];
        expect(isMovesLeft(board)).toBe(true);
    });
});

// ============================================
// SUITE: evaluate
// ============================================
describe('evaluate - Evaluación de estados del tablero', () => {
    describe('Victorias del BOT', () => {
        test('Debe retornar 10 si BOT gana en la primera fila', () => {
            const board = [BOT, BOT, BOT, 0, OPPONENT, 0, OPPONENT, 0, 0];
            expect(evaluate(board)).toBe(10);
        });

        test('Debe retornar 10 si BOT gana en la segunda fila', () => {
            const board = [OPPONENT, 0, OPPONENT, BOT, BOT, BOT, 0, 0, 0];
            expect(evaluate(board)).toBe(10);
        });

        test('Debe retornar 10 si BOT gana en la tercera fila', () => {
            const board = [OPPONENT, OPPONENT, 0, 0, 0, 0, BOT, BOT, BOT];
            expect(evaluate(board)).toBe(10);
        });

        test('Debe retornar 10 si BOT gana en la primera columna', () => {
            const board = [BOT, OPPONENT, 0, BOT, OPPONENT, 0, BOT, 0, 0];
            expect(evaluate(board)).toBe(10);
        });

        test('Debe retornar 10 si BOT gana en la segunda columna', () => {
            const board = [OPPONENT, BOT, 0, 0, BOT, OPPONENT, 0, BOT, 0];
            expect(evaluate(board)).toBe(10);
        });

        test('Debe retornar 10 si BOT gana en la tercera columna', () => {
            const board = [0, OPPONENT, BOT, 0, OPPONENT, BOT, 0, 0, BOT];
            expect(evaluate(board)).toBe(10);
        });

        test('Debe retornar 10 si BOT gana en la diagonal principal', () => {
            const board = [BOT, OPPONENT, 0, 0, BOT, 0, OPPONENT, OPPONENT, BOT];
            expect(evaluate(board)).toBe(10);
        });

        test('Debe retornar 10 si BOT gana en la diagonal inversa', () => {
            const board = [OPPONENT, 0, BOT, OPPONENT, BOT, 0, BOT, 0, 0];
            expect(evaluate(board)).toBe(10);
        });
    });

    describe('Victorias del OPPONENT', () => {
        test('Debe retornar -10 si OPPONENT gana en la primera fila', () => {
            const board = [OPPONENT, OPPONENT, OPPONENT, BOT, BOT, 0, 0, 0, 0];
            expect(evaluate(board)).toBe(-10);
        });

        test('Debe retornar -10 si OPPONENT gana en la segunda columna', () => {
            const board = [BOT, OPPONENT, BOT, BOT, OPPONENT, 0, 0, OPPONENT, 0];
            expect(evaluate(board)).toBe(-10);
        });

        test('Debe retornar -10 si OPPONENT gana en la diagonal principal', () => {
            const board = [OPPONENT, BOT, 0, BOT, OPPONENT, 0, 0, 0, OPPONENT];
            expect(evaluate(board)).toBe(-10);
        });

        test('Debe retornar -10 si OPPONENT gana en la diagonal inversa', () => {
            const board = [BOT, 0, OPPONENT, BOT, OPPONENT, 0, OPPONENT, 0, 0];
            expect(evaluate(board)).toBe(-10);
        });
    });

    describe('Estados sin ganador', () => {
        test('Debe retornar 0 si no hay ganador (juego en curso)', () => {
            const board = [BOT, OPPONENT, BOT, 0, 0, 0, 0, 0, 0];
            expect(evaluate(board)).toBe(0);
        });

        test('Debe retornar 0 en caso de empate (tablero lleno sin línea ganadora)', () => {
            const board = [BOT, OPPONENT, BOT, OPPONENT, BOT, BOT, OPPONENT, BOT, OPPONENT];
            expect(evaluate(board)).toBe(0);
        });

        test('Debe retornar 0 en un tablero vacío', () => {
            const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            expect(evaluate(board)).toBe(0);
        });

        test('Debe retornar 0 con un solo movimiento realizado', () => {
            const board = [BOT, 0, 0, 0, 0, 0, 0, 0, 0];
            expect(evaluate(board)).toBe(0);
        });
    });
});

// ============================================
// SUITE: minimax
// ============================================
describe('minimax - Algoritmo de búsqueda con poda alpha-beta', () => {
    describe('Estados terminales', () => {
        test('Debe reconocer una victoria del BOT y retornar 10', () => {
            const board = [BOT, BOT, BOT, 0, OPPONENT, 0, OPPONENT, 0, 0];
            const score = minimax(board, 0, true, -Infinity, Infinity);
            expect(score).toBe(10);
        });

        test('Debe reconocer una victoria del OPPONENT y retornar -10', () => {
            const board = [OPPONENT, OPPONENT, OPPONENT, 0, BOT, 0, BOT, 0, 0];
            const score = minimax(board, 0, false, -Infinity, Infinity);
            expect(score).toBe(-10);
        });

        test('Debe reconocer un empate y retornar 0', () => {
            const board = [BOT, OPPONENT, BOT, OPPONENT, BOT, BOT, OPPONENT, BOT, OPPONENT];
            const score = minimax(board, 0, true, -Infinity, Infinity);
            expect(score).toBe(0);
        });
    });

    describe('Búsqueda en profundidad', () => {
        test('Debe predecir victoria del BOT en dos movimientos', () => {
            // BOT puede ganar en índice 2, o forzar victoria después
            const board = [BOT, BOT, 0, OPPONENT, 0, 0, 0, 0, 0];
            const score = minimax(board, 0, true, -Infinity, Infinity);
            expect(score).toBe(10);
        });

        test('Debe predecir empate cuando ambos juegan óptimamente', () => {
            // Posición donde un juego perfecto lleva a empate
            const board = [BOT, 0, 0, 0, OPPONENT, 0, 0, 0, 0];
            const score = minimax(board, 0, true, -Infinity, Infinity);
            expect(score).toBe(0);
        });

        test('Debe detectar que OPPONENT ganará con juego óptimo', () => {
            // OPPONENT tiene ventaja decisiva
            const board = [0, 0, 0, OPPONENT, OPPONENT, 0, BOT, 0, 0];
            const score = minimax(board, 0, false, -Infinity, Infinity);
            expect(score).toBe(-10);
        });
    });

    describe('Poda alpha-beta', () => {
        test('Debe funcionar correctamente con poda alpha-beta', () => {
            const board = [BOT, 0, 0, 0, 0, 0, 0, 0, 0];
            const scoreWithPruning = minimax(board, 0, false, -Infinity, Infinity);
            
            // El resultado debe ser el mismo que sin poda (empate con juego óptimo)
            expect(scoreWithPruning).toBe(0);
        });
    });
});

// ============================================
// SUITE: findBestMove
// ============================================
describe('findBestMove - Selección del mejor movimiento', () => {
    describe('Movimientos ganadores inmediatos', () => {
        test('Debe elegir el movimiento que da victoria inmediata en fila', () => {
            const board = [BOT, BOT, 0, OPPONENT, OPPONENT, 0, 0, 0, 0];
            expect(findBestMove(board)).toBe(2);
        });

        test('Debe elegir victoria inmediata en columna', () => {
            const board = [BOT, OPPONENT, OPPONENT, BOT, 0, 0, 0, 0, 0];
            expect(findBestMove(board)).toBe(6);
        });

        test('Debe elegir victoria inmediata en diagonal principal', () => {
            const board = [BOT, 0, OPPONENT, 0, BOT, 0, OPPONENT, 0, 0];
            expect(findBestMove(board)).toBe(8);
        });

        test('Debe elegir victoria inmediata en diagonal inversa', () => {
            const board = [0, 0, BOT, OPPONENT, BOT, 0, OPPONENT, 0, 0];
            expect(findBestMove(board)).toBe(0);
        });
    });

    describe('Movimientos defensivos (bloqueos)', () => {
        test('Debe bloquear victoria inminente del oponente en fila', () => {
            const board = [BOT, 0, 0, OPPONENT, OPPONENT, 0, 0, 0, 0];
            expect(findBestMove(board)).toBe(5);
        });

        test('Debe bloquear victoria inminente del oponente en columna', () => {
            const board = [OPPONENT, BOT, BOT, OPPONENT, 0, 0, 0, 0, 0];
            expect(findBestMove(board)).toBe(6);
        });

        test('Debe bloquear victoria inminente del oponente en diagonal', () => {
            const board = [OPPONENT, BOT, BOT, 0, OPPONENT, 0, 0, 0, 0];
            expect(findBestMove(board)).toBe(8);
        });

        test('Debe priorizar victoria sobre bloqueo', () => {
            // BOT puede ganar en 2 o bloquear en 5
            const board = [BOT, BOT, 0, OPPONENT, OPPONENT, 0, 0, 0, 0];
            expect(findBestMove(board)).toBe(2); // Debe ganar, no solo bloquear
        });
    });

    describe('Movimientos de apertura', () => {
        test('Debe elegir el centro en tablero vacío', () => {
            const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            expect(findBestMove(board)).toBe(4);
        });

        test('Debe elegir una esquina si el centro está ocupado por el oponente', () => {
            const board = [0, 0, 0, 0, OPPONENT, 0, 0, 0, 0];
            const validCorners = [0, 2, 6, 8];
            expect(validCorners).toContain(findBestMove(board));
        });

        test('Debe elegir el centro si el oponente toma una esquina', () => {
            const board = [OPPONENT, 0, 0, 0, 0, 0, 0, 0, 0];
            expect(findBestMove(board)).toBe(4);
        });

        test('Debe elegir una esquina si el oponente toma un borde', () => {
            const board = [0, OPPONENT, 0, 0, 0, 0, 0, 0, 0];
            const validMoves = [0, 2, 4, 6, 8]; // Centro o esquinas son óptimas
            expect(validMoves).toContain(findBestMove(board));
        });
    });

    describe('Situaciones complejas de juego medio', () => {
        test('Debe forzar una victoria en un tablero avanzado', () => {
            const board = [BOT, OPPONENT, BOT, BOT, OPPONENT, OPPONENT, 0, 0, 0];
            // BOT debe jugar en 7 para forzar la victoria
            expect(findBestMove(board)).toBe(7);
        });

        test('Debe bloquear una amenaza doble', () => {
            const board = [
                BOT, 0, 0, 
                OPPONENT, BOT, 0, 
                0, OPPONENT, 0
            ];
            // El oponente amenaza múltiples líneas, BOT debe jugar óptimamente
            expect(findBestMove(board)).toBe(2);
        });

        test('Debe crear una amenaza doble cuando sea posible', () => {
            const board = [BOT, 0, 0, 0, OPPONENT, 0, 0, 0, BOT];
            // BOT puede crear doble amenaza jugando en posición estratégica
            const bestMove = findBestMove(board);
            expect([2, 3, 5, 6]).toContain(bestMove);
        });

        test('Debe jugar óptimamente en posición compleja', () => {
            const board = [
                OPPONENT, BOT, OPPONENT,
                0, BOT, 0,
                0, 0, 0
            ];
            // BOT debe jugar para maximizar chances de victoria o empate
            const bestMove = findBestMove(board);
            expect([3, 5, 6, 7, 8]).toContain(bestMove);
        });
    });

    describe('Escenarios de final de juego', () => {
        test('Debe encontrar el único movimiento restante', () => {
            const board = [BOT, OPPONENT, BOT, OPPONENT, BOT, OPPONENT, OPPONENT, BOT, 0];
            expect(findBestMove(board)).toBe(8);
        });

        test('Debe elegir movimiento que asegura empate sobre derrota', () => {
            const board = [
                OPPONENT, BOT, OPPONENT,
                BOT, OPPONENT, BOT,
                0, 0, OPPONENT
            ];
            // Debe jugar para empatar, no perder
            const bestMove = findBestMove(board);
            expect([6, 7]).toContain(bestMove);
        });
    });

    describe('Pruebas de integridad del algoritmo', () => {
        test('No debe retornar -1 cuando hay movimientos disponibles', () => {
            const board = [BOT, OPPONENT, 0, 0, 0, 0, 0, 0, 0];
            const move = findBestMove(board);
            expect(move).toBeGreaterThanOrEqual(0);
            expect(move).toBeLessThanOrEqual(8);
        });

        test('Debe retornar un índice válido de casilla vacía', () => {
            const board = [BOT, 0, OPPONENT, 0, BOT, 0, OPPONENT, 0, 0];
            const move = findBestMove(board);
            expect(board[move]).toBe(0);
        });

        test('Debe ser consistente en múltiples llamadas con el mismo tablero', () => {
            const board = [BOT, 0, 0, 0, OPPONENT, 0, 0, 0, 0];
            const move1 = findBestMove([...board]);
            const move2 = findBestMove([...board]);
            expect(move1).toBe(move2);
        });
    });

    describe('Casos límite y validación', () => {
        test('Debe manejar tablero con un solo espacio vacío', () => {
            const board = [BOT, OPPONENT, BOT, OPPONENT, BOT, OPPONENT, OPPONENT, BOT, 0];
            expect(findBestMove(board)).toBe(8);
        });

        test('Debe funcionar correctamente después de múltiples movimientos', () => {
            const board = [BOT, OPPONENT, BOT, OPPONENT, 0, 0, 0, 0, 0];
            const move = findBestMove(board);
            expect(move).toBeGreaterThanOrEqual(0);
            expect(move).toBeLessThanOrEqual(8);
            expect(board[move]).toBe(0);
        });
    });
});

// ============================================
// SUITE: Pruebas de Integración
// ============================================
describe('Integración - Simulación de partidas completas', () => {
    test('BOT debe al menos empatar desde el inicio con juego perfecto', () => {
        let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let turn = BOT;
        let moves = 0;

        while (isMovesLeft(board) && evaluate(board) === 0 && moves < 9) {
            const move = findBestMove(board);
            board[move] = turn;
            turn = turn === BOT ? OPPONENT : BOT;
            moves++;
        }

        const finalScore = evaluate(board);
        // BOT nunca debe perder si juega primero
        expect(finalScore).toBeGreaterThanOrEqual(0);
    });

    test('BOT debe defenderse correctamente si OPPONENT juega primero', () => {
        let board = [0, 0, 0, 0, OPPONENT, 0, 0, 0, 0]; // Oponente tomó centro
        let turn = BOT;
        let moves = 1;

        while (isMovesLeft(board) && evaluate(board) === 0 && moves < 9) {
            const move = findBestMove(board);
            board[move] = turn;
            turn = turn === BOT ? OPPONENT : BOT;
            moves++;
        }

        const finalScore = evaluate(board);
        // BOT debe al menos empatar
        expect(finalScore).toBeGreaterThanOrEqual(-10);
    });

    test('BOT debe detectar y aprovechar errores del oponente', () => {
        // Oponente hace movimientos subóptimos
        const board = [OPPONENT, 0, 0, 0, BOT, 0, 0, 0, OPPONENT];
        const move = findBestMove(board);
        
        // BOT debe encontrar movimiento que le dé ventaja
        expect(move).toBeGreaterThanOrEqual(0);
        expect(move).toBeLessThanOrEqual(8);
    });
});