import NextAuth from "next-auth";
import type { NextAuthConfig, Session, Profile, User, Account } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: 'read:user user:email repo' } },
    }),
  ],
  callbacks: {
 
    async jwt({ token, account, profile }: { token: JWT; account?: Account | null; profile?: Profile }) {
      if (account && profile) {
        token.id = profile.id?.toString();
        token.username = (profile as any).login;
        token.accessToken = account.access_token; 
      }
      return token;
    },

 
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {

        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session as any).accessToken = token.accessToken; 
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', 
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
export const { GET, POST } = handlers;