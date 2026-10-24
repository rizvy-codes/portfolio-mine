import { config } from "dotenv";
import express, { type Request, type Response } from "express";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Local-only helper: runs the same files that Vercel runs as serverless functions.
config({ path: ".env.local" });

const here = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.resolve(here, "../api");

type Handler = (req: VercelRequest, res: VercelResponse) => unknown;

function findRoutes(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (name.startsWith("_")) return []; // helper folders/files are not routes
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return findRoutes(full);
    return name.endsWith(".ts") ? [full] : [];
  });
}

const app = express();
app.use(express.json({ limit: "20kb" }));

for (const file of findRoutes(apiDir)) {
  const route =
    "/api/" + path.relative(apiDir, file).replace(/\\/g, "/").replace(/\.ts$/, "");
  const mod = (await import(pathToFileURL(file).href)) as { default: Handler };

  app.all(route, (req: Request, res: Response) => {
    Promise.resolve(
      mod.default(req as unknown as VercelRequest, res as unknown as VercelResponse)
    ).catch((error) => {
      console.error(`Error in ${route}:`, error);
      if (!res.headersSent) res.status(500).json({ ok: false });
    });
  });

  console.log(`  route ready: ${route}`);
}

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => console.log(`API server running on http://localhost:${port}`));