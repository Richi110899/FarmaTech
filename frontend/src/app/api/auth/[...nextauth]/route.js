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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/verify-google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            return false;
          }

          if (data.success) {
            user.rol = data.user.rol;
            user.nombre = data.user.nombre;
            user.apellido = data.user.apellido;
            user.id = data.user.id;
            user.token = data.token; // <--- GUARDA EL TOKEN DEL BACKEND AQUÍ
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
        token.rol = user.rol || 'Usuario';
        token.nombre = user.nombre || user.name?.split(' ')[0] || 'Usuario';
        token.apellido = user.apellido || user.name?.split(' ')[1] || '';
        token.id = user.id || 'temp-id';
        if (user.token) {
          token.backendToken = user.token; // <--- GUARDA EL TOKEN DEL BACKEND EN EL JWT
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.rol = token.rol;
        session.user.nombre = token.nombre;
        session.user.apellido = token.apellido;
        session.user.id = token.id;
        if (token.backendToken) {
          session.backendToken = token.backendToken; // <--- PASA EL TOKEN DEL BACKEND A LA SESIÓN
        }
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