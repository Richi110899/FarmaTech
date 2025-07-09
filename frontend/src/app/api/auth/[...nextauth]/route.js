import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/auth/verify-google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, name: user.name }),
          });
          if (!response.ok) return false;
          const data = await response.json();
          if (data.success) {
            user.rol = data.user.rol;
            user.nombre = data.user.nombre;
            user.apellido = data.user.apellido;
            user.id = data.user.id;
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error('Error verificando usuario:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.rol = user.rol;
        token.nombre = user.nombre;
        token.apellido = user.apellido;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.rol = token.rol;
        session.user.nombre = token.nombre;
        session.user.apellido = token.apellido;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST }; 