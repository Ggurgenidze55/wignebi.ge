#!/usr/bin/env node
/**
 * Stable dev server: single port, clean .next, no stale webpack chunks.
 * Run: npm run dev
 */
import { spawn } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.PORT || '3000';

function killPort(port) {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore', cwd: root });
  } catch {
    /* nothing listening */
  }
}

killPort(PORT);
killPort('3010');

const nextDir = join(root, '.next');
if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log('[tsignebi] cleared .next cache');
}

console.log(`[tsignebi] starting http://localhost:${PORT}\n`);

const child = spawn('npx', ['next', 'dev', '-p', PORT], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, FORCE_COLOR: '1' },
});

child.on('exit', (code) => process.exit(code ?? 0));

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
