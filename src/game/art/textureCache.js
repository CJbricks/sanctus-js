/**
 * textureCache.js
 * Cache generated Pixi textures so we do not rebuild tile/sprite art
 * every frame.
 *
 * WHY cache:
 * Drawing hundreds of fillRect calls for a 32×40 character (or a whole
 * map) every tick would waste CPU. Bake once, reuse the Texture / Sprite.
 * Tests can exercise the Map logic with fake factories — no GPU needed.
 */

/** @type {Map<string, unknown>} */
const cache = new Map();

/**
 * Return a cached value, or build it with `factory` and store it.
 * @template T
 * @param {string} key
 * @param {() => T} factory
 * @returns {T}
 */
export function getOrCreate(key, factory) {
  if (cache.has(key)) {
    return /** @type {T} */ (cache.get(key));
  }
  const value = factory();
  cache.set(key, value);
  return value;
}

/** How many entries are cached (for tests / debug). */
export function cacheSize() {
  return cache.size;
}

/** True when a key is already baked. */
export function hasCacheKey(key) {
  return cache.has(key);
}

/**
 * Drop one key or the whole cache.
 * WHY clear on scene destroy: free GPU textures when leaving overworld.
 * @param {string} [key]
 */
export function clearTextureCache(key) {
  if (key == null) {
    cache.clear();
    return;
  }
  cache.delete(key);
}

/**
 * Stable cache key for a character pose.
 * @param {string} look
 * @param {string} facing
 * @param {number} frame
 */
export function characterCacheKey(look, facing, frame) {
  return `char:${look}:${facing}:${frame | 0}`;
}

/**
 * Stable cache key for a tile + variant.
 * @param {string} id
 * @param {number} variant
 */
export function tileCacheKey(id, variant) {
  return `tile:${id}:v${variant | 0}`;
}

/**
 * Bake a Graphics display object into a Pixi Texture via the renderer.
 * Returns null when no renderer is available (SSR / tests).
 *
 * @param {object | null | undefined} renderer  Pixi Renderer
 * @param {import("pixi.js").Container} displayObject
 * @param {string} key
 * @returns {import("pixi.js").Texture | null}
 */
export function bakeTexture(renderer, displayObject, key) {
  if (!renderer || typeof renderer.generateTexture !== "function") {
    return null;
  }
  return getOrCreate(key, () => renderer.generateTexture(displayObject));
}
