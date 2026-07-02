import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─── Default Settings ──────────────────────────────────────
  const defaultSettings = [
    {
      key: 'scoring.urgency_weight',
      value: 0.35,
      description: 'Weight for urgency score in composite ranking',
      category: 'scoring',
    },
    {
      key: 'scoring.impact_weight',
      value: 0.30,
      description: 'Weight for impact score in composite ranking',
      category: 'scoring',
    },
    {
      key: 'scoring.feasibility_weight',
      value: 0.20,
      description: 'Weight for feasibility score in composite ranking',
      category: 'scoring',
    },
    {
      key: 'scoring.cost_benefit_weight',
      value: 0.15,
      description: 'Weight for cost-benefit score in composite ranking',
      category: 'scoring',
    },
    {
      key: 'hotspot.cluster_radius_meters',
      value: 500,
      description: 'Radius in meters for geographic clustering',
      category: 'hotspot',
    },
    {
      key: 'hotspot.min_submissions_for_hotspot',
      value: 5,
      description: 'Minimum submissions to form a hotspot',
      category: 'hotspot',
    },
    {
      key: 'notifications.whatsapp_enabled',
      value: true,
      description: 'Enable WhatsApp notifications',
      category: 'notifications',
    },
    {
      key: 'notifications.email_enabled',
      value: true,
      description: 'Enable email notifications',
      category: 'notifications',
    },
    {
      key: 'ai.stt_provider',
      value: 'bhashini',
      description: 'Speech-to-text provider (bhashini | google | whisper)',
      category: 'ai',
    },
    {
      key: 'ai.translation_provider',
      value: 'bhashini',
      description: 'Translation provider (bhashini | google)',
      category: 'ai',
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
        description: setting.description,
        category: setting.category,
      },
    });
  }
  console.log('✅ Settings seeded');

  // ─── Super Admin ───────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash('Admin@123!', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@janasetu.ai' },
    update: {},
    create: {
      email: 'admin@janasetu.ai',
      name: 'Super Admin',
      passwordHash: adminPasswordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
      isEmailVerified: true,
    },
  });
  console.log(`✅ Super Admin created: ${superAdmin.email}`);

  // ─── Demo Analyst ──────────────────────────────────────────
  const analystPasswordHash = await bcrypt.hash('Analyst@123!', 12);
  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@janasetu.ai' },
    update: {},
    create: {
      email: 'analyst@janasetu.ai',
      name: 'Demo Analyst',
      passwordHash: analystPasswordHash,
      role: Role.ANALYST,
      isActive: true,
      isEmailVerified: true,
    },
  });
  console.log(`✅ Analyst created: ${analyst.email}`);

  // ─── Demo Ward Officer ────────────────────────────────────
  const officerPasswordHash = await bcrypt.hash('Officer@123!', 12);
  const officer = await prisma.user.upsert({
    where: { email: 'officer@janasetu.ai' },
    update: {},
    create: {
      email: 'officer@janasetu.ai',
      name: 'Ward Officer Demo',
      passwordHash: officerPasswordHash,
      role: Role.WARD_OFFICER,
      wardId: 'ward-001',
      isActive: true,
      isEmailVerified: true,
    },
  });
  console.log(`✅ Ward Officer created: ${officer.email}`);

  // ─── Sample Hotspot ────────────────────────────────────────
  const hotspot = await prisma.hotspot.upsert({
    where: { id: 'hotspot-seed-001' },
    update: {},
    create: {
      id: 'hotspot-seed-001',
      category: 'INFRASTRUCTURE',
      subCategory: 'ROADS',
      severity: 'HIGH',
      wardId: 'ward-001',
      latitude: 17.385044,
      longitude: 78.486671,
      radiusMeters: 500,
      title: 'Road Damage Near Main Bazaar',
      description: 'Multiple potholes and damaged road surface reported by residents',
      submissionCount: 12,
      affectedCount: 250,
      priorityScore: 78.5,
      tags: ['roads', 'infrastructure', 'urgent'],
    },
  });
  console.log(`✅ Sample hotspot created: ${hotspot.title}`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Super Admin: admin@janasetu.ai / Admin@123!');
  console.log('   Analyst:     analyst@janasetu.ai / Analyst@123!');
  console.log('   Ward Officer: officer@janasetu.ai / Officer@123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
