import Providers from "./providers";
import LayoutShell from "./shell";
import "../styles/globals.css";
import GoogleAuthSync from "@/components/GoogleAuthSync";

export const metadata = {
  title: 'FarmaTech - Sistema de Gestión Farmacéutica',
  description: 'Sistema integral de gestión para farmacias',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>FarmaTech - Sistema de Gestión Farmacéutica</title>
        <meta name="description" content="Sistema de gestión farmacéutica FarmaTech" />
      </head>
      <body>
        <Providers>
          <GoogleAuthSync />
          <LayoutShell>
            <div className="w-full h-full px-4"> {/* Ocupa todo el ancho y alto disponible */}
              {children}
            </div>
          </LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
