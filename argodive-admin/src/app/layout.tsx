import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import './globals.css';
import { AdminLayout } from '@/components/layout/admin-layout';

export const metadata: Metadata = {
  title: {
    default: 'ArgoDive Admin',
    template: '%s | ArgoDive Admin',
  },
  description: 'ArgoDive administration panel — manage species, cages, nets, inspections, and system configuration for aquaculture operations.',
  keywords: ['aquaculture', 'admin', 'fish farm', 'cage management', 'argodive'],
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
