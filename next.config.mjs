/**
 * next.config.mjs
 * Next.js settings for SANCTUS.
 *
 * WHY webpack (not Turbopack) for `next dev` / `next build`:
 * Chakra UI uses Emotion. Turbopack can emit Emotion style tags in a
 * different order than the server HTML, which causes a hydration
 * mismatch. Webpack keeps the order stable.
 *
 * WHY optimizePackageImports for Chakra:
 * Chakra is a big library. This tells Next to import only the pieces
 * we use, so the browser download stays smaller.
 *
 * No vercel.json is required. Vercel runs `next build` by default.
 * Secrets never live here — if we ever need one, it goes in a Vercel
 * environment variable (see README).
 */

const nextConfig = {
  // Stop Next from auto-writing an AGENTS.md into the repo.
  agentRules: false,
  // Hide the floating Next.js indicator during playtesting.
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
