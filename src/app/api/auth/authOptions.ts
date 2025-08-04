import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          return null;
        }

        // Check for admin login first (using username field)
        if (credentials.username) {
          const adminUsername = process.env.ADMIN_USERNAME;
          const adminPassword = process.env.ADMIN_PASSWORD;
          
          if (credentials.username === adminUsername && credentials.password === adminPassword) {
            return { id: "admin", name: "Admin", email: credentials.username, role: "admin" };
          }
        }

        // Check for regular user login (using email field)
        if (credentials.email) {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            // For MVP, we'll use simple password comparison
            // In production, you'd want to hash passwords
            if (credentials.password === user.password) {
              return { 
                id: user.id, 
                name: user.name || user.email, 
                email: user.email, 
                role: "user" 
              };
            }
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 