import { getServerSession } from 'next-auth/next';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare, hash } from 'bcrypt';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
          });

          if (!user) {
            return null;
          }

          const isValid = await compare(credentials.password, user.passwordHash);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            name: user.name || undefined,
            email: user.email
          };
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login'
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function registerUser(name: string, email: string, password: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error('Failed to register user:', error);
    throw error;
  }
}

export async function isEmailAvailable(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
    return !user;
  } catch (error) {
    console.error('Failed to check email availability:', error);
    throw error;
  }
}

export async function generateApiKey(userId: number, name: string) {
  try {
    // Generate a random API key
    const apiKey = Buffer.from(Math.random().toString(36).substring(2) + Date.now().toString(36)).toString('base64');
    
    // Hash the API key
    const keyHash = await hash(apiKey, 10);
    
    // Set expiration date to 1 year from now
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    // Create the new API key
    await prisma.apiKey.create({
      data: {
        userId,
        keyHash,
        name,
        expiresAt,
      },
    });
    
    return apiKey;
  } catch (error) {
    console.error('Failed to generate API key:', error);
    throw error;
  }
}

export async function validateApiKey(apiKey: string) {
  try {
    // Get all active API keys
    const keys = await prisma.apiKey.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    // Check each key (this is inefficient but works for demo purposes)
    for (const key of keys) {
      const isValid = await compare(apiKey, key.keyHash);
      if (isValid) {
        return {
          userId: key.userId,
          user: key.user,
          keyId: key.id
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to validate API key:', error);
    return null;
  }
}