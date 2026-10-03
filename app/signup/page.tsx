import Link from 'next/link';
import { SignupForm } from '@/components/SignupForm';
import { Flame, ShieldCheck, ArrowLeft, UserCheck } from 'lucide-react';

export default function Signup() {
  return (
    <main className="min-h-screen bg-[#0d0f12] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Accent Gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ff5b00]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="px-6 py-6 max-w-[1440px] mx-auto w-full flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-full bg-[#ff5b00] text-white flex items-center justify-center font-black shadow-lg shadow-orange-600/30 group-hover:scale-105 transition duration-200">
            <Flame size={22} className="fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
            Foodies
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md transition border border-white/10"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-6">
        <div className="w-full max-w-xl bg-[#161920]/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#ff5b00] mb-3">
              <UserCheck size={14} />
              Official Registration
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Create Customer Account
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium max-w-md mx-auto">
              Fill in your details below to set up your official Foodies account with instant age verification and live GPS delivery pin.
            </p>
          </div>

          <SignupForm />

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
            <span>Already registered with Foodies? </span>
            <Link href="/login" className="font-extrabold text-[#ff5b00] hover:underline">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <footer className="py-4 text-center text-xs font-semibold text-slate-500 border-t border-white/10 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-[#ff5b00]" />
          <span>Foodies Official &amp; Encrypted Account Portal</span>
        </div>
      </footer>
    </main>
  );
}