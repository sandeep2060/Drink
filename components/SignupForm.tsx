'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { bsToAd } from '@sbmdkl/nepali-date-converter';
import { getSupabaseBrowserClient, getSupabaseBrowserConfigError } from '@/lib/supabase';
import { MapPin, ShieldCheck, User, Mail, Phone, Calendar, Lock, CheckCircle2, Navigation } from 'lucide-react';

type SignupLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

function isAtLeast18(dateOfBirth: string) {
  const [birthYear, birthMonth, birthDay] = dateOfBirth.split('-').map(Number);
  const today = new Date();
  let age = today.getUTCFullYear() - birthYear;
  const birthdayHasPassed = today.getUTCMonth() + 1 > birthMonth ||
    (today.getUTCMonth() + 1 === birthMonth && today.getUTCDate() >= birthDay);

  if (!birthdayHasPassed) age -= 1;
  return age >= 18;
}

export function SignupForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirthBs, setDateOfBirthBs] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState<SignupLocation | null>(null);
  const [capturingLocation, setCapturingLocation] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  function captureLocation() {
    setError('');
    if (!navigator.geolocation) {
      setError('Location access is not available in this browser.');
      return;
    }

    setCapturingLocation(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy });
        setCapturingLocation(false);
      },
      () => {
        setError('Location is required to create your account. Allow location access and try again.');
        setCapturingLocation(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    const normalizedPhone = phone.trim().replace(/[\s()-]/g, '');
    const nepaliPhone = normalizedPhone.startsWith('+977') ? normalizedPhone : `+977${normalizedPhone}`;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!/^\+9779[6-8]\d{8}$/.test(nepaliPhone)) {
      setError('Enter a valid Nepali mobile number, such as 98XXXXXXXX or +977 98XXXXXXXX.');
      return;
    }
    if (!location) {
      setError('Capture your sign-up location before creating your account.');
      return;
    }

    let dateOfBirth: string;
    try {
      dateOfBirth = bsToAd(dateOfBirthBs.trim());
    } catch {
      setError('Enter a valid Bikram Sambat birth date in YYYY-MM-DD format.');
      return;
    }
    if (!isAtLeast18(dateOfBirth)) {
      setError('You must be at least 18 years old to create an account.');
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError(`Sign-up is unavailable. ${getSupabaseBrowserConfigError() || 'Check the Supabase project settings for this deployment.'} Set these values in Vercel Environment Variables, then redeploy.`);
      return;
    }

    setBusy(true);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?confirmed=1`,
          data: {
            full_name: fullName.trim(),
            phone: nepaliPhone,
            gender,
            date_of_birth: dateOfBirth,
            date_of_birth_bs: dateOfBirthBs.trim(),
            signup_latitude: location.latitude,
            signup_longitude: location.longitude,
            signup_location_accuracy_m: location.accuracy,
          },
        },
      });
      if (signupError) {
        setError(signupError.message);
        setBusy(false);
        return;
      }
      if (data.session) {
        router.push('/customer');
        router.refresh();
        return;
      }
      setMessage('Account created. Check your email to confirm your account, then sign in.');
      setBusy(false);
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Unable to create your account. Check the Supabase project URL and try again.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      
      {/* SECTION 1: Personal & Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-black uppercase tracking-wider text-[#ff5b00]">
          <User size={16} />
          <span>1. Personal &amp; Contact Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#ff5b00] focus:bg-white/10 transition"
                type="text"
                placeholder="e.g. Ramesh Thapa"
                autoComplete="name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#ff5b00] focus:bg-white/10 transition"
                type="email"
                placeholder="ramesh@example.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
              Nepali Mobile Number
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#ff5b00] focus:bg-white/10 transition"
                type="tel"
                autoComplete="tel"
                placeholder="98XXXXXXXX or +977 98XXXXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
              <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
              Gender
            </label>
            <select
              className="w-full rounded-xl border border-white/10 bg-[#1e222b] px-4 py-3 text-sm text-white outline-none focus:border-[#ff5b00] transition"
              value={gender}
              onChange={e => setGender(e.target.value)}
              required
            >
              <option value="" disabled>Select gender</option>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
              <option value="NON_BINARY">Non-binary</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>


      {/* SECTION 2: Age & Identity Verification */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-black uppercase tracking-wider text-[#ff5b00]">
          <Calendar size={16} />
          <span>2. Age &amp; Identity Verification</span>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
            Date of Birth (Bikram Sambat BS)
          </label>
          <div className="relative">
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#ff5b00] focus:bg-white/10 transition"
              type="text"
              inputMode="numeric"
              autoComplete="bday"
              placeholder="YYYY-MM-DD (e.g. 2063-05-12)"
              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
              value={dateOfBirthBs}
              onChange={e => setDateOfBirthBs(e.target.value)}
              required
            />
            <Calendar size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#ff5b00]" />
            <span>Age must be at least 18 years old for alcohol &amp; express delivery services.</span>
          </p>
        </div>
      </div>


      {/* SECTION 3: Sign-Up GPS Location */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-black uppercase tracking-wider text-[#ff5b00]">
          <MapPin size={16} />
          <span>3. Official Sign-Up GPS Location</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold text-slate-300 uppercase">Current Delivery Pin</div>
            {location && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 size={13} />
                Captured ({Math.round(location.accuracy)}m)
              </span>
            )}
          </div>

          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-3 text-xs font-black text-white transition backdrop-blur-md active:scale-[0.99] disabled:opacity-50"
            onClick={captureLocation}
            disabled={busy || capturingLocation}
          >
            <Navigation size={16} className={capturingLocation ? 'animate-spin' : ''} />
            <span>
              {capturingLocation
                ? 'Acquiring GPS Signal...'
                : location
                ? 'Refresh GPS Delivery Coordinates'
                : 'Share Current GPS Location'}
            </span>
          </button>

          <p className="text-[11px] text-slate-400 leading-normal">
            Location permission is required to confirm exact delivery outlet coverage in your region.
          </p>
        </div>
      </div>


      {/* SECTION 4: Security Credentials */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-black uppercase tracking-wider text-[#ff5b00]">
          <Lock size={16} />
          <span>4. Account Credentials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#ff5b00] focus:bg-white/10 transition"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#ff5b00] focus:bg-white/10 transition"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>


      {/* Submit Button */}
      <button
        disabled={busy || capturingLocation}
        className="w-full rounded-xl bg-gradient-to-r from-[#ff5b00] to-[#ff3b00] py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-orange-600/30 transition hover:bg-[#e05000] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 mt-4"
      >
        {busy ? 'Processing Registration...' : 'Complete Official Registration'}
      </button>

      {error && (
        <div role="alert" className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-400 text-center">
          {error}
        </div>
      )}

      {message && (
        <div role="status" className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 text-center">
          {message}
        </div>
      )}
    </form>
  );
}