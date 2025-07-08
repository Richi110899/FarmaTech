import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Solo permitir login con Google si el usuario existe en nuestra base de datos
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

          if (!response.ok) {
            return false;
          }

          const data = await response.json();
          
          if (data.success) {
            // Agregar información del usuario de nuestra base de datos
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
      // Agregar información del usuario al token JWT
      if (user) {
        token.rol = user.rol || 'Usuario';
        token.nombre = user.nombre || user.name?.split(' ')[0] || 'Usuario';
        token.apellido = user.apellido || user.name?.split(' ')[1] || '';
        token.id = user.id || 'temp-id';
      }
      return token;
    },
    async session({ session, token }) {
      // Agregar información del usuario a la sesión
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 