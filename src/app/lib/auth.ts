import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: { label: "Email", type: "text" },
        subdomain: { label: "Subdomain", name: "subdomain", type: "text" },
      },
      async authorize(credentials, req) {
        try {
          const res = await axios.post("http://localhost:3001/login", {
            username: credentials?.username,
            email: credentials?.email,
            subdomain: credentials?.subdomain,
          });

          const user = res.data;

          // Check if the user object includes an accessToken
          if (user && user.accessToken) {
            // Return the user object including the accessToken
            // Now, this user object including the accessToken will be available in the jwt callback
            return user;
          }
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }

        // Return null if authentication fails
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user parameter is the user object received from the authorize function
      if (user?.accessToken) {
        token.accessToken = user.accessToken;

        const decoded = jwtDecode(user.accessToken) as {
          username: string;
          email: string;
          subdomain: string; // Include this line if subdomain is part of your JWT payload
          tenantId: string;
        };

        token.username = decoded.username;
        token.email = decoded.email;
        token.tenantId = decoded.tenantId;
        token.subdomain = decoded.subdomain;
      }
      return token;
    },
    async session({ session, token }) {
      // Check if session.user exists before attempting to assign accessToken
      if (token?.accessToken) {
        if (session.user) {
          session.user.accessToken = token.accessToken;
          session.user.username = token.username;
          session.user.email = token.email;
          session.user.tenantId = token.tenantId;
          session.user.subdomain = token.subdomain;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       domain:
  //         process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined, // Note the leading dot, making it accessible across all subdomains
  //       secure: true, // Recommended to always use secure cookies
  //     },
  //   },
  // },
};

// Make sure you export this for NextAuth to find it
export default authOptions;

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
      accessToken: string;
    };
  } | null>;
}
