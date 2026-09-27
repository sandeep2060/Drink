import { cookies } from 'next/headers';
import { AgeGate } from '@/components/AgeGate';

export default async function AgeCheckPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [cookieStore, params] = await Promise.all([cookies(), searchParams]);
  const requestedPath = params.next;
  let nextPath = '/';
  if (requestedPath?.startsWith('/')) {
    const candidate = new URL(requestedPath, 'https://drinkdrop.invalid');
    if (candidate.origin === 'https://drinkdrop.invalid' && candidate.pathname !== '/age-check') {
      nextPath = `${candidate.pathname}${candidate.search}${candidate.hash}`;
    }
  }

  return <AgeGate nextPath={nextPath} denied={cookieStore.get('drinkdrop_age')?.value === 'no'} />;
}