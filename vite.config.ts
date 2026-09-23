// @lovable.dev/vite-tanstack-config already includes:
// tanstackStart, viteReact, tailwindcss, tsConfigPaths,
// nitro, React/TanStack dedupe, etc.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = !!process.env.VERCEL;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  // Lovable uses Cloudflare by default.
  // Vercel must explicitly use the Vercel Nitro preset.
  nitro: isVercel
    ? {
        preset: "vercel",
      }
    : true,
});