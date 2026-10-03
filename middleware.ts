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
  const { data: { user } } = await supabase.auth.getUser();

  // Protected Routes and Required Roles mapping
  const isProtected = ['/admin', '/manager', '/dealer', '/rider', '/customer', '/orders', '/reports'].some(
    route => path === route || path.startsWith(`${route}/`)
  );

  if (!user && isProtected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    // Fetch profile role from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = (profile?.role || 'CUSTOMER').toUpperCase();

    // Store user role in cookie for client hydration
    response.cookies.set('user_role', role, { path: '/' });

    if (path === '/login' || path === '/signup') {
      const defaultLanding =
        role === 'ADMIN' ? '/admin' :
        role === 'MANAGER' ? '/manager' :
        role === 'DEALER' ? '/dealer' :
        role === 'RIDER' ? '/rider' : '/customer';
      return NextResponse.redirect(new URL(defaultLanding, request.url));
    }

    // STRICT ROLE-BASED ACCESS CONTROL (RBAC) SECURITY RULES
    // 1. Admin Panel Security: Only ADMIN role allowed
    if (path.startsWith('/admin') && role !== 'ADMIN') {
      const fallbackUrl = new URL(role === 'RIDER' ? '/rider' : role === 'MANAGER' ? '/manager' : role === 'DEALER' ? '/dealer' : '/customer', request.url);
      fallbackUrl.searchParams.set('error', 'unauthorized_admin');
      return NextResponse.redirect(fallbackUrl);
    }

    // 2. Manager Panel Security: Only ADMIN and MANAGER roles allowed
    if (path.startsWith('/manager') && !['ADMIN', 'MANAGER'].includes(role)) {
      return NextResponse.redirect(new URL(role === 'RIDER' ? '/rider' : '/customer', request.url));
    }

    // 3. Dealer Panel Security: Only ADMIN, MANAGER, and DEALER allowed
    if (path.startsWith('/dealer') && !['ADMIN', 'MANAGER', 'DEALER'].includes(role)) {
      return NextResponse.redirect(new URL(role === 'RIDER' ? '/rider' : '/customer', request.url));
    }

    // 4. Rider Panel Security: Only ADMIN, MANAGER, and RIDER allowed
    if (path.startsWith('/rider') && !['ADMIN', 'MANAGER', 'RIDER'].includes(role)) {
      return NextResponse.redirect(new URL('/customer', request.url));
    }
  }

  return response;
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/age-verification|.*\\..*).*)'],
};
