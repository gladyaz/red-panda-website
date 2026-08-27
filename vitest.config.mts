import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // Vite resolves the `@/*` alias from tsconfig.json natively.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    // Each file controls its own NEXT_PUBLIC_* values with `vi.stubEnv`, and a
    // leaked stub would silently change what another file asserts about the
    // unset state. Restoring between tests keeps "unset" genuinely unset.
    unstubEnvs: true,
    restoreMocks: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
