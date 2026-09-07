import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Gym Hub Database Seeding...');

  // Clear existing database
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.storeOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.store.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.fitnessPlanSchedule.deleteMany();
  await prisma.fitnessPlan.deleteMany();
  await prisma.gymImage.deleteMany();
  await prisma.gym.deleteMany();
  await prisma.trainerCertification.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.contactSubmission.deleteMany();

  const passwordHash = bcrypt.hashSync('password123', 10);

  // 1. Seed Users
  const alexander = await prisma.user.create({
    data: {
      name: 'Alexander Wright',
      email: 'alexander@gymhub.com',
      passwordHash,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      membershipType: 'Athlete Member',
    },
  });

  const marcusUser = await prisma.user.create({
    data: {
      name: 'Marcus Vance',
      email: 'marcus@gymhub.com',
      passwordHash,
      role: 'TRAINER',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=150&q=80',
      membershipType: 'IFBB Pro Coach',
    },
  });

  const ethanUser = await prisma.user.create({
    data: {
      name: 'Ethan Rodriguez',
      email: 'ethan@gymhub.com',
      passwordHash,
      role: 'TRAINER',
      avatar: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=150&q=80',
      membershipType: 'Certified CSCS Coach',
    },
  });

  const davidUser = await prisma.user.create({
    data: {
      name: 'David Chen',
      email: 'david@gymhub.com',
      passwordHash,
      role: 'TRAINER',
      avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=150&q=80',
      membershipType: 'State Champion Coach',
    },
  });

  // 2. Seed Trainer Profiles
  const marcusProfile = await prisma.trainerProfile.create({
    data: {
      userId: marcusUser.id,
      title: 'IFBB Pro & Elite Strength Conditioning Coach',
      bio: 'Specializing in mechanical tension hypertrophy, prep coaching, and high-density metabolic conditioning with over 10+ years of athlete transformation experience.',
      location: 'New York, NY (In-person & Virtual)',
      specialties: JSON.stringify(['Hypertrophy Science', 'Strength & Power', 'Contest Prep', 'Biomechanics']),
      experienceYears: 12,
      hourlyRate: 110.0,
      verified: true,
      whatsapp: '+15550192834',
      profileCompleteness: 100,
      rankingScore: 98.4,
    },
  });

  const ethanProfile = await prisma.trainerProfile.create({
    data: {
      userId: ethanUser.id,
      title: 'Functional Movement & Athletic Performance Specialist',
      bio: 'Former Olympic weightlifting team coach specializing in explosive mobility, rotational power, and injury mitigation for high-performance athletes.',
      location: 'Los Angeles, CA',
      specialties: JSON.stringify(['Olympic Lifting', 'Athletic Speed', 'Mobility & Rehab', 'Kettlebell Mastery']),
      experienceYears: 9,
      hourlyRate: 95.0,
      verified: true,
      whatsapp: '+15550987654',
      profileCompleteness: 95,
      rankingScore: 92.0,
    },
  });

  const davidProfile = await prisma.trainerProfile.create({
    data: {
      userId: davidUser.id,
      title: 'Powerlifting State Champion & Muscle Hypertrophy Specialist',
      bio: 'Focuses on RPE-guided periodization, bar speed tracking, and bulletproof technique mastery for heavy squat, bench, and deadlift.',
      location: 'Austin, TX',
      specialties: JSON.stringify(['Powerlifting', 'Powerbuilding', 'Rehab Integration']),
      experienceYears: 8,
      hourlyRate: 85.0,
      verified: true,
      whatsapp: '+15550112233',
      profileCompleteness: 90,
      rankingScore: 88.5,
    },
  });

  // 3. Certifications
  await prisma.trainerCertification.createMany({
    data: [
      { trainerProfileId: marcusProfile.id, name: 'IFBB Pro Card', issuingBody: 'IFBB Professional League', year: 2018 },
      { trainerProfileId: marcusProfile.id, name: 'CSCS Specialist', issuingBody: 'NSCA', year: 2016 },
      { trainerProfileId: ethanProfile.id, name: 'USA Weightlifting Level 2', issuingBody: 'USAW', year: 2019 },
    ],
  });

  // 4. Seed Gym Facilities
  const ironSanctuary = await prisma.gym.create({
    data: {
      trainerProfileId: marcusProfile.id,
      name: 'Iron Sanctuary Performance Center',
      tagline: 'Elite heavy metal powerlifting & strength conditioning lab',
      rating: 4.9,
      reviewsCount: 142,
      location: 'Downtown Athletic District, NY',
      address: '442 Ironworks Blvd, New York, NY 10001',
      dayPassPrice: 25.0,
      monthlyPrice: 120.0,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      hours: '24 Hours / 7 Days a Week',
      featured: true,
      acType: 'AC',
      admissionFee: 15.0,
      rankingScore: 96.0,
    },
  });

  await prisma.gymImage.createMany({
    data: [
      { gymId: ironSanctuary.id, url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', orderIndex: 0 },
      { gymId: ironSanctuary.id, url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80', orderIndex: 1 },
      { gymId: ironSanctuary.id, url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80', orderIndex: 2 },
    ],
  });

  // 5. Seed Fitness Plans
  await prisma.fitnessPlan.create({
    data: {
      trainerProfileId: marcusProfile.id,
      title: '12-Week Mechanical Tension Hypertrophy System',
      category: 'Hypertrophy',
      durationWeeks: 12,
      daysPerWeek: 5,
      difficulty: 'Advanced',
      price: 49.99,
      rating: 4.96,
      enrolledCount: 420,
      image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
      description: 'Comprehensive hypertrophy blueprint incorporating Lengthened Partial Reps, Progressive Overload tracking, and Periodized Deload Blocks.',
      rankingScore: 95.0,
    },
  });

  // 6. Seed Stores & Products
  const marcusStore = await prisma.store.create({
    data: {
      trainerProfileId: marcusProfile.id,
      name: 'Vance Performance Gear & Supplements',
      description: '100% Micro-Filtered Whey Isolates, competition lever belts, and lab-tested performance supplements.',
      logo: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=200&q=80',
    },
  });

  const prod1 = await prisma.product.create({
    data: {
      storeId: marcusStore.id,
      name: 'Elite ISO-Whey Protein Isolate (5lbs)',
      category: 'Supplements',
      price: 74.99,
      stock: 120,
      sku: 'SKU-WHEY-5LB',
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80',
      description: '100% Micro-Filtered Whey Isolate with 27g Protein per scoop, zero added sugar, fast absorption.',
      featured: true,
      rankingScore: 92.0,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: prod1.id, name: 'Gourmet Chocolate / 5lbs', price: 74.99, stock: 60, sku: 'SKU-WHEY-5LB-CHO' },
      { productId: prod1.id, name: 'Vanilla Cream / 5lbs', price: 74.99, stock: 60, sku: 'SKU-WHEY-5LB-VAN' },
    ],
  });

  // 7. Seed Cart for Alexander
  const cart = await prisma.cart.create({ data: { userId: alexander.id } });
  await prisma.cartItem.create({
    data: { cartId: cart.id, productId: prod1.id, quantity: 1 },
  });

  // 8. Seed Blog Posts
  await prisma.blogPost.create({
    data: {
      title: 'Breaking Through Weightlifting Plateaus: Biomechanics & Autoregulation',
      slug: 'breaking-through-weightlifting-plateaus',
      excerpt: 'Discover why standard linear progression fails after the novice phase and how micro-periodization unlocks continuous strength gains.',
      body: 'Linear periodization dictates adding fixed weight every week. However, neuromuscular fatigue and metabolic substrate depletion mean human strength output fluctuates daily...',
      category: 'Training Science',
      readTime: '6 min read',
      heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      authorName: 'Marcus Vance',
      authorRole: 'Head Performance Coach',
    },
  });

  console.log('✅ Gym Hub Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
