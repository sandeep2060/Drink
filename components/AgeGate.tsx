'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Beer, ShieldCheck } from 'lucide-react';

export function AgeGate({ nextPath, denied: initiallyDenied }: { nextPath: string; denied: boolean }) {
  const [denied, setDenied] = useState(initiallyDenied);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function chooseAge(decision: 'yes' | 'no') {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/age-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      if (!response.ok) throw new Error('Could not save your age confirmation. Please try again.');
      if (decision === 'no') {
        setDenied(true);
        setBusy(false);
        return;
      }
      router.replace(nextPath);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save your age confirmation. Please try again.');
      setBusy(false);
    }
  }

  return (
    <main className="age-gate">
      <section className="age-panel" aria-labelledby="age-title">
        <div className="landing-brand age-brand" aria-label="DrinkDrop">
          <span className="brand-mark"><Beer size={20} strokeWidth={2.2} /></span>
          <span>drinkdrop<span className="brand-period">.</span></span>
        </div>
        <span className="age-symbol"><ShieldCheck size={25} strokeWidth={1.5} /></span>
        {denied ? (
          <>
            <p className="eyebrow">AGE RESTRICTED</p>
            <h1 id="age-title">This store is for adults.</h1>
            <p className="age-copy">You said you are under 18, so DrinkDrop is unavailable for now.</p>
            <div className="age-actions">
              <button type="button" className="button-primary" onClick={() => setDenied(false)}>
                Check again <ArrowRight size={17} />
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow">BEFORE YOU COME IN</p>
            <h1 id="age-title">Are you 18 years or older?</h1>
            <p className="age-copy">DrinkDrop lists alcoholic drinks for delivery in Nepal. Please confirm your age to continue.</p>
            <div className="age-actions">
              <button type="button" className="button-primary" onClick={() => chooseAge('yes')} disabled={busy}>
                Yes, I’m 18 or older <ArrowRight size={17} />
              </button>
              <button type="button" className="age-deny" onClick={() => chooseAge('no')} disabled={busy}>
                No, I’m under 18
              </button>
            </div>
            {error && <p role="alert" className="age-error">{error}</p>}
          </>
        )}
        <p className="age-footnote">Please enjoy responsibly. Valid ID may be required at delivery.</p>
      </section>
    </main>
  );
}