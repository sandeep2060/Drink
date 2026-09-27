import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DrinkDrop | Good drinks, on your time',
  description: 'Cold favourites, delivered around the clock. Your local drinks run just found a shorter route.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
