import { cp } from "node:fs/promises";

// Standalone output omits these assets unless the application copies them.
await cp("public", ".next/standalone/public", { recursive: true });
await cp(".next/static", ".next/standalone/.next/static", { recursive: true });
