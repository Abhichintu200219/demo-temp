// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,              // expose describe/it/expect/vi as globals
    environment: 'jsdom',       // give tests a DOM
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.test.*', 'src/**/*.spec.*'] // optional, good to be explicit
  }
});
