import { cookies } from 'next/headers';
import { AgeGate } from '@/components/AgeGate';

export default async function AgeCheckPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [cookieStore, params] = await Promise.all([cookies(), searchParams]);
  const requestedPath = params.next;
  const nextPath = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') && !requestedPath.startsWith('/age-check')
    ? requestedPath
    : '/';

  return <AgeGate nextPath={nextPath} denied={cookieStore.get('drinkdrop_age')?.value === 'no'} />;
}