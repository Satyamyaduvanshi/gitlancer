import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/navigation";

export default withAuth(
  function middleware(req) {
    // If the user is authorized, let the request proceed normally
    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback determines IF a user is allowed to access the route
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // 1️⃣ Define your fully public routes here
        const isPublicPath = 
          pathname.startsWith('/claim') || // Allows /claim and /claim/[id]
          pathname.startsWith('/link') ||  // Allows /link
          pathname.startsWith('/login') || // Must be public so users can actually log in!
          pathname === '/';                // Keep this if your landing page (/) is public

        // 2️⃣ If it's a public path, bypass the auth check
        if (isPublicPath) {
          return true;
        }

        // 3️⃣ For all other routes (Dashboard, Repos, Recharge, Settings, etc.)
        // return true if they have a token, false if they don't.
        return !!token;
      },
    },
    pages: {
      signIn: '/login', // 🔄 Redirect unauthorized users to your beautiful login page
    }
  }
);

// ⚡ This config tells Next.js WHICH routes should run through this middleware.
// We run it on everything EXCEPT static files (images, svgs, Next.js build files) and APIs.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};