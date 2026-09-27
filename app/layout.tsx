import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drinks Delivery Platform',
  description: 'Multi-dealer drinks delivery marketplace and operations system'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
