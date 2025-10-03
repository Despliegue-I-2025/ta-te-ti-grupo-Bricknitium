module.exports = {
  // Entorno de ejecución
  testEnvironment: 'node',

  // Patrón de archivos de prueba
  testMatch: [
    '**/test/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],

  // Cobertura de código
  collectCoverageFrom: [
    'test/MinimaxLogic.js',
    '!**/node_modules/**',
    '!**/test/**',
    '!**/dist/**'
  ],

  // Umbral mínimo de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },

  // Formato de reportes de cobertura
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],

  // Tiempo máximo por prueba (en ms)
  testTimeout: 10000,

  // Mostrar pruebas individuales
  verbose: true,

  // Limpiar mocks automáticamente entre pruebas
  clearMocks: true,

  // Restaurar mocks automáticamente
  restoreMocks: true,

  // Colores en la salida
  colors: true,

  // Notificaciones del sistema (opcional)
  // notify: true,
  // notifyMode: 'failure-change',

  // Detener en el primer error (útil para debugging)
  // bail: 1,

  // Ejecutar pruebas en paralelo
  maxWorkers: '50%'
};