"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
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
                role: client_1.UserRole.SUPER_ADMIN,
            },
        });
        console.log('  Created SUPER_ADMIN user: admin@flowpass.com / Admin123!');
    }
    else {
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
                role: client_1.UserRole.MERCHANT_OWNER,
            },
        });
        const merchant = await prisma.merchant.create({
            data: {
                name: 'Demo Cafe',
                description: 'A cozy coffee shop',
                ownerId: owner.id,
            },
        });
        const location = await prisma.merchantLocation.create({
            data: {
                merchantId: merchant.id,
                name: 'Downtown',
                address: '123 Main St',
            },
        });
        await prisma.loyaltyProgram.create({
            data: {
                merchantId: merchant.id,
                name: 'Demo Rewards',
                pointsPerVisit: 10,
                pointsRequired: 100,
            },
        });
        await prisma.qRCode.create({
            data: {
                locationId: location.id,
                code: `FLOW-${merchant.id.slice(0, 8).toUpperCase()}`,
                isActive: true,
            },
        });
        console.log('  Created MERCHANT_OWNER user: owner@flowpass.com / Owner123!');
        console.log('  Created demo merchant with location and loyalty program');
    }
    else {
        console.log('  MERCHANT_OWNER user already exists');
    }
    const customerEmail = 'customer@flowpass.com';
    const existingCustomer = await prisma.user.findUnique({ where: { email: customerEmail } });
    if (!existingCustomer) {
        const passwordHash = await bcrypt.hash('Customer123!', 10);
        const user = await prisma.user.create({
            data: {
                email: customerEmail,
                name: 'Test Customer',
                passwordHash,
                role: client_1.UserRole.CUSTOMER,
            },
        });
        await prisma.customerProfile.create({
            data: {
                userId: user.id,
                points: 50,
            },
        });
        console.log('  Created CUSTOMER user: customer@flowpass.com / Customer123!');
    }
    else {
        console.log('  CUSTOMER user already exists');
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
                role: client_1.UserRole.MERCHANT_STAFF,
            },
        });
        console.log('  Created MERCHANT_STAFF user: staff@flowpass.com / Staff123!');
    }
    else {
        console.log('  MERCHANT_STAFF user already exists');
    }
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
//# sourceMappingURL=seed.js.map