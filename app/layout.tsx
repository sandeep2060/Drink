import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Foodies — Good Food. Great Moments.',
  description:
    'Order delicious food and refreshing drinks with Foodies. Explore pizza, burgers, chicken, Asian food, desserts, coffee and more delivered fresh to your doorstep.',
  openGraph: {
    title: 'Foodies — Good Food. Great Moments.',
    description: 'Your favorite food and drinks, delivered fresh to your doorstep.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#0c0d10] text-slate-100 selection:bg-[#ff5b00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
