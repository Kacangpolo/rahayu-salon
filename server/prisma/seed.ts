import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Services
    const services = [
        { id: 'Manicure', name: 'Manicure Standard', durationMin: 60, price: 100000 },
        { id: 'Pedicure', name: 'Pedicure Spa', durationMin: 60, price: 150000 },
        { id: 'Nail Art', name: 'Nail Art Custom', durationMin: 90, price: 120000 },
    ];

    for (const service of services) {
        await prisma.service.upsert({
            where: { id: service.id },
            update: {},
            create: service,
        });
    }

    // Resources (Staff / Chairs)
    const resources = [
        { name: 'Staff Ayu' },
        { name: 'Staff Budi' },
        { name: 'Chair 1' },
    ];

    for (const res of resources) {
        const exists = await prisma.resource.findFirst({ where: { name: res.name } });
        if (!exists) {
            await prisma.resource.create({ data: { name: res.name } });
        }
    }

    // Admin User (Hashed password needed in prod)
    await prisma.user.upsert({
        where: { email: 'admin@rahayu.com' },
        update: {},
        create: {
            email: 'admin@rahayu.com',
            password: 'admin123'
        }
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
