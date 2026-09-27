import { AgeGate } from '@/components/AgeGate';

export default async function AgeCheckPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const requestedPath = params.next;
  let nextPath = '/';
  if (requestedPath?.startsWith('/')) {
    const candidate = new URL(requestedPath, 'https://drinkdrop.invalid');
    if (candidate.origin === 'https://drinkdrop.invalid' && candidate.pathname !== '/age-check') {
      nextPath = `${candidate.pathname}${candidate.search}${candidate.hash}`;
    }
  }

  return <AgeGate nextPath={nextPath} denied={false} />;
}