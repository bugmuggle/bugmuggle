import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [],
  callbacks: {
    session({ session, token, user }) {
      return session
    }
  }
}

export default NextAuth(authOptions)
