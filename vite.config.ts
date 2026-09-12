import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// No `define` block for GEMINI_API_KEY here on purpose: every AI call goes
// through server.ts's /api/* proxy endpoints, which read the key from the
// server-side Node process (see server.ts). Baking it into `process.env.*`
// via `define` would inline the real key into the client-side JS bundle --
// anyone could read it out of the built site's network tab.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
