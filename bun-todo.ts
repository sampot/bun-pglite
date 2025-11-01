import { PGlite } from '@electric-sql/pglite'
import type { PGliteOptions } from "@electric-sql/pglite";
// Import using Bun's file loader - these get embedded in the compiled binary
import wasmPath from "./pglite-assets/pglite.wasm" with { type: "file" };
import dataPath from "./pglite-assets/pglite.data" with { type: "file" };

export async function createPGlite(
  dataDir: string,
  options?: PGliteOptions
): Promise<PGlite> {
  // Read the embedded files
  const [wasmBuffer, dataBuffer] = await Promise.all([
    Bun.file(wasmPath).arrayBuffer(),
    Bun.file(dataPath).arrayBuffer(),
  ]);

  // Compile the WASM module
  const wasmModule = await WebAssembly.compile(wasmBuffer);

  // Create a Blob for the fs bundle
  const fsBundle = new Blob([dataBuffer]);

  // Create PGlite instance with pre-loaded modules
  const db = await PGlite.create(dataDir, {
    ...options,
    wasmModule,
    fsBundle,
  });

  return db;
}
const db = await createPGlite('./test.db')
await db.exec(`
  CREATE TABLE IF NOT EXISTS todo (
    id SERIAL PRIMARY KEY,
    task TEXT,
    done BOOLEAN DEFAULT false
  );
  INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
  INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
  INSERT INTO todo (task, done) VALUES ('Create a table', true);
  INSERT INTO todo (task, done) VALUES ('Insert some data', true);
  INSERT INTO todo (task) VALUES ('Update a task');
`)
const ret = await db.query(`
  SELECT * from todo WHERE id = 1;
`)

console.log(ret.rows)