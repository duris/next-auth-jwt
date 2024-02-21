// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type
   * Session.user is what's returned by useSession(), getSession(), and received in callbacks
   */
  interface User {
    accessToken?: string;
    tenantId?: string; // Adding tenantId as an optional property
    subdomain?: string; // Adding subdomain as an optional property
    username?: string;
  }

  interface Session {
    user?: User & {
      accessToken?: string;
      tenantId?: string; // Ensure tenantId is included in the session's user object
      subdomain?: string; // Ensure subdomain is included in the session's user object
      username?: string;
    };
  }
}

declare module "next-auth/jwt" {
  /** Extends the built-in JWT type to include accessToken, tenantId, and subdomain */
  interface JWT {
    accessToken?: string;
    tenantId?: string; // Adding tenantId as an optional property
    subdomain?: string; // Adding subdomain as an optional property
    username?: string;
  }
}
