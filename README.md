# bun-pglite

Demo how to build a single executable with Bun and Deno. The source script uses PGlite and a workaround is needed for now for Bun to properly bundling the assets.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run bun-todo.ts
```

Build single executable with Bun

```bash
bun build bun-todo.ts --compile --outfile bun-todo
```

Build single executable with Deno

```bash
deno compile --no-check --allow-read --allow-write deno-todo.ts
```