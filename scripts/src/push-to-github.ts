import fs from "fs";
import path from "path";

const TOKEN = process.env["GITHUB_PERSONAL_ACCESS_TOKEN"];
const OWNER = "amanu477";
const REPO = "Adulis-Food-Complex";
const BRANCH = "master";
const ROOT = path.resolve(import.meta.dirname, "../..");

if (!TOKEN) throw new Error("GITHUB_PERSONAL_ACCESS_TOKEN not set");

const IGNORE = new Set([
  ".git", "node_modules", ".pnpm-store", "dist", ".cache", ".local",
  "pnpm-lock.yaml",
]);

function getAllFiles(dir: string, base = dir): { path: string; abs: string }[] {
  const results: { path: string; abs: string }[] = [];
  let entries: fs.Dirent[];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return results; }
  for (const entry of entries) {
    if (IGNORE.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    const rel = path.relative(base, abs).replace(/\\/g, "/");
    if (entry.isDirectory()) results.push(...getAllFiles(abs, base));
    else if (entry.isFile()) results.push({ path: rel, abs });
  }
  return results;
}

async function ghApi(endpoint: string, method = "GET", body?: unknown) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers: {
      Authorization: `token ${TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (method === "GET" && res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${method} ${endpoint} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function getFileSha(filePath: string): Promise<string | null> {
  try {
    const data = await ghApi(`/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`) as { sha: string } | null;
    return data?.sha ?? null;
  } catch {
    return null;
  }
}

async function putFile(filePath: string, content: Buffer) {
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const sha = await getFileSha(encodedPath);
  const payload: Record<string, unknown> = {
    message: sha ? `Update ${filePath}` : `Add ${filePath}`,
    content: content.toString("base64"),
    branch: BRANCH,
  };
  if (sha) payload["sha"] = sha;
  await ghApi(`/repos/${OWNER}/${REPO}/contents/${encodedPath}`, "PUT", payload);
}

async function run() {
  console.log("Reading workspace files...");
  const files = getAllFiles(ROOT);
  console.log(`Found ${files.length} files to upload\n`);

  let done = 0;
  let failed = 0;

  for (const file of files) {
    const content = fs.readFileSync(file.abs);
    try {
      await putFile(file.path, content);
      done++;
      process.stdout.write(`\r  [${done + failed}/${files.length}] ${file.path.slice(0, 60).padEnd(60)}`);
    } catch (e: unknown) {
      failed++;
      const msg = e instanceof Error ? e.message : String(e);
      process.stdout.write(`\n  FAILED: ${file.path}: ${msg.slice(0, 100)}\n`);
    }
  }

  console.log(`\n\nUploaded: ${done}, Failed: ${failed}`);
  console.log(`\nView your repository at:\nhttps://github.com/${OWNER}/${REPO}`);
}

run().catch((e) => { console.error(e.message); process.exit(1); });
