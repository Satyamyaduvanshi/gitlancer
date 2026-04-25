import NextAuth from "next-auth";
import type { NextAuthConfig, Session, Profile, User, Account } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // We request 'repo' scope so we can see private repos if needed
      authorization: { params: { scope: 'read:user user:email repo' } },
    }),
  ],
  callbacks: {
    /**
     * JWT Callback: Runs whenever a token is created or updated.
     * We grab the accessToken from the Account and the ID from the Profile.
     */
    async jwt({ token, account, profile }: { token: JWT; account?: Account | null; profile?: Profile }) {
      if (account && profile) {
        token.id = profile.id?.toString();
        token.username = (profile as any).login;
        token.accessToken = account.access_token; // 👈 CRITICAL: Needed for GitHub API calls
      }
      return token;
    },

    /**
     * Session Callback: Exposes data to the frontend (useSession).
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        // Casting to 'any' to avoid strict type errors while extending session
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session as any).accessToken = token.accessToken; // 👈 CRITICAL: Consumed by CreateVault.tsx
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Optional: Redirect to custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
export const { GET, POST } = handlers;