import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JADE — Good Drinks. Better Moments.',
  description:
    'Discover refreshing drinks made for every mood, every moment, and every gathering. Fast delivery across Nepal.',
  openGraph: {
    title: 'JADE — Good Drinks. Better Moments.',
    description: 'Refreshing drinks made for every mood, every moment, and every gathering.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#F8F5ED] text-[#17211D] selection:bg-[#0E3B2E] selection:text-[#B8D94E]">
        {children}
      </body>
    </html>
  );
}
