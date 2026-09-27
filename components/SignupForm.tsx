'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { bsToAd } from '@sbmdkl/nepali-date-converter';
import { getSupabaseBrowserClient, getSupabaseBrowserConfigError } from '@/lib/supabase';

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
    <form onSubmit={submit} className="space-y-4">
      <label className="block space-y-1.5 text-sm font-medium text-slate-700">
        Full name
        <input className="input" type="text" autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} required />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-slate-700">
        Email
        <input className="input" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-slate-700">
        Nepali mobile number
        <input className="input" type="tel" autoComplete="tel" placeholder="98XXXXXXXX or +977 98XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} required />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-slate-700">
        Gender
        <select className="input" value={gender} onChange={e => setGender(e.target.value)} required>
          <option value="" disabled>Select gender</option>
          <option value="FEMALE">Female</option>
          <option value="MALE">Male</option>
          <option value="NON_BINARY">Non-binary</option>
          <option value="OTHER">Other</option>
          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
        </select>
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-slate-700">
        Date of birth (Bikram Sambat)
        <input className="input" type="text" inputMode="numeric" autoComplete="bday" placeholder="YYYY-MM-DD (e.g. 2063-05-12)" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" value={dateOfBirthBs} onChange={e => setDateOfBirthBs(e.target.value)} required />
      </label>
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-700">Sign-up location</div>
        <button type="button" className="btn-secondary w-full" onClick={captureLocation} disabled={busy || capturingLocation}>
          {capturingLocation ? 'Getting your location...' : location ? 'Refresh current location' : 'Share current location'}
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Your browser will ask permission. Coordinates are saved with your account; location access is required to sign up.
          {location && ` Location captured (about ${Math.round(location.accuracy)} m accuracy).`}
        </p>
      </div>
      <label className="block space-y-1.5 text-sm font-medium text-slate-700">
        Password
        <input className="input" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-slate-700">
        Confirm password
        <input className="input" type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={6} required />
      </label>
      <button disabled={busy || capturingLocation} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? 'Creating account...' : 'Create customer account'}
      </button>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {message && <p role="status" className="text-sm text-green-700">{message}</p>}
    </form>
  );
}