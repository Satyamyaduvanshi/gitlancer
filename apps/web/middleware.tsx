import { auth } from "@/auth"; // ⚠️ UPDATE THIS PATH to point to your auth.ts file

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  
  // Define which paths require login
  const isProtectedRoute = 
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/repos') ||
    req.nextUrl.pathname.startsWith('/recharge') ||
    req.nextUrl.pathname.startsWith('/settings');

  // If they are not logged in and trying to access a protected route, kick them to /login
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(new URL('/login', req.nextUrl.origin));
  }
});

// This tells Next.js to run middleware on all routes EXCEPT static files and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};