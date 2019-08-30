module.exports = {
  collectCoverage: process.env.COVERAGE === 'true',
  collectCoverageFrom: [
    '**/*.{js,vue}',
    '!**/node_modules/**',
    '!**/lib/**',
    '!**/tests/**',
    '!**/build/**'
  ],
  coverageReporters: ['html', 'text-summary'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  setupFiles: ['<rootDir>tests/unit/setup'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.js?$': 'babel-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.test.(js|jsx|ts|tsx)'
  ],
  testPathIgnorePatterns: ['<rootDir>/.history/', '<rootDir>/node_modules/'],
  testURL: 'http://localhost/',
  transformIgnorePatterns: ['/node_modules/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
}
