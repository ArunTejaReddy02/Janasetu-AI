#!/usr/bin/env ts-node
/**
 * migrate.ts — Run Prisma migrations programmatically.
 * Usage: ts-node scripts/migrate.ts [--reset] [--seed]
 */

import { execSync } from 'child_process';

const args = process.argv.slice(2);
const shouldReset = args.includes('--reset');
const shouldSeed = args.includes('--seed');

try {
  if (shouldReset) {
    console.log('🔄 Resetting database...');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
  } else {
    console.log('📦 Running Prisma migrations...');
    execSync('npx prisma migrate dev --name auto', { stdio: 'inherit' });
  }

  console.log('✅ Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  if (shouldSeed) {
    console.log('🌱 Seeding database...');
    execSync('ts-node prisma/seed.ts', { stdio: 'inherit' });
  }

  console.log('✅ Migration complete!');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}
