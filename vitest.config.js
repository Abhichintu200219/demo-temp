// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        include: ['src/**/*.test.*', 'src/**/*.spec.*'],
        css: false, // Disable CSS processing in tests
    },
    // Handle CSS imports in tests
    resolve: {
        alias: {
            '@/': new URL('./src/', import.meta.url).pathname,
        },
    },
});
