import Providers from "./providers";
import LayoutShell from "./shell";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
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
