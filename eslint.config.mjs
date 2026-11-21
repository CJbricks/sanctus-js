/**
 * eslint.config.mjs
 * Lint rules for SANCTUS. Extends Next.js's recommended flat config
 * (core web vitals + React rules). This shape works with Next 16's
 * ESLint flat-config setup.
 *
 * WHY we ignore build folders:
 * Linting generated output (`.next`, `coverage`) would flood the
 * report with problems we did not write and cannot usefully fix.
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
