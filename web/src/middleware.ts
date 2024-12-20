import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { json } from "stream/consumers";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  // debug: true,
  publicRoutes: ["/", "/api/(.*)", "/docs(.*)", "/share(.*)"],
  // publicRoutes: ["/", "/(.*)"],
  async afterAuth(auth, req, evt) {
    // redirect them to organization selection page
    const userId = auth.userId;

    // Parse the URL to get the pathname
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (
      !auth.userId &&
      !auth.isPublicRoute
      // ||
      // pathname === "/create" ||
      // pathname === "/history" ||
      // pathname.startsWith("/edit")
    ) {
      const url = new URL(req.url);
      // console.log("URL Properties:", {
      //   href: url.href,
      //   origin: url.origin,
      //   protocol: url.protocol,
      //   username: url.username,
      //   password: url.password,
      //   host: url.host,
      //   hostname: url.hostname,
      //   port: url.port,
      //   pathname: url.pathname,
      //   search: url.search,
      //   searchParams: Array.from(url.searchParams.entries()),
      //   hash: url.hash,
      // });
      return redirectToSignIn({ returnBackUrl: 'http://192.168.1.26:3000' });
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  // matcher: ['/','/create', '/api/(twitter|generation|init|voice-cloning)'],
};
