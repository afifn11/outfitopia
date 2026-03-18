// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/config/**'],
    },
    // Set env vars untuk testing
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret-key-minimum-32-characters-long',
      FRONTEND_URL: 'http://localhost:5173',
    },
  },
});
