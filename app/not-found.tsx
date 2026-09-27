import Link from 'next/link';
export default function NotFound(){return <main className="grid min-h-screen place-items-center p-6"><div className="text-center"><div className="text-6xl font-black">404</div><p className="mt-2 text-slate-500">Page not found.</p><Link className="btn-primary mt-5" href="/login">Back to demo</Link></div></main>}
