import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

await mkdir(dist, { recursive: true });

await esbuild.build({
  entryPoints: [resolve(root, "src/index.ts")],
  bundle: true,
  minify: true,
  format: "iife",
  globalName: "CloudCordDesktop",
  target: ["chrome108"],
  outfile: resolve(dist, "cloudcord-desktop.min.js"),
  sourcemap: false,
  legalComments: "none",
  jsx: "automatic"
});
