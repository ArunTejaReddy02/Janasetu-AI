#!/usr/bin/env ts-node
/**
 * clean.ts — Clean generated files, dist, and uploads.
 * Usage: ts-node scripts/clean.ts [--uploads] [--dist]
 */

import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const cleanUploads = args.includes('--uploads');
const cleanDist = args.includes('--dist') || args.length === 0;

const root = path.resolve(__dirname, '..');

function removeDir(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`🗑  Removed: ${dirPath}`);
  }
}

if (cleanDist) {
  removeDir(path.join(root, 'dist'));
  removeDir(path.join(root, 'coverage'));
}

if (cleanUploads) {
  removeDir(path.join(root, 'uploads'));
  fs.mkdirSync(path.join(root, 'uploads'), { recursive: true });
  console.log('📁 Recreated uploads directory');
}

console.log('✅ Clean complete!');
