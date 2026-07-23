import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryClientProvider from '@/providers/query-client-provider';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Premierbyte LMS',
  description: 'Enterprise Learning Management System Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-950 text-slate-100">
        <QueryClientProvider>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
