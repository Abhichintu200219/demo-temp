import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    
     exclude: [
      '**/node_modules/**',
      '**/e2e/**',      // Exclude e2e directory
      '**/*.spec.ts',   // Exclude .spec.ts files
    ]
  },
} as any)
