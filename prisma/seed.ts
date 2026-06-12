import { PrismaClient, UserRole, DevicePlatform, LoyaltyProgramType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const DEFAULT_LEVELS = [
  {
    name: 'BRONCE',
    minPoints: 0,
    minVisits: 0,
    color: '#CD7F32',
    sortOrder: 0,
    isSystem: true,
    skinType: 'SYSTEM',
    skinConfig: {
      backgroundColor: '#CD7F32',
      textColor: '#FFFFFF',
      borderColor: '#8B5E3C',
      badgeUrl: null,
      backgroundImageUrl: null,
    },
    benefits: {
      pointsPerVisit: 1,
      discountPercent: 0,
      description: 'Nivel inicial. Bienvenido!',
    },
  },
  {
    name: 'PLATA',
    minPoints: 50,
    minVisits: 5,
    color: '#C0C0C0',
    sortOrder: 1,
    isSystem: true,
    skinType: 'SYSTEM',
    skinConfig: {
      backgroundColor: '#C0C0C0',
      textColor: '#1A1A1A',
      borderColor: '#808080',
      badgeUrl: null,
      backgroundImageUrl: null,
    },
    benefits: {
      pointsPerVisit: 2,
      discountPercent: 5,
      description: 'Cliente frecuente. 5% de descuento en cada visita.',
    },
  },
  {
    name: 'ORO',
    minPoints: 150,
    minVisits: 15,
    color: '#FFD700',
    sortOrder: 2,
    isSystem: true,
    skinType: 'SYSTEM',
    skinConfig: {
      backgroundColor: '#FFD700',
      textColor: '#1A1A1A',
      borderColor: '#B8860B',
      badgeUrl: null,
      backgroundImageUrl: null,
    },
    benefits: {
      pointsPerVisit: 3,
      discountPercent: 10,
      description: 'Cliente premium. 10% de descuento + promos exclusivas.',
    },
  },
  {
    name: 'PLATINO',
    minPoints: 300,
    minVisits: 30,
    color: '#1A1A2E',
    sortOrder: 3,
    isSystem: true,
    skinType: 'SYSTEM',
    skinConfig: {
      backgroundColor: '#1A1A2E',
      textColor: '#FFD700',
      borderColor: '#FFD700',
      badgeUrl: null,
      backgroundImageUrl: null,
    },
    benefits: {
      pointsPerVisit: 5,
      discountPercent: 20,
      description: 'Cliente VIP. 20% de descuento + regalo de cumpleaños.',
    },
  },
];

async function seedDefaultLevels(merchantId: string) {
  for (const level of DEFAULT_LEVELS) {
    const existing = await prisma.loyaltyLevel.findUnique({
      where: { merchantId_name: { merchantId, name: level.name } },
    });
    if (!existing) {
      await prisma.loyaltyLevel.create({
        data: { ...level, merchantId },
      });
    }
  }
  console.log(`  Seeded default loyalty levels for merchant ${merchantId}`);
}

async function main() {
  console.log('Seeding database...');

  const adminEmail = 'admin@flowpass.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        passwordHash,
        role: UserRole.SUPER_ADMIN,
      },
    });
    console.log('  Created SUPER_ADMIN user: admin@flowpass.com / Admin123!');
  } else {
    console.log('  SUPER_ADMIN user already exists');
  }

  const ownerEmail = 'owner@flowpass.com';
  const existingOwner = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (!existingOwner) {
    const passwordHash = await bcrypt.hash('Owner123!', 10);
    const owner = await prisma.user.create({
      data: {
        email: ownerEmail,
        name: 'Merchant Owner',
        passwordHash,
        role: UserRole.MERCHANT_OWNER,
      },
    });

    const merchant = await prisma.merchant.create({
      data: {
        name: 'Demo Cafe',
        slug: 'demo-cafe',
        description: 'A cozy coffee shop',
        ownerId: owner.id,
        levelsEnabled: true,
        category: 'CAFE' as any,
      },
    });

    const location = await prisma.merchantLocation.create({
      data: {
        merchantId: merchant.id,
        name: 'Downtown',
        address: '123 Main St',
        city: 'Buenos Aires',
        country: 'Argentina',
        latitude: -34.6037,
        longitude: -58.3816,
      },
    });

    await prisma.loyaltyProgram.create({
      data: {
        merchantId: merchant.id,
        name: 'Demo Rewards',
        type: LoyaltyProgramType.POINTS,
        pointsPerVisit: 10,
        visitsRequiredForReward: 10,
      },
    });

    await prisma.qRCode.create({
      data: {
        merchantId: merchant.id,
        locationId: location.id,
        code: `FLOW-${merchant.id.slice(0, 8).toUpperCase()}`,
        isActive: true,
      },
    });

    await seedDefaultLevels(merchant.id);

    console.log('  Created MERCHANT_OWNER user: owner@flowpass.com / Owner123!');
    console.log('  Created demo merchant with location and loyalty program');

    const merchant2 = await prisma.merchant.create({
      data: {
        name: 'Demo Pizza',
        slug: 'demo-pizza',
        description: 'The best pizza in town',
        ownerId: owner.id,
        levelsEnabled: true,
        category: 'RESTAURANT' as any,
      },
    });

    const location2 = await prisma.merchantLocation.create({
      data: {
        merchantId: merchant2.id,
        name: 'Palermo',
        address: '456 Av. Santa Fe',
        city: 'Buenos Aires',
        country: 'Argentina',
        latitude: -34.585,
        longitude: -58.425,
      },
    });

    await prisma.loyaltyProgram.create({
      data: {
        merchantId: merchant2.id,
        name: 'Pizza Rewards',
        type: LoyaltyProgramType.POINTS,
        pointsPerVisit: 15,
        visitsRequiredForReward: 8,
      },
    });

    await prisma.qRCode.create({
      data: {
        merchantId: merchant2.id,
        locationId: location2.id,
        code: `FLOW-${merchant2.id.slice(0, 8).toUpperCase()}`,
        isActive: true,
      },
    });

    await seedDefaultLevels(merchant2.id);

    await prisma.promotion.create({
      data: {
        merchantId: merchant2.id,
        locationId: location2.id,
        title: '2x1 Pizza',
        description: 'Buy one pizza, get the second free',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        discountType: 'PERCENTAGE' as any,
        discountValue: 50,
        maxClaims: 100,
      },
    });
  } else {
    console.log('  MERCHANT_OWNER user already exists');
  }

  // ─── Update categories for existing merchants ──────────────────
  await prisma.merchant.updateMany({
    where: { slug: 'demo-cafe', category: 'OTHER' },
    data: { category: 'CAFE' as any },
  });
  await prisma.merchant.updateMany({
    where: { slug: 'demo-pizza', category: 'OTHER' },
    data: { category: 'RESTAURANT' as any },
  });

  const customerEmail = 'customer@flowpass.com';
  const existingCustomer = await prisma.user.findUnique({ where: { email: customerEmail } });
  if (!existingCustomer) {
    const passwordHash = await bcrypt.hash('Customer123!', 10);
    const customerUser = await prisma.user.create({
      data: {
        email: customerEmail,
        name: 'Test Customer',
        passwordHash,
        role: UserRole.CUSTOMER,
      },
    });
    await prisma.customerProfile.create({
      data: {
        userId: customerUser.id,
        displayName: 'Test Customer',
      },
    });
    console.log('  Created CUSTOMER user: customer@flowpass.com / Customer123!');
  } else {
    console.log('  CUSTOMER user already exists');
    const existingProfile = await prisma.customerProfile.findUnique({
      where: { userId: existingCustomer.id },
    });
    if (!existingProfile) {
      await prisma.customerProfile.create({
        data: { userId: existingCustomer.id, displayName: existingCustomer.name || existingCustomer.email },
      });
      console.log('  Created missing CustomerProfile for existing customer');
    }
  }

  const staffEmail = 'staff@flowpass.com';
  const existingStaff = await prisma.user.findUnique({ where: { email: staffEmail } });
  if (!existingStaff) {
    const passwordHash = await bcrypt.hash('Staff123!', 10);
    await prisma.user.create({
      data: {
        email: staffEmail,
        name: 'Staff User',
        passwordHash,
        role: UserRole.MERCHANT_STAFF,
      },
    });
    console.log('  Created MERCHANT_STAFF user: staff@flowpass.com / Staff123!');
  } else {
    console.log('  MERCHANT_STAFF user already exists');
  }

  // ─── Seed tables & reservations for Demo Pizza ────────────────
  const demoPizza = await prisma.merchant.findUnique({ where: { slug: 'demo-pizza' } });
  const demoCustomer = await prisma.user.findUnique({ where: { email: customerEmail } });
  const demoCustomerProfile = demoCustomer
    ? await prisma.customerProfile.findUnique({ where: { userId: demoCustomer.id } })
    : null;

  if (demoPizza) {
    const existingTables = await prisma.table.findMany({ where: { merchantId: demoPizza.id } });
    if (existingTables.length === 0) {
      const table1 = await prisma.table.create({
        data: { merchantId: demoPizza.id, label: 'Mesa 1', capacity: 2 },
      });
      const table2 = await prisma.table.create({
        data: { merchantId: demoPizza.id, label: 'Mesa 2', capacity: 4 },
      });
      const table3 = await prisma.table.create({
        data: { merchantId: demoPizza.id, label: 'Mesa 3', capacity: 6 },
      });
      const table4 = await prisma.table.create({
        data: { merchantId: demoPizza.id, label: 'VIP', capacity: 8 },
      });
      console.log('  Created 4 tables for Demo Pizza');

      if (demoCustomerProfile) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        await prisma.reservation.create({
          data: {
            merchantId: demoPizza.id,
            customerId: demoCustomerProfile.id,
            tableId: table1.id,
            date: tomorrow,
            timeSlot: '20:00',
            guests: 2,
            status: 'CONFIRMED' as any,
            customerName: 'Test Customer',
          },
        });
        await prisma.reservation.create({
          data: {
            merchantId: demoPizza.id,
            customerId: demoCustomerProfile.id,
            tableId: table3.id,
            date: tomorrow,
            timeSlot: '21:30',
            guests: 4,
            status: 'PENDING' as any,
            customerName: 'Test Customer',
          },
        });
        console.log('  Created 2 sample reservations for Demo Pizza');
      }
    } else {
      console.log('  Demo Pizza tables already exist');
    }
  }

  // ─── Seed tables for Demo Cafe ────────────────────────────────
  const demoCafe = await prisma.merchant.findUnique({ where: { slug: 'demo-cafe' } });
  if (demoCafe) {
    const existingCafeTables = await prisma.table.findMany({ where: { merchantId: demoCafe.id } });
    if (existingCafeTables.length === 0) {
      await prisma.table.create({ data: { merchantId: demoCafe.id, label: 'Mesa 1', capacity: 2 } });
      await prisma.table.create({ data: { merchantId: demoCafe.id, label: 'Mesa 2', capacity: 2 } });
      await prisma.table.create({ data: { merchantId: demoCafe.id, label: 'Mesa 3', capacity: 4 } });
      await prisma.table.create({ data: { merchantId: demoCafe.id, label: 'Barra', capacity: 1 } });
      console.log('  Created 4 tables for Demo Cafe');
    }
  }

  // ─── Seed subscription plans ──────────────────────────────────
  const plans = [
    {
      name: 'Mensual',
      description: 'Acceso completo facturado mes a mes.',
      interval: 'month',
      intervalCount: 1,
      price: 5000,
      sortOrder: 0,
    },
    {
      name: 'Semestral',
      description: 'Ahorrá contratando 6 meses.',
      interval: '6months',
      intervalCount: 6,
      price: 25000,
      sortOrder: 1,
    },
    {
      name: 'Anual',
      description: 'El mejor precio: 12 meses.',
      interval: 'year',
      intervalCount: 12,
      price: 45000,
      sortOrder: 2,
    },
  ];
  for (const plan of plans) {
    const existing = await prisma.subscriptionPlan.findFirst({ where: { name: plan.name } });
    if (!existing) await prisma.subscriptionPlan.create({ data: plan });
  }
  console.log('  Seeded subscription plans');

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
