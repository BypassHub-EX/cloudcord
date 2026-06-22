import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

await mkdir(dist, { recursive: true });

await esbuild.build({
  entryPoints: [resolve(root, "src/index.ts")],
  bundle: true,
  format: "iife",
  globalName: "CloudCordDesktop",
  target: ["chrome108"],
  outfile: resolve(dist, "cloudcord-desktop.js"),
  sourcemap: false,
  legalComments: "none",
  jsx: "automatic"
});

const theme = await readFile(resolve(root, "src/themes/cloudcord.css"), "utf8");
const core = await readFile(resolve(root, "src/plugins/cloudcordCore/styles.css"), "utf8");
await writeFile(resolve(dist, "cloudcord-desktop.css"), `${theme}\n${core}\n`);
