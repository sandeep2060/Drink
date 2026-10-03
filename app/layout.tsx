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
  title: 'Jade Drinks — Crafted for Your Everyday Ritual',
  description:
    'Thoughtfully crafted drinks with refreshing flavors, quality ingredients, and a modern approach to everyday refreshment.',
  openGraph: {
    title: 'Jade Drinks — Crafted for Your Everyday Ritual',
    description: 'Drinks made to feel as good as they taste.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#F6F3EA] text-[#17201C] selection:bg-[#123C32] selection:text-[#D7E85A]">
        {children}
      </body>
    </html>
  );
}
