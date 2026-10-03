'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  Building,
  Check,
  Clock,
  Coins,
  Globe,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Palette,
  Phone,
  Save,
  ShieldCheck,
  Smartphone,
  Store,
  Truck,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type SettingsState = {
  system_name: string;
  tagline: string;
  logo_url: string;
  logo_text: string;
  primary_color: string;
  secondary_color: string;
  contact_phone: string;
  alternate_phone: string;
  contact_email: string;
  whatsapp_number: string;
  support_email: string;
  business_address: string;
  business_latitude: number | string;
  business_longitude: number | string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  default_delivery_fee: number | string;
  free_delivery_threshold: number | string;
  commission_rate: number | string;
  minimum_order: number | string;
  maintenance_mode: boolean;
  customer_registration_enabled: boolean;
  cod_enabled: boolean;
  online_payment_enabled: boolean;
  dark_mode_enabled: boolean;
  footer_text: string;
  terms_text: string;
  privacy_text: string;
  cancellation_policy: string;
  delivery_policy: string;
  hero_bg_images: string[];
};

type BusinessHour = {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  second_open_time: string;
  second_close_time: string;
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_SETTINGS: SettingsState = {
  system_name: 'DrinkDrop',
  tagline: 'Drinks → Nearby → Fast Delivery',
  logo_url: '',
  logo_text: 'DD',
  primary_color: '#2563eb',
  secondary_color: '#0f172a',
  contact_phone: '+977 9800000000',
  alternate_phone: '+977 9811111111',
  contact_email: 'info@drinkdrop.com',
  whatsapp_number: '+977 9800000000',
  support_email: 'support@drinkdrop.com',
  business_address: 'Butwal, Rupandehi, Nepal',
  business_latitude: '27.7000',
  business_longitude: '83.4500',
  currency: 'NPR',
  currency_symbol: 'Rs.',
  timezone: 'Asia/Kathmandu',
  default_delivery_fee: 50,
  free_delivery_threshold: 1000,
  commission_rate: 10,
  minimum_order: 100,
  maintenance_mode: false,
  customer_registration_enabled: true,
  cod_enabled: true,
  online_payment_enabled: false,
  dark_mode_enabled: true,
  footer_text: '© 2026 DrinkDrop Inc. Fast & responsible alcohol and beverage delivery.',
  terms_text: 'Customers must be 18+ to order alcoholic beverages. ID verification is strictly performed upon delivery.',
  privacy_text: 'Your privacy is paramount. We store your delivery details safely to process orders.',
  cancellation_policy: 'Orders can be cancelled before rider assignment. Cancellations after dispatch may incur a delivery fee.',
  delivery_policy: 'Standard delivery time is 30-45 minutes within specified operational zones.',
  hero_bg_images: ['', '', '', '', ''],
};

const DEFAULT_HOURS: BusinessHour[] = Array.from({ length: 7 }, (_, i) => ({
  day_of_week: i,
  is_open: true,
  open_time: i === 6 ? '10:00' : '09:00',
  close_time: i === 6 ? '18:00' : '21:00',
  second_open_time: '',
  second_close_time: '',
}));

export function SettingsForm() {
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'hours' | 'financials' | 'policies'>('general');
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [hours, setHours] = useState<BusinessHour[]>(DEFAULT_HOURS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings({
              ...DEFAULT_SETTINGS,
              ...data.settings,
              logo_url: data.settings.logo_url || '',
              logo_text: data.settings.logo_text || 'DD',
              tagline: data.settings.tagline || '',
              contact_phone: data.settings.contact_phone || '',
              alternate_phone: data.settings.alternate_phone || '',
              contact_email: data.settings.contact_email || '',
              whatsapp_number: data.settings.whatsapp_number || '',
              support_email: data.settings.support_email || '',
              business_address: data.settings.business_address || '',
              cancellation_policy: data.settings.cancellation_policy || '',
              delivery_policy: data.settings.delivery_policy || '',
              hero_bg_images: Array.isArray(data.settings.hero_bg_images) && data.settings.hero_bg_images.length > 0
                ? data.settings.hero_bg_images
                : ['', '', '', '', ''],
            });
          }
          if (data.business_hours && Array.isArray(data.business_hours) && data.business_hours.length > 0) {
            const loadedHours = DEFAULT_HOURS.map(defaultH => {
              const found = data.business_hours.find((h: BusinessHour) => h.day_of_week === defaultH.day_of_week);
              if (!found) return defaultH;
              return {
                day_of_week: found.day_of_week,
                is_open: found.is_open ?? true,
                open_time: found.open_time || '',
                close_time: found.close_time || '',
                second_open_time: found.second_open_time || '',
                second_close_time: found.second_close_time || '',
              };
            });
            setHours(loadedHours);
          }
        } else {
          // Client side fallback load directly from supabase if API fail/unauth
          const supabase = getSupabaseBrowserClient();
          if (supabase) {
            const { data: setRes } = await supabase.from('system_settings').select('*').maybeSingle();
            if (setRes) {
              setSettings({ ...DEFAULT_SETTINGS, ...setRes });
            }
            const { data: hrRes } = await supabase.from('business_hours').select('*').order('day_of_week');
            if (hrRes && hrRes.length > 0) {
              setHours(DEFAULT_HOURS.map(dh => {
                const f = hrRes.find((x: BusinessHour) => x.day_of_week === dh.day_of_week);
                return f ? { ...dh, ...f } : dh;
              }));
            }
          }
        }
      } catch (e) {
        console.error('Error loading settings:', e);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleChange = (field: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleHourChange = (dayIndex: number, field: keyof BusinessHour, value: any) => {
    setHours(prev =>
      prev.map(h => (h.day_of_week === dayIndex ? { ...h, [field]: value } : h))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            ...settings,
            default_delivery_fee: Number(settings.default_delivery_fee),
            free_delivery_threshold: Number(settings.free_delivery_threshold),
            commission_rate: Number(settings.commission_rate),
            minimum_order: Number(settings.minimum_order),
            business_latitude: settings.business_latitude ? Number(settings.business_latitude) : null,
            business_longitude: settings.business_longitude ? Number(settings.business_longitude) : null,
          },
          business_hours: hours,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setMessage({ type: 'success', text: 'All website settings and branding saved successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error updating settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white p-12 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <Loader2 className="animate-spin text-blue-600" size={24} />
          <span>Fetching platform settings...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Feedback Banner */}
      {message && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-sm font-semibold shadow-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === 'success' ? <Check size={18} className="text-emerald-600" /> : <AlertTriangle size={18} className="text-red-600" />}
            <span>{message.text}</span>
          </div>
          <button type="button" onClick={() => setMessage(null)} className="text-xs opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'general', label: 'General & Contact', icon: Store },
          { id: 'branding', label: 'Branding & Logo', icon: Palette },
          { id: 'hours', label: 'Business Hours', icon: Clock },
          { id: 'financials', label: 'Pricing & Fees', icon: Coins },
          { id: 'policies', label: 'Legal & Policies', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TABS CONTENT */}

      {/* 1. GENERAL & CONTACT */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">
              <Store className="text-blue-600" size={18} />
              Platform Identity & Store Details
            </h3>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">System / Website Name</label>
                <input
                  type="text"
                  value={settings.system_name}
                  onChange={e => handleChange('system_name', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. DrinkDrop"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-500">Displayed on browser title, navbar, and invoice headers.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Platform Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={e => handleChange('tagline', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. Cold Drinks Delivered Fast"
                />
                <p className="mt-1 text-[11px] text-slate-500">Short slogan shown on home header and meta descriptions.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">HQ / Physical Business Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={settings.business_address}
                    onChange={e => handleChange('business_address', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. Traffic Chowk, Butwal, Nepal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Latitude Coordinate</label>
                <input
                  type="text"
                  value={settings.business_latitude}
                  onChange={e => handleChange('business_latitude', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-800 outline-none focus:border-blue-500"
                  placeholder="27.7000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Longitude Coordinate</label>
                <input
                  type="text"
                  value={settings.business_longitude}
                  onChange={e => handleChange('business_longitude', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-800 outline-none focus:border-blue-500"
                  placeholder="83.4500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">
              <Phone className="text-blue-600" size={18} />
              Contact & Communication Channels
            </h3>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={e => handleChange('contact_phone', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="+977 9800000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Hotline / Support Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={e => handleChange('whatsapp_number', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="+977 9800000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">General Inquiries Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={e => handleChange('contact_email', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="contact@drinkdrop.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Support Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={settings.support_email}
                    onChange={e => handleChange('support_email', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="support@drinkdrop.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">
              <ShieldCheck className="text-blue-600" size={18} />
              System Switches & Operational Modes
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-4 border border-amber-200/60">
                <div>
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <AlertTriangle size={16} className="text-amber-600" />
                    Maintenance Mode
                  </div>
                  <p className="text-xs text-amber-700 mt-0.5">
                    When active, customer order placement is paused with a maintenance notification.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={e => handleChange('maintenance_mode', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Customer Registration Enabled</div>
                  <p className="text-xs text-slate-500 mt-0.5">Allow new customers to sign up for accounts.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.customer_registration_enabled}
                    onChange={e => handleChange('customer_registration_enabled', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BRANDING & LOGO */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">
              <ImageIcon className="text-blue-600" size={18} />
              Website Logo & Visual Branding
            </h3>

            <div className="mt-4 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Logo Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.logo_url}
                    onChange={e => handleChange('logo_url', e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">Provide an absolute URL to your PNG, SVG, or WEBP logo image.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Logo Monogram / Text Fallback</label>
                <input
                  type="text"
                  maxLength={4}
                  value={settings.logo_text}
                  onChange={e => handleChange('logo_text', e.target.value.toUpperCase())}
                  className="w-32 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-center text-sm font-black uppercase text-slate-900 outline-none focus:border-blue-500"
                  placeholder="DD"
                />
                <p className="mt-1 text-[11px] text-slate-500">1-4 letter abbreviation used when logo image is not set.</p>
              </div>

              {/* Logo Preview */}
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-500 mb-2">Live Logo Preview</div>
                <div className="flex items-center gap-4">
                  {settings.logo_url ? (
                    <div className="relative h-12 w-36 overflow-hidden rounded-md border border-slate-200 bg-white p-1">
                      <Image
                        src={settings.logo_url}
                        alt="Website Logo Preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className="grid h-12 w-12 place-items-center rounded-xl font-black text-white shadow-xs text-base"
                      style={{ backgroundColor: settings.primary_color || '#2563eb' }}
                    >
                      {settings.logo_text || 'DD'}
                    </div>
                  )}

                  <div>
                    <div className="font-extrabold text-slate-900 text-base">{settings.system_name || 'DrinkDrop'}</div>
                    <div className="text-xs text-slate-500">{settings.tagline || 'Drinks Delivered Fast'}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Theme Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primary_color}
                      onChange={e => handleChange('primary_color', e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 p-1"
                    />
                    <input
                      type="text"
                      value={settings.primary_color}
                      onChange={e => handleChange('primary_color', e.target.value)}
                      className="w-32 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Theme Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.secondary_color}
                      onChange={e => handleChange('secondary_color', e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 p-1"
                    />
                    <input
                      type="text"
                      value={settings.secondary_color}
                      onChange={e => handleChange('secondary_color', e.target.value)}
                      className="w-32 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* HERO BACKGROUND SLIDER IMAGES (UP TO 5) */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-900">
                    Hero Section Background Sliding Images (5s Auto Slide)
                  </label>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    Up to 5 URLs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Enter image URLs below. These will auto-slide every 5 seconds on the main Barmandoo hero landing page.
                </p>

                <div className="space-y-2.5">
                  {[0, 1, 2, 3, 4].map(idx => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={settings.hero_bg_images?.[idx] || ''}
                        onChange={e => {
                          const newImgs = [...(settings.hero_bg_images || ['', '', '', '', ''])];
                          while (newImgs.length < 5) newImgs.push('');
                          newImgs[idx] = e.target.value;
                          handleChange('hero_bg_images', newImgs);
                        }}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white font-mono"
                        placeholder={`Hero Background Image URL #${idx + 1} (e.g. https://.../bg${idx + 1}.jpg)`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BUSINESS HOURS */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Clock className="text-blue-600" size={18} />
                  Operating Hours & Schedule
                </h3>
                <p className="text-xs text-slate-500">Configure weekly order acceptance window. Customers see live Open/Closed status.</p>
              </div>
              <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Timezone: {settings.timezone}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {hours.map(hour => {
                const dayName = DAY_NAMES[hour.day_of_week];
                return (
                  <div
                    key={hour.day_of_week}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl p-3.5 border transition ${
                      hour.is_open ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-36">
                      <input
                        type="checkbox"
                        checked={hour.is_open}
                        onChange={e => handleHourChange(hour.day_of_week, 'is_open', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-bold text-slate-900">{dayName}</span>
                    </div>

                    {hour.is_open ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span>Opening:</span>
                          <input
                            type="time"
                            value={hour.open_time}
                            onChange={e => handleHourChange(hour.day_of_week, 'open_time', e.target.value)}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span>Closing:</span>
                          <input
                            type="time"
                            value={hour.close_time}
                            onChange={e => handleHourChange(hour.day_of_week, 'close_time', e.target.value)}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">Closed all day</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. FINANCIALS & FEES */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">
              <Coins className="text-blue-600" size={18} />
              Currency, Fees & Order Limits
            </h3>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Currency Code</label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={e => handleChange('currency', e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono font-bold text-slate-900 uppercase"
                  placeholder="NPR"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={settings.currency_symbol}
                  onChange={e => handleChange('currency_symbol', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900"
                  placeholder="Rs."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Standard Delivery Fee ({settings.currency_symbol})</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={settings.default_delivery_fee}
                  onChange={e => handleChange('default_delivery_fee', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900"
                />
                <p className="mt-1 text-[11px] text-slate-500">Base delivery charge added to customer checkout.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Free Delivery Minimum Amount ({settings.currency_symbol})</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={settings.free_delivery_threshold}
                  onChange={e => handleChange('free_delivery_threshold', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900"
                />
                <p className="mt-1 text-[11px] text-slate-500">Orders exceeding this amount receive free delivery.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Amount ({settings.currency_symbol})</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={settings.minimum_order}
                  onChange={e => handleChange('minimum_order', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Platform Commission Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={settings.commission_rate}
                  onChange={e => handleChange('commission_rate', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900"
                />
                <p className="mt-1 text-[11px] text-slate-500">Default percentage deducted from dealer order sales.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">
              <Coins className="text-blue-600" size={18} />
              Payment Gateways & Methods
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Cash On Delivery (COD)</div>
                  <p className="text-xs text-slate-500 mt-0.5">Allow riders to collect physical cash upon delivery.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.cod_enabled}
                    onChange={e => handleChange('cod_enabled', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Online Digital Payments (eSewa / Khalti / Fonepay)</div>
                  <p className="text-xs text-slate-500 mt-0.5">Enable digital wallet and QR code checkout options.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.online_payment_enabled}
                    onChange={e => handleChange('online_payment_enabled', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. POLICIES & LEGAL */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">
              <FileText className="text-blue-600" size={18} />
              Website Footer, Terms & Operational Policies
            </h3>

            <div className="mt-4 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Footer Copyright Notice</label>
                <input
                  type="text"
                  value={settings.footer_text}
                  onChange={e => handleChange('footer_text', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Terms of Service / Age Restriction Disclaimer</label>
                <textarea
                  rows={3}
                  value={settings.terms_text}
                  onChange={e => handleChange('terms_text', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cancellation & Refund Policy</label>
                <textarea
                  rows={3}
                  value={settings.cancellation_policy}
                  onChange={e => handleChange('cancellation_policy', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Policy & SLA</label>
                <textarea
                  rows={3}
                  value={settings.delivery_policy}
                  onChange={e => handleChange('delivery_policy', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white shadow-xl">
        <div className="hidden sm:block text-xs text-slate-400">
          Make sure to save changes before navigating away.
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Website Settings
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
