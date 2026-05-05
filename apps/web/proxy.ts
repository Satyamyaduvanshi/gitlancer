import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  
  // Define which paths require login
  const isProtectedRoute = 
    pathname.startsWith('/dashboard')
    //  ||
    // pathname.startsWith('/repos') ||
    // pathname.startsWith('/recharge') ||
    // pathname.startsWith('/settings');


  // 1️⃣ If they are NOT logged in and trying to access a protected route ➡️ Kick to /login
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(new URL('/login', req.nextUrl.origin));
  }

  // 2️⃣ UX Upgrade: If they ARE logged in and try to go to the login page ➡️ Send to dashboard
  if (isLoggedIn && pathname === '/login') {
    return Response.redirect(new URL('/dashboard', req.nextUrl.origin));
  }
});

// This tells Next.js to run middleware on all routes EXCEPT static files and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};