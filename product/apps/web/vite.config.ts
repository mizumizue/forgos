import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@lesson-studio/domain": path.resolve(
        __dirname,
        "../../packages/domain/src/index.ts",
      ),
    },
  },
  server: {
    port: 5174,
  },
});
