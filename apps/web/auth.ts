import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // 🚨 CRITICAL ADDITION 1: Ask GitHub for permission to read repositories
      authorization: { params: { scope: "read:user user:email repo" } },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],
  callbacks: {
    // 🚨 CRITICAL ADDITION 2: Catch the 'account' object to grab the access_token
    async jwt({ token, user, account }) {
      // The 'account' object is only present on the very first login
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }
      return token;
    },
    // 🚨 CRITICAL ADDITION 3: Pass the token and ID down to the frontend session
    async session({ session, token }) {
      // This is what your frontend Axios call needs to fetch the repos
      (session as any).accessToken = token.accessToken;

      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username as string;
      }
      return session;
    },
  },
});