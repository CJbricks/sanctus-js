/**
 * textureCache.test.js
 * Cache get/set/clear without a GPU.
 */

import { describe, expect, it, beforeEach } from "vitest";
import {
  bakeTexture,
  cacheSize,
  characterCacheKey,
  clearTextureCache,
  getOrCreate,
  hasCacheKey,
  tileCacheKey,
} from "@/game/art/textureCache";

beforeEach(() => {
  clearTextureCache();
});

describe("getOrCreate", () => {
  it("builds once and reuses the cached value", () => {
    let builds = 0;
    const a = getOrCreate("demo", () => {
      builds += 1;
      return { ok: true };
    });
    const b = getOrCreate("demo", () => {
      builds += 1;
      return { ok: false };
    });
    expect(a).toBe(b);
    expect(builds).toBe(1);
    expect(cacheSize()).toBe(1);
    expect(hasCacheKey("demo")).toBe(true);
  });

  it("clearTextureCache drops keys", () => {
    getOrCreate("x", () => 1);
    clearTextureCache("x");
    expect(hasCacheKey("x")).toBe(false);
    getOrCreate("y", () => 2);
    clearTextureCache();
    expect(cacheSize()).toBe(0);
  });
});

describe("cache key helpers", () => {
  it("builds stable character and tile keys", () => {
    expect(characterCacheKey("street", "down", 2)).toBe("char:street:down:2");
    expect(tileCacheKey("grass", 1)).toBe("tile:grass:v1");
  });
});

describe("bakeTexture", () => {
  it("returns null without a renderer", () => {
    expect(bakeTexture(null, {}, "k")).toBeNull();
  });

  it("uses renderer.generateTexture and caches", () => {
    const fakeTex = { id: "tex" };
    const renderer = {
      generateTexture: () => fakeTex,
    };
    const a = bakeTexture(renderer, { label: "g" }, "bake:1");
    const b = bakeTexture(renderer, { label: "g2" }, "bake:1");
    expect(a).toBe(fakeTex);
    expect(b).toBe(fakeTex);
    expect(cacheSize()).toBe(1);
  });
});
