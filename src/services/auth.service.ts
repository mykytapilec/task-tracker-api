import { prisma } from '../config/database.js';
import { comparePassword, hashPassword } from '../utils/password.js';

interface RegisterInput {
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await hashPassword(data.password);

    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
      },
    });
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
    };
  },
};
