import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,            // enable describe/it/expect/vi as globals
    environment: 'jsdom',     // DOM for @testing-library
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.test.*', 'src/**/*.spec.*']
  }
});
