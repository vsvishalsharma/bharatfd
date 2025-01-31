module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/src/config/',
      '/src/utils/'
    ],
    setupFiles: ['<rootDir>/tests/setup.js'],
    testMatch: [
      '**/__tests__/**/*.js?(x)',
      '**/?(*.)+(spec|test).js?(x)'
    ]
  }