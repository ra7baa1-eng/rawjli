import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simple auth without database for testing
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check for admin credentials
        if (credentials.email === 'alumabdo0@gmail.com' && credentials.password === 'abdo@154122') {
          return {
            id: 'admin-001',
            email: 'alumabdo0@gmail.com',
            role: 'ADMIN',
            name: 'Admin روجلي',
          }
        }

        // For any other email, just check if password is provided
        if (credentials.password.length >= 6) {
          return {
            id: 'user-' + Date.now(),
            email: credentials.email,
            role: 'MARKETER',
            name: 'مستخدم روجلي',
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
