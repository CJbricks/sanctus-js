/**
 * page.js
 * The only route. Mounts the client game inside Chakra providers.
 *
 * WHY one route for now:
 * Title, calling menu, and dialogue share one save and one audio
 * unlock. Splitting into more URLs would force us to re-hydrate state
 * between screens before the overworld even exists.
 */

"use client";

import { GameApp } from "@/components/game/GameApp";
import { Providers } from "@/components/providers";

export default function Page() {
  return (
    <Providers>
      <GameApp />
    </Providers>
  );
}
