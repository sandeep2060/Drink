import { createBrowserClient } from '@supabase/ssr';

export function getSupabaseBrowserConfigError() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url) return 'NEXT_PUBLIC_SUPABASE_URL is missing from this build.';
  if (!key) return 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing from this build.';

  try {
    const projectUrl = new URL(url);
    const isHttp = projectUrl.protocol === 'https:' || projectUrl.protocol === 'http:';
    const isProjectRoot = projectUrl.pathname === '/' && !projectUrl.search && !projectUrl.hash;
    if (!isHttp || !projectUrl.hostname || projectUrl.username || projectUrl.password) {
      return 'NEXT_PUBLIC_SUPABASE_URL must be an absolute HTTP or HTTPS project URL.';
    }
    if (!isProjectRoot) {
      return 'NEXT_PUBLIC_SUPABASE_URL must be the project root without /auth/v1 or another path.';
    }
    return null;
  } catch {
    return 'NEXT_PUBLIC_SUPABASE_URL is not a valid absolute URL.';
  }
}

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || getSupabaseBrowserConfigError()) return null;

  try {
    const projectUrl = new URL(url);
    return createBrowserClient(projectUrl.origin, key);
  } catch {
    return null;
  }
}
