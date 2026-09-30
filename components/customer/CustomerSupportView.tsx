'use client';

import {
  Clock3,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export function CustomerSupportView() {
  const faqs = [
    {
      q: 'How fast will my drinks arrive in Butwal?',
      a: 'We deliver within 30 to 45 minutes across all primary Butwal zones including Traffic Chowk, Milanchowk, Kalikanagar, Devinagar, Golpark, and Deepnagar.',
    },
    {
      q: 'Are the beers and sodas guaranteed to be cold?',
      a: 'Yes! All beers, soft drinks, and sodas marked with the "Chilled" badge are maintained in commercial refrigeration units at our dealer depots and dispatched in insulated cooler bags.',
    },
    {
      q: 'What payment options do you support?',
      a: 'We accept Cash on Delivery (COD) as well as instantaneous Fonepay, eSewa, and Khalti QR scans with our riders at your doorstep.',
    },
    {
      q: 'Do you require age verification upon delivery?',
      a: 'Yes, DrinkDrop operates in strict accordance with Nepal regulations. If your order contains alcoholic beverages (beer, rum, whiskey, wine), our rider may ask to verify a valid government photo ID confirming you are 18+.',
    },
    {
      q: 'How does free delivery work?',
      a: 'Orders with a subtotal of Rs. 1,000 or above automatically qualify for free delivery across Butwal. For smaller orders, a nominal base fee of Rs. 50 applies.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Help & Butwal Dispatch Support</h2>
        <p className="text-xs text-slate-500">Contact our local operations team or read delivery guidelines</p>
      </div>

      {/* Support Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Hotline */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-600 mb-3">
              <Phone size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Butwal Operations Hotline</h3>
            <p className="mt-1 text-xs text-slate-500">For active order status, address adjustments or inquiries.</p>
          </div>
          <a
            href="tel:+9779800000000"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            <Phone size={14} /> Call +977 9800000000
          </a>
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 mb-3">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">WhatsApp Dispatch Desk</h3>
            <p className="mt-1 text-xs text-slate-500">Fast assistance for bulk party orders and location pins.</p>
          </div>
          <a
            href="https://wa.me/9779800000000"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
          >
            <MessageSquare size={14} /> Chat on WhatsApp
          </a>
        </div>

        {/* Hub Office */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700 mb-3">
              <MapPin size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Central Hub & Hours</h3>
            <p className="mt-1 text-xs text-slate-500">Traffic Chowk, Ward 6, Butwal, Lumbini Province</p>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600">
            <Clock3 size={15} className="text-amber-600" />
            <span>Open daily: 9:00 AM – 9:00 PM</span>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="flex items-center gap-2 font-black text-base text-slate-900 mb-4">
          <HelpCircle size={18} className="text-blue-600" /> Frequently Asked Questions
        </h3>

        <div className="space-y-3 divide-y divide-slate-100">
          {faqs.map(faq => (
            <div key={faq.q} className="pt-3 first:pt-0">
              <h4 className="text-xs font-bold text-slate-800">{faq.q}</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
