import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: {
    default: 'ArgoDive - Aquaculture Diving Operations',
    template: '%s | ArgoDive',
  },
  description: 'Operational platform for aquaculture dive management — monitor cages, inspections, fish transfers, and environmental data in real time.',
  keywords: ['aquaculture', 'diving', 'fish farm', 'cage management', 'inspection', 'argodive'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'ArgoDive - Aquaculture Diving Operations',
    description: 'Monitor cages, inspections, fish transfers, and environmental data in real time.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
