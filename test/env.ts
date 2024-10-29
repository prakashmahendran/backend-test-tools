/**
 * Load a test environment
 */
process.env = {
  SILENCE_REPORT: 'true',
  PORT: '8080',
  NODE_ENV: 'test',
};

export {};
