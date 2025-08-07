import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'DomiSafe - Tu plataforma de confianza para empleadas domésticas',
  description: 'Conecta con empleadas domésticas verificadas en tu zona. Servicio seguro, confiable y profesional.',
  keywords: 'empleadas domésticas, limpieza, servicio doméstico, personal de hogar',
  authors: [{ name: 'DomiSafe Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'DomiSafe - Tu plataforma de confianza para empleadas domésticas',
    description: 'Conecta con empleadas domésticas verificadas en tu zona. Servicio seguro, confiable y profesional.',
    type: 'website',
    locale: 'es_AR',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}