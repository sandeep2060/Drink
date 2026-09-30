'use client';

import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Home,
  MapPin,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { BUTWAL_ZONES, DeliveryAddress } from '@/lib/catalog-store';

interface AddressesViewProps {
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress;
  onSelectAddress: (address: DeliveryAddress) => void;
  onAddNewAddress: (address: Omit<DeliveryAddress, 'id'>) => DeliveryAddress;
  onDeleteAddress: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

export function AddressesView({
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
  onDeleteAddress,
  onSetDefault,
}: AddressesViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [label, setLabel] = useState('Home');
  const [zone, setZone] = useState(BUTWAL_ZONES[0]);
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('+977 9801234567');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!addressLine.trim()) return;

    const created = onAddNewAddress({
      label,
      zone,
      addressLine: addressLine.trim(),
      landmark: landmark.trim() || undefined,
      phone: phone.trim(),
      isDefault: false,
    });
    onSelectAddress(created);
    setShowAddModal(false);
    setAddressLine('');
    setLandmark('');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Saved Delivery Locations</h2>
          <p className="text-xs text-slate-500">Manage your delivery addresses in Butwal and nearby zones</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition w-fit"
        >
          <Plus size={16} /> Add New Location
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {addresses.map(addr => {
          const isSelected = selectedAddress.id === addr.id;

          return (
            <div
              key={addr.id}
              className={`relative flex flex-col justify-between rounded-3xl border p-5 transition shadow-xs ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-100'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700">
                      <Home size={16} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{addr.label}</h4>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {addr.zone}
                      </span>
                    </div>
                  </div>

                  {addr.isDefault && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Default
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-700 leading-relaxed font-medium">
                  {addr.addressLine}
                </p>

                {addr.landmark && (
                  <p className="mt-1 text-[11px] text-slate-400">Landmark: {addr.landmark}</p>
                )}

                <p className="mt-2 text-[11px] text-slate-500">Contact: {addr.phone}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                {isSelected ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-700">
                    <CheckCircle2 size={14} /> Currently Delivering Here
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectAddress(addr)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Deliver to this address
                  </button>
                )}

                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => onSetDefault(addr.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      Make Default
                    </button>
                  )}
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteAddress(addr.id)}
                      className="text-slate-400 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add New Delivery Address</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tag / Label</label>
                  <select
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Party Venue">Party Venue</option>
                    <option value="Friends Place">Friend&apos;s Place</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Butwal Zone</label>
                  <select
                    value={zone}
                    onChange={e => setZone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                  >
                    {BUTWAL_ZONES.map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street / House Address
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                  placeholder="e.g. Ward 6, Traffic Chowk Road, House #42"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  placeholder="e.g. Behind Hotel Avenue, Opposite Nepal Telecom"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
