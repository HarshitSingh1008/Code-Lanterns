/**
 * Headless smoke checks. Bundles the TypeScript sources with esbuild (stubbing
 * the two native modules) and runs them under plain Node, so `npm run smoke`
 * verifies routing and Markdown rendering without a device or browser.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const here = path.join(root, 'scripts', 'smoke');

const SUITES = ['routing', 'markdown'];

for (const suite of SUITES) {
  const outfile = path.join(here, `${suite}.mjs`);
  await build({
    entryPoints: [path.join(here, `${suite}.ts`)],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
    logLevel: 'warning',
    alias: {
      '@': path.join(root, 'src'),
      'react-native': path.join(here, 'shims', 'react-native.ts'),
      '@react-native-async-storage/async-storage': path.join(here, 'shims', 'async-storage.ts'),
    },
  });

  const run = spawnSync(process.execPath, [outfile], { stdio: 'inherit' });
  if (run.status !== 0) {
    console.error(`\nsmoke: ${suite} failed`);
    process.exit(run.status ?? 1);
  }
}

console.log('\nsmoke: all suites passed');
