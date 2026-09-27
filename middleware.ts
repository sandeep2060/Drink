import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ageStatus = request.cookies.get('drinkdrop_age')?.value;
  const isAgeCheck = path === '/age-check';

  if (ageStatus === 'yes' && isAgeCheck) {
    const requestedPath = request.nextUrl.searchParams.get('next');
    let destination = '/';
    if (requestedPath?.startsWith('/')) {
      const candidate = new URL(requestedPath, request.url);
      if (candidate.origin === request.nextUrl.origin && candidate.pathname !== '/age-check') {
        destination = `${candidate.pathname}${candidate.search}${candidate.hash}`;
      }
    }
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (ageStatus !== 'yes' && !isAgeCheck) {
    const ageCheckUrl = new URL('/age-check', request.url);
    ageCheckUrl.searchParams.set('next', `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(ageCheckUrl);
  }

  if (isAgeCheck) return NextResponse.next();

  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) return NextResponse.next();
  let response=NextResponse.next({request});
  const supabase=createServerClient(url,key,{cookies:{getAll(){return request.cookies.getAll()},setAll(cookies){cookies.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
  const {data:{user}}=await supabase.auth.getUser();
  const isProtected = ['/admin','/manager','/dealer','/rider','/customer','/orders','/reports'].some((route) => path === route || path.startsWith(`${route}/`));
  if(!user && isProtected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }
  if(user && path==='/login') return NextResponse.redirect(new URL('/admin',request.url));
  return response;
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/age-verification|.*\\..*).*)'],
};
