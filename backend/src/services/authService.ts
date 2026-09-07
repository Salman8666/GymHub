import { prisma } from '../lib/db';
import { hashPassword, verifyPassword, signToken, UserSessionPayload } from '../lib/jwt';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../schemas/auth';

export async function registerUser(input: z.infer<typeof registerSchema>) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error('USER_EXISTS: An account with this email already exists');
  }

  const hashedPassword = hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: hashedPassword,
      role: input.role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
  });

  let trainerProfileId: string | undefined;

  // Auto-create trainer profile if role is TRAINER
  if (input.role === 'TRAINER') {
    const profile = await prisma.trainerProfile.create({
      data: {
        userId: user.id,
        title: 'Certified Performance Coach',
        bio: 'Dedicated fitness professional specializing in strength, athletic conditioning, and body composition transformation.',
        location: 'New York, NY',
        specialties: JSON.stringify(['Hypertrophy Science', 'Strength & Power']),
        experienceYears: 5,
        hourlyRate: 85.0,
        verified: true,
        profileCompleteness: 85,
        rankingScore: 80.0,
      },
    });
    trainerProfileId = profile.id;
  }

  const tokenPayload: UserSessionPayload = {
    id: user.id,
    email: user.email,
    role: user.role as 'USER' | 'TRAINER',
    name: user.name,
    trainerProfileId,
  };

  const token = signToken(tokenPayload);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      membershipType: user.membershipType,
      createdAt: user.createdAt,
      trainerProfileId,
    },
    token,
  };
}

export async function loginUser(input: z.infer<typeof loginSchema>) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    include: { trainerProfile: true },
  });

  if (!user || !user.passwordHash) {
    throw new Error('INVALID_CREDENTIALS: Invalid email or password');
  }

  const isValid = verifyPassword(input.password, user.passwordHash);
  if (!isValid) {
    throw new Error('INVALID_CREDENTIALS: Invalid email or password');
  }

  const trainerProfileId = user.trainerProfile?.id;

  const tokenPayload: UserSessionPayload = {
    id: user.id,
    email: user.email,
    role: user.role as 'USER' | 'TRAINER',
    name: user.name,
    trainerProfileId,
  };

  const token = signToken(tokenPayload);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      membershipType: user.membershipType,
      createdAt: user.createdAt,
      trainerProfileId,
    },
    token,
  };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      trainerProfile: {
        include: {
          certifications: true,
          store: true,
        },
      },
    },
  });
}
