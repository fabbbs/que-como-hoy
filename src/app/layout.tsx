import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '¿Qué como hoy?',
  description: 'Elige qué comer según las opciones de tu nutricionista',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '¿Qué como hoy?',
  },
};

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const s = JSON.parse(localStorage.getItem('que-como-hoy-settings') || '{}');
                if (s.darkMode) document.documentElement.classList.add('dark');
              } catch(e) {}
            `,
          }}
        />
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-green-600">
              🍽️ ¿Qué como hoy?
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors">
                Hoy
              </Link>
              <Link href="/history" className="text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors">
                Historial
              </Link>
              <Link href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors">
                ⚙️ Opciones
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
