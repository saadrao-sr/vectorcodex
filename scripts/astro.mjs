import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const MIN = [22, 23, 4];
const current = process.versions.node.split('.').map(Number);
const isSupported =
  current[0] > MIN[0] ||
  (current[0] === MIN[0] && (current[1] > MIN[1] || (current[1] === MIN[1] && current[2] >= MIN[2])));

const scriptPath = fileURLToPath(import.meta.url);
const args = process.argv.slice(2);
const portableNode = path.join(
  process.env.LOCALAPPDATA || '',
  'vectorcodex-node',
  'node-v22.23.4-win-x64',
  'node.exe',
);

function run(nodeBin) {
  const astroEntry = path.join(process.cwd(), 'node_modules', 'astro', 'bin', 'astro.mjs');
  const child = spawn(nodeBin, [astroEntry, ...args], {
    stdio: 'inherit',
    env: process.env,
  });
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
}

if (!isSupported) {
  if (!existsSync(portableNode)) {
    console.error(
      `Node.js ${process.versions.node} is not supported by Astro. Need >=${MIN.join('.')}.`,
    );
    console.error(`Install Node ${MIN.join('.')} or keep the portable build at:\n  ${portableNode}`);
    process.exit(1);
  }

  // Re-enter this script under the portable Node so PATH/engines stay consistent.
  const child = spawn(portableNode, [scriptPath, ...args], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: `${path.dirname(portableNode)}${path.delimiter}${process.env.PATH || ''}`,
    },
  });
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
} else {
  run(process.execPath);
}
