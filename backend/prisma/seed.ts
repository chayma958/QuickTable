import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

async function hash(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function generateQrCodeUrl(slug: string, number: number) {
  return QRCode.toDataURL(`${FRONTEND_URL}/r/${slug}/table/${number}`, { width: 400, margin: 1 });
}

async function main() {
  console.log('Seeding subscription plans...');
  const [starter, pro] = await Promise.all([
    prisma.subscriptionPlan.upsert({
      where: { name: 'Starter' },
      update: {},
      create: {
        name: 'Starter',
        priceMonthly: 0,
        maxTables: 10,
        maxEmployees: 5,
        maxMenuItems: 50,
        features: { analytics: false, coupons: true },
      },
    }),
    prisma.subscriptionPlan.upsert({
      where: { name: 'Pro' },
      update: {},
      create: {
        name: 'Pro',
        priceMonthly: 49,
        maxTables: 50,
        maxEmployees: 25,
        maxMenuItems: 500,
        features: { analytics: true, coupons: true },
      },
    }),
  ]);

  console.log('Seeding platform admin...');
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      passwordHash: await hash('demo123'),
      name: 'Platform Admin',
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('Seeding Bella Italia (primary demo restaurant)...');
  const bellaItalia = await prisma.restaurant.upsert({
    where: { slug: 'bella-italia' },
    update: {},
    create: {
      slug: 'bella-italia',
      name: 'Bella Italia',
      description:
        'A family-run trattoria serving wood-fired pizza and Italian classics since 1998. Fresh dough, San Marzano tomatoes, and recipes passed down three generations.',
      logoUrl: '/images/logo.png',
      coverImageUrl: '/images/cover.png',
      galleryImages: [
        '/images/gallery/interior.png',
        '/images/gallery/kitchen.png',
        '/images/gallery/oven.png',
        '/images/gallery/table.png',
        '/images/gallery/terrace.png',
      ],
      currency: 'USD',
      taxRate: 8.5,
      subscriptionPlanId: pro.id,
      hasParking: true,
      hasWifi: true,
      isWheelchairAccessible: true,
      isPetFriendly: true,
      acceptsCardPayment: true,
      openingHours: Object.fromEntries(
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((d) => [
          d,
          { open: '11:00', close: '22:00', closed: false },
        ]),
      ),
    },
  });

  await prisma.user.upsert({
    where: { email: 'owner@demo.com' },
    update: {},
    create: {
      email: 'owner@demo.com',
      passwordHash: await hash('demo123'),
      name: 'Mario Rossi',
      role: Role.OWNER,
      restaurantId: bellaItalia.id,
    },
  });

  const staffSeeds: Array<[string, string, Role, string]> = [
    ['kitchen@demo.com', 'demo123', Role.KITCHEN, 'Kevin Kitchen'],
    ['waiter@demo.com', 'demo123', Role.WAITER, 'Wendy Waiter'],
  ];
  for (const [email, password, role, name] of staffSeeds) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash: await hash(password), name, role, restaurantId: bellaItalia.id },
    });
  }

  const categoryDefs = [
    { name: 'Pizza', sortOrder: 0 },
    { name: 'Burgers', sortOrder: 1 },
    { name: 'Desserts', sortOrder: 2 },
    { name: 'Drinks', sortOrder: 3 },
  ];
  const categories: Record<string, string> = {};
  for (const def of categoryDefs) {
    const existing = await prisma.category.findFirst({
      where: { restaurantId: bellaItalia.id, name: def.name },
    });
    const category =
      existing ??
      (await prisma.category.create({
        data: { restaurantId: bellaItalia.id, name: def.name, sortOrder: def.sortOrder },
      }));
    categories[def.name] = category.id;
  }

  const menuItemDefs = [
    {
      category: 'Pizza',
      name: 'Margherita',
      description: 'San Marzano tomato, fresh mozzarella, basil.',
      price: 12.5,
      preparationTimeMinutes: 15,
      isVegetarian: true,
    },
    {
      category: 'Pizza',
      name: 'Pepperoni',
      description: 'Double pepperoni, mozzarella, oregano.',
      price: 14.0,
      preparationTimeMinutes: 15,
    },
    {
      category: 'Pizza',
      name: 'Diavola',
      description: 'Spicy salami, chili oil, mozzarella.',
      price: 15.5,
      preparationTimeMinutes: 15,
      isSpicy: true,
    },
    {
      category: 'Burgers',
      name: 'Classic Cheeseburger',
      description: 'Beef patty, cheddar, lettuce, house sauce.',
      price: 11.0,
      preparationTimeMinutes: 12,
    },
    {
      category: 'Burgers',
      name: 'Veggie Burger',
      description: 'Black bean patty, avocado, sprouts.',
      price: 10.5,
      preparationTimeMinutes: 12,
      isVegetarian: true,
      isVegan: true,
    },
    {
      category: 'Desserts',
      name: 'Tiramisu',
      description: 'Espresso-soaked ladyfingers, mascarpone cream.',
      price: 6.5,
      preparationTimeMinutes: 5,
      isVegetarian: true,
    },
    {
      category: 'Desserts',
      name: 'Gluten-Free Brownie',
      description: 'Rich chocolate brownie, no gluten.',
      price: 5.5,
      preparationTimeMinutes: 5,
      isVegetarian: true,
      isGlutenFree: true,
    },
    {
      category: 'Drinks',
      name: 'Coca-Cola',
      description: 'Classic 330ml can.',
      price: 2.5,
      preparationTimeMinutes: 1,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
    },
    {
      category: 'Drinks',
      name: 'Sparkling Water',
      description: '500ml bottle.',
      price: 2.0,
      preparationTimeMinutes: 1,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
    },
  ];

  console.log('Seeding menu items...');

  const menuItemImages: Record<string, string> = {
    Margherita: '/images/menu/margherita.png',
    Pepperoni: '/images/menu/pepperoni.png',
    Diavola: '/images/menu/diavola.png',
    'Classic Cheeseburger': '/images/menu/cheeseburger.png',
    'Veggie Burger': '/images/menu/veggie-burger.png',
    Tiramisu: '/images/menu/tiramisu.png',
    'Gluten-Free Brownie': '/images/menu/brownie.png',
    'Coca-Cola': '/images/menu/cola.png',
    'Sparkling Water': '/images/menu/sparkling-water.png',
  };
  for (const def of menuItemDefs) {
    const existing = await prisma.menuItem.findFirst({
      where: { restaurantId: bellaItalia.id, name: def.name },
    });
    if (existing) continue;
    await prisma.menuItem.create({
      data: {
        restaurantId: bellaItalia.id,
        categoryId: categories[def.category],
        name: def.name,
        description: def.description,
        imageUrl: menuItemImages[def.name],
        price: def.price,
        preparationTimeMinutes: def.preparationTimeMinutes,
        isVegetarian: def.isVegetarian ?? false,
        isVegan: def.isVegan ?? false,
        isGlutenFree: def.isGlutenFree ?? false,
        isSpicy: def.isSpicy ?? false,
      },
    });
  }

  console.log('Seeding tables...');
  for (let number = 1; number <= 8; number++) {
    const existing = await prisma.table.findUnique({
      where: { restaurantId_number: { restaurantId: bellaItalia.id, number } },
    });
    if (existing) continue;
    await prisma.table.create({
      data: {
        restaurantId: bellaItalia.id,
        number,
        qrCodeUrl: await generateQrCodeUrl(bellaItalia.slug, number),
      },
    });
  }

  console.log('Seeding coupons...');
  const couponDefs = [
    { code: 'WELCOME10', type: 'PERCENTAGE' as const, value: 10, minOrderAmount: 15 },
    { code: 'PIZZA20', type: 'PERCENTAGE' as const, value: 20, minOrderAmount: 25 },
  ];
  for (const def of couponDefs) {
    const existing = await prisma.coupon.findUnique({
      where: { restaurantId_code: { restaurantId: bellaItalia.id, code: def.code } },
    });
    if (existing) continue;
    await prisma.coupon.create({ data: { ...def, restaurantId: bellaItalia.id } });
  }

  console.log('Seeding Burger Barn (second tenant, for the Platform Admin multi-tenant demo)...');
  const burgerBarn = await prisma.restaurant.upsert({
    where: { slug: 'burger-barn' },
    update: {},
    create: {
      slug: 'burger-barn',
      name: 'Burger Barn',
      description: 'Smash burgers and hand-cut fries.',
      currency: 'USD',
      taxRate: 7,
      subscriptionPlanId: starter.id,
    },
  });
  await prisma.user.upsert({
    where: { email: 'owner@burgerbarn.test' },
    update: {},
    create: {
      email: 'owner@burgerbarn.test',
      passwordHash: await hash('demo123'),
      name: 'Beth Barnes',
      role: Role.OWNER,
      restaurantId: burgerBarn.id,
    },
  });
  const bbCategory =
    (await prisma.category.findFirst({ where: { restaurantId: burgerBarn.id, name: 'Mains' } })) ??
    (await prisma.category.create({ data: { restaurantId: burgerBarn.id, name: 'Mains' } }));
  const bbItemExists = await prisma.menuItem.findFirst({
    where: { restaurantId: burgerBarn.id, name: 'Smash Burger' },
  });
  if (!bbItemExists) {
    await prisma.menuItem.create({
      data: {
        restaurantId: burgerBarn.id,
        categoryId: bbCategory.id,
        name: 'Smash Burger',
        description: 'Double smashed patty, American cheese, pickles.',
        price: 9.5,
        preparationTimeMinutes: 10,
      },
    });
  }
  await prisma.table.upsert({
    where: { restaurantId_number: { restaurantId: burgerBarn.id, number: 1 } },
    update: {},
    create: {
      restaurantId: burgerBarn.id,
      number: 1,
      qrCodeUrl: await generateQrCodeUrl(burgerBarn.slug, 1),
    },
  });

  console.log('\nSeed complete.');
  console.log('  Platform admin: admin@demo.com / demo123');
  console.log('  Bella Italia owner: owner@demo.com / demo123');
  console.log('  Bella Italia kitchen: kitchen@demo.com / demo123');
  console.log('  Bella Italia waiter: waiter@demo.com / demo123');
  console.log('  Burger Barn owner: owner@burgerbarn.test / demo123');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
