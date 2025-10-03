/**
 * Ejemplos de pruebas avanzadas usando testUtils
 * Estas pruebas demuestran cómo usar las utilidades para casos complejos
 */

const { findBestMove, evaluate } = require('./MinimaxLogic');
const {
    boardFromString,
    boardToString,
    createBoard,
    simulateGame,
    randomStrategy,
    firstAvailableStrategy,
    getTestBoards,
    playMoves,
    countPieces,
    BOT,
    OPPONENT
} = require('./testUtils');

describe('Pruebas Avanzadas con testUtils', () => {
    
    // ============================================
    // Usando boardFromString para legibilidad
    // ============================================
    describe('Pruebas visuales con boardFromString', () => {
        test('Debe detectar victoria en T', () => {
            const board = boardFromString(`
                X | O | X
                ---------
                O | X | O
                ---------
                _ | X | _
            `);
            
            console.log('Tablero:', boardToString(board));
            expect(evaluate(board)).toBe(10);
        });
        
        test('Debe encontrar el movimiento ganador visualmente', () => {
            const board = boardFromString(`
                X | X | _
                ---------
                O | O | _
                ---------
                _ | _ | _
            `);
            
            expect(findBestMove(board)).toBe(2); // Completa la fila superior
        });
    });
    
    // ============================================
    // Usando createBoard para configuraciones específicas
    // ============================================
    describe('Creación dinámica de tableros', () => {
        test('Debe crear tablero con configuración específica', () => {
            const board = createBoard({
                0: BOT,
                4: OPPONENT,
                8: BOT
            });
            
            expect(board).toEqual([BOT, 0, 0, 0, OPPONENT, 0, 0, 0, BOT]);
        });
        
        test('Debe manejar esquinas ocupadas', () => {
            const board = createBoard({
                0: OPPONENT,
                2: OPPONENT,
                6: OPPONENT,
                8: OPPONENT
            });
            
            // BOT debe tomar el centro o defenderse
            const move = findBestMove(board);
            expect(move).toBe(4);
        });
    });
    
    // ============================================
    // Simulaciones de partidas completas
    // ============================================
    describe('Simulación de partidas completas', () => {
        test('BOT debe vencer a estrategia aleatoria frecuentemente', () => {
            const results = { BOT: 0, OPPONENT: 0, DRAW: 0 };
            const games = 50;
            
            for (let i = 0; i < games; i++) {
                const result = simulateGame(
                    (board) => findBestMove(board),
                    (board) => randomStrategy(board)
                );
                results[result.winner]++;
            }
            
            console.log('Resultados de 50 partidas:', results);
            
            // BOT debe ganar o empatar más del 90% de las veces
            expect(results.BOT + results.DRAW).toBeGreaterThan(games * 0.9);
        });
        
        test('BOT vs BOT debe siempre empatar', () => {
            const result = simulateGame(
                (board) => findBestMove(board),
                (board) => findBestMove(board)
            );
            
            console.log('BOT vs BOT:', result);
            expect(result.winner).toBe('DRAW');
        });
        
        test('BOT debe vencer a estrategia "primera casilla"', () => {
            const result = simulateGame(
                (board) => findBestMove(board),
                (board) => firstAvailableStrategy(board)
            );
            
            console.log('BOT vs Primera Casilla:', result);
            expect(result.winner).toBe('BOT');
        });
        
        test('Debe registrar el historial de movimientos', () => {
            const result = simulateGame(
                (board) => findBestMove(board),
                (board) => randomStrategy(board)
            );
            
            expect(result.history.length).toBeGreaterThan(0);
            expect(result.history.length).toBeLessThanOrEqual(9);
            
            // Cada movimiento debe tener turn, move y board
            result.history.forEach(entry => {
                expect(entry).toHaveProperty('turn');
                expect(entry).toHaveProperty('move');
                expect(entry).toHaveProperty('board');
            });
        });
    });
    
    // ============================================
    // Usando tableros predefinidos
    // ============================================
    describe('Tableros de prueba predefinidos', () => {
        const boards = getTestBoards();
        
        test('Debe reconocer victoria del BOT en fila', () => {
            expect(evaluate(boards.botWinRow)).toBe(10);
        });
        
        test('Debe reconocer victoria del BOT en columna', () => {
            expect(evaluate(boards.botWinCol)).toBe(10);
        });
        
        test('Debe reconocer victoria del BOT en diagonal', () => {
            expect(evaluate(boards.botWinDiag)).toBe(10);
        });
        
        test('Debe reconocer victoria del OPPONENT', () => {
            expect(evaluate(boards.opponentWinRow)).toBe(-10);
        });
        
        test('Debe reconocer empate', () => {
            expect(evaluate(boards.draw)).toBe(0);
        });
        
        test('Debe completar la victoria en almostWinBot', () => {
            expect(findBestMove(boards.almostWinBot)).toBe(2);
        });
        
        test('Debe bloquear en almostWinOpponent', () => {
            expect(findBestMove(boards.almostWinOpponent)).toBe(2);
        });
        
        test('Debe manejar fork correctamente', () => {
            const move = findBestMove(boards.fork);
            // Debe jugar para maximizar chances
            expect([1, 2, 3, 5, 6, 7]).toContain(move);
        });
    });
    
    // ============================================
    // Usando playMoves para secuencias
    // ============================================
    describe('Secuencias de movimientos', () => {
        test('Debe recrear una partida específica', () => {
            // Partida: BOT juega centro, OPPONENT esquina, etc.
            const board = playMoves([4, 0, 2, 6], BOT);
            
            expect(board).toEqual([
                OPPONENT, 0, BOT,
                0, BOT, 0,
                OPPONENT, 0, 0
            ]);
        });
        
        test('Debe detectar error en movimiento inválido', () => {
            expect(() => {
                playMoves([4, 4], BOT); // Segundo movimiento repite casilla
            }).toThrow('Casilla 4 ya está ocupada');
        });
        
        test('Debe seguir una apertura clásica', () => {
            // Centro -> Esquina -> Esquina opuesta
            const board = playMoves([4, 0, 8], BOT);
            
            console.log('Apertura:', boardToString(board));
            
            expect(countPieces(board)).toEqual({
                bot: 2,
                opponent: 1,
                empty: 6
            });
        });
    });
    
    // ============================================
    // Pruebas de Performance
    // ============================================
    describe('Performance y Optimización', () => {
        test('findBestMove debe ejecutarse en < 100ms en tablero vacío', () => {
            const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            
            const startTime = performance.now();
            findBestMove(board);
            const endTime = performance.now();
            
            const elapsed = endTime - startTime;
            console.log(`Tiempo en tablero vacío: ${elapsed.toFixed(2)}ms`);
            
            expect(elapsed).toBeLessThan(100);
        });
        
        test('findBestMove debe ser rápido en tablero con 5 movimientos', () => {
            const board = playMoves([4, 0, 2, 6, 8], BOT);
            
            const startTime = performance.now();
            findBestMove(board);
            const endTime = performance.now();
            
            const elapsed = endTime - startTime;
            console.log(`Tiempo con 5 movimientos: ${elapsed.toFixed(2)}ms`);
            
            expect(elapsed).toBeLessThan(50);
        });
        
        test('Debe procesar múltiples tableros rápidamente', () => {
            const boards = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                playMoves([4], BOT),
                playMoves([4, 0], BOT),
                playMoves([4, 0, 2], BOT),
                playMoves([4, 0, 2, 6], BOT)
            ];
            
            const startTime = performance.now();
            boards.forEach(board => findBestMove(board));
            const endTime = performance.now();
            
            const elapsed = endTime - startTime;
            console.log(`Tiempo procesando 5 tableros: ${elapsed.toFixed(2)}ms`);
            
            expect(elapsed).toBeLessThan(200);
        });
    });
    
    // ============================================
    // Pruebas Estadísticas
    // ============================================
    describe('Análisis Estadístico', () => {
        test('BOT debe ganar frecuentemente contra estrategia débil', () => {
            const trials = 100;
            const results = { BOT: 0, OPPONENT: 0, DRAW: 0 };
            
            for (let i = 0; i < trials; i++) {
                const result = simulateGame(
                    (board) => findBestMove(board),
                    (board) => firstAvailableStrategy(board)
                );
                results[result.winner]++;
            }
            
            const winRate = (results.BOT / trials) * 100;
            console.log(`Tasa de victoria: ${winRate}%`);
            console.log(`Empates: ${results.DRAW}`);
            console.log(`Derrotas: ${results.OPPONENT}`);
            
            expect(winRate).toBeGreaterThan(80);
        });
        
        test('Debe analizar distribución de movimientos iniciales', () => {
            const initialMoves = {};
            const trials = 100;
            
            for (let i = 0; i < trials; i++) {
                const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                const move = findBestMove(board);
                initialMoves[move] = (initialMoves[move] || 0) + 1;
            }
            
            console.log('Distribución de primeros movimientos:', initialMoves);
            
            // El centro (4) debe ser siempre el primer movimiento
            expect(initialMoves[4]).toBe(trials);
        });
        
        test('Debe preferir esquinas cuando centro está ocupado', () => {
            const corners = [0, 2, 6, 8];
            const cornerCounts = {};
            const trials = 100;
            
            for (let i = 0; i < trials; i++) {
                const board = [0, 0, 0, 0, OPPONENT, 0, 0, 0, 0];
                const move = findBestMove(board);
                cornerCounts[move] = (cornerCounts[move] || 0) + 1;
            }
            
            console.log('Distribución cuando centro ocupado:', cornerCounts);
            
            // Debe elegir una esquina
            const chosenMove = Object.keys(cornerCounts)[0];
            expect(corners).toContain(parseInt(chosenMove));
        });
    });
    
    // ============================================
    // Pruebas de Estrategia Avanzada
    // ============================================
    describe('Análisis Estratégico Avanzado', () => {
        test('Debe crear fork cuando sea posible', () => {
            // Configuración que permite crear fork
            const board = createBoard({
                4: BOT,      // Centro
                0: OPPONENT  // Esquina
            });
            
            const move = findBestMove(board);
            
            // Movimientos que crean fork: esquinas opuestas
            const forkMoves = [2, 6, 8];
            expect(forkMoves).toContain(move);
        });
        
        test('Debe bloquear fork del oponente', () => {
            const board = createBoard({
                0: OPPONENT,
                4: BOT,
                8: OPPONENT
            });
            
            const move = findBestMove(board);
            
            // Debe bloquear en un borde para prevenir fork
            const blockMoves = [1, 3, 5, 7];
            expect(blockMoves).toContain(move);
        });
        
        test('Debe priorizar centro sobre esquinas en inicio', () => {
            const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            expect(findBestMove(board)).toBe(4);
        });
        
        test('Debe jugar esquina opuesta a la del oponente', () => {
            const scenarios = [
                { board: createBoard({ 0: OPPONENT }), oppositeCorners: [8] },
                { board: createBoard({ 2: OPPONENT }), oppositeCorners: [6] },
                { board: createBoard({ 6: OPPONENT }), oppositeCorners: [2] },
                { board: createBoard({ 8: OPPONENT }), oppositeCorners: [0] }
            ];
            
            scenarios.forEach(({ board, oppositeCorners }) => {
                const move = findBestMove(board);
                // Centro (4) o esquina opuesta son jugadas óptimas
                expect([4, ...oppositeCorners]).toContain(move);
            });
        });
    });
    
    // ============================================
    // Pruebas de Casos Especiales
    // ============================================
    describe('Casos Especiales y Edge Cases', () => {
        test('Debe manejar tablero casi lleno', () => {
            const board = boardFromString(`
                X | O | X
                ---------
                O | X | O
                ---------
                X | _ | O
            `);
            
            expect(findBestMove(board)).toBe(7);
        });
        
        test('Debe detectar victoria en último movimiento posible', () => {
            const board = boardFromString(`
                X | O | X
                ---------
                O | _ | O
                ---------
                X | O | X
            `);
            
            expect(findBestMove(board)).toBe(4);
        });
        
        test('Debe manejar múltiples amenazas simultáneas', () => {
            const board = boardFromString(`
                O | O | _
                ---------
                _ | X | _
                ---------
                _ | _ | _
            `);
            
            // Debe bloquear la amenaza más inmediata
            expect(findBestMove(board)).toBe(2);
        });
        
        test('Debe reconocer situación perdida y jugar óptimamente', () => {
            const board = boardFromString(`
                O | O | _
                ---------
                O | X | _
                ---------
                _ | _ | _
            `);
            
            // Aunque pierde, debe hacer movimiento válido
            const move = findBestMove(board);
            expect([2, 3, 5, 6, 7, 8]).toContain(move);
        });
    });
    
    // ============================================
    // Pruebas de Consistencia
    // ============================================
    describe('Consistencia del Algoritmo', () => {
        test('Debe dar mismo resultado en múltiples ejecuciones', () => {
            const board = playMoves([4, 0, 2], BOT);
            
            const results = new Set();
            for (let i = 0; i < 10; i++) {
                results.add(findBestMove([...board]));
            }
            
            // Solo debe haber un resultado único
            expect(results.size).toBe(1);
        });
        
        test('Debe ser determinístico para todos los tableros', () => {
            const testBoards = getTestBoards();
            
            Object.entries(testBoards).forEach(([name, board]) => {
                if (countPieces(board).empty > 0) {
                    const move1 = findBestMove([...board]);
                    const move2 = findBestMove([...board]);
                    
                    expect(move1).toBe(move2);
                }
            });
        });
        
        test('No debe modificar el tablero original', () => {
            const originalBoard = [0, 0, 0, 0, OPPONENT, 0, 0, 0, 0];
            const boardCopy = [...originalBoard];
            
            findBestMove(originalBoard);
            
            expect(originalBoard).toEqual(boardCopy);
        });
    });
    
    // ============================================
    // Pruebas de Documentación (Living Documentation)
    // ============================================
    describe('Ejemplos de Uso (Documentación)', () => {
        test('Ejemplo 1: Cómo usar findBestMove', () => {
            // Crear un tablero
            const board = [
                BOT, 0, 0,
                0, OPPONENT, 0,
                0, 0, 0
            ];
            
            // Obtener el mejor movimiento
            const bestMove = findBestMove(board);
            
            // Aplicar el movimiento
            board[bestMove] = BOT;
            
            console.log('Tablero después del movimiento:');
            console.log(boardToString(board));
            
            expect(bestMove).toBeGreaterThanOrEqual(0);
            expect(bestMove).toBeLessThanOrEqual(8);
        });
        
        test('Ejemplo 2: Simular una partida completa', () => {
            const result = simulateGame(
                (board) => findBestMove(board),      // Estrategia del BOT
                (board) => randomStrategy(board)     // Estrategia del oponente
            );
            
            console.log('Resultado:', result.winner);
            console.log('Movimientos:', result.moves);
            console.log('Tablero final:');
            console.log(boardToString(result.finalBoard));
            
            expect(['BOT', 'OPPONENT', 'DRAW']).toContain(result.winner);
        });
        
        test('Ejemplo 3: Crear tablero personalizado', () => {
            const board = createBoard({
                0: BOT,
                4: OPPONENT,
                8: BOT
            });
            
            console.log('Tablero personalizado:');
            console.log(boardToString(board));
            
            const pieces = countPieces(board);
            expect(pieces.bot).toBe(2);
            expect(pieces.opponent).toBe(1);
        });
    });
});

// ============================================
// Suite Extra: Benchmarking Completo
// ============================================
describe('Benchmarking Completo', () => {
    test('Rendimiento en diferentes profundidades', () => {
        const depths = [
            { moves: 0, label: 'Tablero vacío' },
            { moves: 2, label: '2 movimientos' },
            { moves: 4, label: '4 movimientos' },
            { moves: 6, label: '6 movimientos' },
            { moves: 8, label: '8 movimientos' }
        ];
        
        console.log('\n=== Análisis de Rendimiento ===');
        
        depths.forEach(({ moves, label }) => {
            const board = playMoves(
                Array.from({ length: moves }, (_, i) => i),
                BOT
            );
            
            const startTime = performance.now();
            const bestMove = findBestMove(board);
            const endTime = performance.now();
            
            const elapsed = endTime - startTime;
            console.log(`${label}: ${elapsed.toFixed(2)}ms - Mejor movimiento: ${bestMove}`);
        });
    });
    
    test('Comparación de estrategias', () => {
        const strategies = [
            { name: 'Minimax (BOT)', fn: (board) => findBestMove(board) },
            { name: 'Primera casilla', fn: (board) => firstAvailableStrategy(board) },
            { name: 'Aleatoria', fn: (board) => randomStrategy(board) }
        ];
        
        console.log('\n=== Comparación de Estrategias ===');
        
        strategies.forEach(({ name, fn }) => {
            const startTime = performance.now();
            
            for (let i = 0; i < 100; i++) {
                const board = [0, 0, 0, 0, OPPONENT, 0, 0, 0, 0];
                fn(board);
            }
            
            const endTime = performance.now();
            const avgTime = (endTime - startTime) / 100;
            
            console.log(`${name}: ${avgTime.toFixed(3)}ms por movimiento`);
        });
    });
});