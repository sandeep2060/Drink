import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) return NextResponse.next();
  let response=NextResponse.next({request});
  const supabase=createServerClient(url,key,{cookies:{getAll(){return request.cookies.getAll()},setAll(cookies){cookies.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
  const {data:{user}}=await supabase.auth.getUser();
  const path=request.nextUrl.pathname;
  if(!user && path!=='/login') return NextResponse.redirect(new URL('/login',request.url));
  if(user && path==='/login') return NextResponse.redirect(new URL('/admin',request.url));
  return response;
}
export const config={matcher:['/admin/:path*','/manager/:path*','/dealer/:path*','/rider/:path*','/customer/:path*','/orders/:path*','/reports/:path*','/login']};
