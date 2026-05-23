import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const hashedUserPassword = await bcrypt.hash('User123!', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create attendant user
  const attendant = await prisma.user.upsert({
    where: { email: 'attendant@example.com' },
    update: {},
    create: {
      email: 'attendant@example.com',
      password: hashedUserPassword,
      firstName: 'John',
      lastName: 'Attendant',
      role: UserRole.ATTENDANT,
    },
  });

  console.log('✅ Created attendant user:', attendant.email);

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedUserPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      role: UserRole.USER,
    },
  });

  console.log('✅ Created regular user:', user.email);

  // Create demo items for pagination testing
  const items = [
    {
      name: 'Laptop',
      description: 'High-performance laptop for development',
      quantity: 15,
      price: 1200.0,
      category: 'Electronics',
      createdById: admin.id,
    },
    {
      name: 'Office Chair',
      description: 'Ergonomic office chair',
      quantity: 30,
      price: 250.0,
      category: 'Furniture',
      createdById: admin.id,
    },
    {
      name: 'Desk',
      description: 'Standing desk with adjustable height',
      quantity: 20,
      price: 450.0,
      category: 'Furniture',
      createdById: admin.id,
    },
    {
      name: 'Monitor',
      description: '27-inch 4K monitor',
      quantity: 25,
      price: 350.0,
      category: 'Electronics',
      createdById: admin.id,
    },
    {
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      quantity: 40,
      price: 120.0,
      category: 'Electronics',
      createdById: admin.id,
    },
    {
      name: 'Mouse',
      description: 'Wireless ergonomic mouse',
      quantity: 50,
      price: 45.0,
      category: 'Electronics',
      createdById: admin.id,
    },
    {
      name: 'Headphones',
      description: 'Noise-cancelling headphones',
      quantity: 35,
      price: 200.0,
      category: 'Electronics',
      createdById: admin.id,
    },
    {
      name: 'Webcam',
      description: '1080p HD webcam',
      quantity: 20,
      price: 80.0,
      category: 'Electronics',
      createdById: admin.id,
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness',
      quantity: 45,
      price: 35.0,
      category: 'Furniture',
      createdById: admin.id,
    },
    {
      name: 'Whiteboard',
      description: 'Large magnetic whiteboard',
      quantity: 10,
      price: 150.0,
      category: 'Office Supplies',
      createdById: admin.id,
    },
    {
      name: 'Projector',
      description: 'Full HD projector for presentations',
      quantity: 5,
      price: 600.0,
      category: 'Electronics',
      createdById: admin.id,
    },
    {
      name: 'Filing Cabinet',
      description: '4-drawer filing cabinet',
      quantity: 12,
      price: 180.0,
      category: 'Furniture',
      createdById: admin.id,
    },
  ];

  const createdItems = [];
  for (const item of items) {
    const created = await prisma.item.create({
      data: item,
    });
    createdItems.push(created);
  }

  console.log(`✅ Created ${items.length} demo items`);

  // Create demo tags
  const tagNames = ['new', 'sale', 'premium', 'bestseller', 'limited'];
  const createdTags = [];
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdTags.push(tag);
  }

  console.log(`✅ Created ${tagNames.length} demo tags`);

  // Assign some tags to items
  const tagAssignments = [
    { itemIndex: 0, tagIndices: [0, 2] },       // Laptop: new, premium
    { itemIndex: 1, tagIndices: [1] },           // Office Chair: sale
    { itemIndex: 3, tagIndices: [0, 3] },        // Monitor: new, bestseller
    { itemIndex: 6, tagIndices: [2, 3] },        // Headphones: premium, bestseller
    { itemIndex: 10, tagIndices: [4] },          // Projector: limited
  ];

  for (const assignment of tagAssignments) {
    for (const tagIndex of assignment.tagIndices) {
      await prisma.itemTag.upsert({
        where: {
          itemId_tagId: {
            itemId: createdItems[assignment.itemIndex].id,
            tagId: createdTags[tagIndex].id,
          },
        },
        update: {},
        create: {
          itemId: createdItems[assignment.itemIndex].id,
          tagId: createdTags[tagIndex].id,
        },
      });
    }
  }

  console.log('✅ Assigned tags to items');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Demo Credentials:');
  console.log('   Admin: admin@example.com / Admin123!');
  console.log('   Attendant: attendant@example.com / User123!');
  console.log('   User: user@example.com / User123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
