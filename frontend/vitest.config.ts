import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    // Vitest 3+ configuration for single thread/fork execution:
    fileParallelism: false,
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
