import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ECB SAC | Student Activity Center',
  description:
    'Official ECB Student Activity Center (SAC) portal. Discover 20+ clubs, register for hackathons and cultural fests, manage teams, reserve campus spaces, and connect with mentors.',
  keywords: [
    'Student Activity Center',
    'ECB SAC',
    'College Clubs',
    'Hackathons',
    'Cultural Fest',
    'Sports League',
    'SAC Portal',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-sac-orange-light selection:text-slate-900 overflow-x-hidden">
        {/* Background gradient ambient meshes */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-sac-orange/5 via-sac-blue/5 to-transparent blur-3xl rounded-full" />
        </div>



        {/* Floating Navbar */}
        <Navbar />

        {/* Main Content Viewport */}
        <main className="flex-1 pt-24 sm:pt-28 pb-16">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
