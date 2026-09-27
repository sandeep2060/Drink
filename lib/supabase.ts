import { createBrowserClient } from '@supabase/ssr';

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  try {
    const projectUrl = new URL(url);
    const isHttp = projectUrl.protocol === 'https:' || projectUrl.protocol === 'http:';
    const isProjectRoot = projectUrl.pathname === '/' && !projectUrl.search && !projectUrl.hash;
    if (!isHttp || !projectUrl.hostname || !isProjectRoot || projectUrl.username || projectUrl.password) return null;
    return createBrowserClient(projectUrl.origin, key);
  } catch {
    return null;
  }
}
