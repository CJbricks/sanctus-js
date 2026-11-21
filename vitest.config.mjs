/**
 * vitest.config.js
 * Test runner for pure game rules in src/lib.
 *
 * WHY Node (not a browser):
 * Save migration, key mapping, and calling-menu data are plain
 * functions. Running them in Node is fast and does not need Pixi or
 * a DOM. The `@` alias matches jsconfig.json so tests import code the
 * same way the app does (`@/lib/save`).
 */

import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.js", "tests/**/*.test.js"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
