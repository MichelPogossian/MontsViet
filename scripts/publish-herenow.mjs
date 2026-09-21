#!/usr/bin/env node
// Publishes a folder to here.now (https://here.now/docs) with no dependencies.
//
//   node scripts/publish-herenow.mjs <dir> [--slug <slug>] [--claim-token <token>]
//                                         [--name <displayName>] [--client <harness>]
//
// With HERENOW_API_KEY (or ~/.herenow/credentials) the Site is permanent and
// saved to the account. Without it the Site is anonymous and expires after
// 24 hours; keep the claimUrl printed at the end to claim it.
//
// Flow: POST /api/v1/publish (or PUT /api/v1/publish/:slug to update) with the
// file manifest, PUT every file to its presigned URL, then POST the finalize URL.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const API = process.env.HERENOW_BASE_URL ?? "https://here.now";

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--"));
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
if (!dir) {
  console.error("usage: publish-herenow.mjs <dir> [--slug s] [--claim-token t] [--name n] [--client c]");
  process.exit(1);
}

const slug = opt("--slug");
const client = opt("--client") ?? "claude-code/montsviet-publish";
const displayName = opt("--name");
const stateFile = path.join(process.cwd(), ".herenow", "state.json");
const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")) : { publishes: {} };
const claimToken = opt("--claim-token") ?? (slug ? state.publishes?.[slug]?.claimToken : undefined);

function apiKey() {
  if (process.env.HERENOW_API_KEY) return process.env.HERENOW_API_KEY.trim();
  const f = path.join(os.homedir(), ".herenow", "credentials");
  if (fs.existsSync(f)) return fs.readFileSync(f, "utf8").trim();
  return null;
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

function walk(base, rel = "") {
  const out = [];
  for (const entry of fs.readdirSync(path.join(base, rel), { withFileTypes: true })) {
    const p = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(base, p));
    else if (entry.isFile()) out.push(p);
  }
  return out;
}

const files = walk(dir).map((p) => ({
  path: p,
  size: fs.statSync(path.join(dir, p)).size,
  contentType: TYPES[path.extname(p).toLowerCase()] ?? "application/octet-stream",
}));

const headers = { "content-type": "application/json", "X-HereNow-Client": client };
const key = apiKey();
if (key) headers.Authorization = `Bearer ${key}`;

async function call(method, url, body) {
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status}: ${text.slice(0, 600)}`);
  return json;
}

const body = { files, ...(displayName ? { displayName } : {}) };
if (slug && claimToken && !key) body.claimToken = claimToken;

console.error(`> ${slug ? "updating" : "creating"} site with ${files.length} files (${key ? "authenticated" : "anonymous"})`);
const created = slug
  ? await call("PUT", `${API}/api/v1/publish/${slug}`, body)
  : await call("POST", `${API}/api/v1/publish`, body);

const uploads = created.upload?.uploads ?? [];
console.error(`> uploading ${uploads.length} files (${created.upload?.skipped?.length ?? 0} unchanged)`);
let done = 0;
for (const target of uploads) {
  const filePath = path.join(dir, target.path);
  const bytes = fs.readFileSync(filePath);
  const type = files.find((f) => f.path === target.path)?.contentType ?? "application/octet-stream";
  const res = await fetch(target.url, {
    method: target.method ?? "PUT",
    headers: { "content-type": type, ...(target.headers ?? {}) },
    body: bytes,
  });
  if (!res.ok) throw new Error(`upload ${target.path} -> ${res.status}: ${(await res.text()).slice(0, 300)}`);
  done += 1;
  if (done % 10 === 0 || done === uploads.length) console.error(`  ${done}/${uploads.length}`);
}

console.error("> finalizing");
const finalized = await call("POST", created.upload.finalizeUrl, { versionId: created.upload.versionId });

const entry = {
  siteUrl: finalized.siteUrl ?? created.siteUrl,
  primaryUrl: finalized.primaryUrl ?? null,
  claimToken: created.claimToken ?? claimToken ?? null,
  claimUrl: created.claimUrl ?? state.publishes?.[created.slug]?.claimUrl ?? null,
  expiresAt: created.expiresAt ?? null,
  versionId: finalized.currentVersionId ?? created.upload.versionId,
  anonymous: !key,
};
state.publishes = { ...(state.publishes ?? {}), [created.slug]: entry };
fs.mkdirSync(path.dirname(stateFile), { recursive: true });
fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));

console.log(JSON.stringify({ slug: created.slug, ...entry, unchanged: finalized.unchanged ?? false }, null, 2));
