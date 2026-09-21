#!/usr/bin/env node
// Renders the site to plain static files (for here.now or any static host).
//
//   node scripts/export-static.mjs [outDir]
//
// Runs the production build in app/, then asks the built Worker to render
// "/" plus robots.txt and sitemap.xml, and copies the hashed client assets
// next to them. The result is a folder with index.html at its root.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.join(root, "app");
const outDir = path.resolve(process.argv[2] ?? path.join(root, "static-export"));

console.log("> build");
execSync("bun run build", { cwd: appDir, stdio: "inherit" });

const worker = (await import(path.join(appDir, "dist/server/server.js"))).default;

async function render(route) {
  const res = await worker.fetch(new Request(`https://export.local${route}`), {}, {});
  if (!res.ok) throw new Error(`${route} -> ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.cpSync(path.join(appDir, "dist/client"), outDir, { recursive: true });
// Template leftovers that the site never references.
fs.rmSync(path.join(outDir, "presets"), { recursive: true, force: true });

for (const [route, file] of [
  ["/", "index.html"],
  ["/robots.txt", "robots.txt"],
  ["/sitemap.xml", "sitemap.xml"],
]) {
  fs.writeFileSync(path.join(outDir, file), await render(route));
  console.log(`> rendered ${route} -> ${file}`);
}

console.log(`> static site ready in ${outDir}`);
