export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls = s.includes('deliver') || s.includes('active') || s.includes('online') || s.includes('available') ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300' : s.includes('cancel') || s.includes('offline') ? 'bg-red-100/90 text-red-800 border border-red-300' : 'bg-amber-100/90 text-amber-800 border border-amber-300';
  return <span className={`badge ${cls}`}>{status.replaceAll('_',' ')}</span>;
}
