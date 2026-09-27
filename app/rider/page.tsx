import { AppShell } from '@/components/AppShell';

export default function Rider() {
  return (
    <AppShell role="RIDER" title="Rider Dashboard" subtitle="Your delivery workspace">
      <div className="mx-auto max-w-4xl card p-8 text-center">
        <h2 className="font-semibold">No deliveries assigned</h2>
        <p className="mt-2 text-sm text-slate-500">Assigned deliveries will appear here when your account is connected.</p>
      </div>
    </AppShell>
  );
}