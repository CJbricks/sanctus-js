/**
 * providers.js
 * Chakra UI provider for menus and dialogue panels.
 *
 * WHY a client component:
 * Chakra's provider uses React context, which only works in client
 * components. `defaultSystem` is Chakra 3's stock theme — good enough
 * for the scaffold; a custom pixel theme can come later.
 */

"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export function Providers({ children }) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}
