'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Phone,
  Plus,
  QrCode,
  ShieldCheck,
  Truck,
  User,
  Wallet,
  X,
} from 'lucide-react';
import {
  BUTWAL_ZONES,
  CartItem,
  DeliveryAddress,
  Order,
  createCustomerOrder,
} from '@/lib/catalog-store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  savedAddresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress;
  onSelectAddress: (address: DeliveryAddress) => void;
  onAddNewAddress: (address: Omit<DeliveryAddress, 'id'>) => DeliveryAddress;
  orderNotes: string;
  onOrderSuccess: (order: Order) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  savedAddresses,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
  orderNotes,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('Sandeep Sharma');
  const [customerPhone, setCustomerPhone] = useState('+977 9801234567');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'FONEPAY_QR'>('COD');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  // Address add form modal state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newZone, setNewZone] = useState(BUTWAL_ZONES[0]);
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPhone, setNewPhone] = useState('+977 9801234567');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + deliveryFee;

  function handleCreateAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!newAddressLine.trim()) return;

    const created = onAddNewAddress({
      label: newLabel,
      zone: newZone,
      addressLine: newAddressLine.trim(),
      landmark: newLandmark.trim() || undefined,
      phone: newPhone.trim(),
      isDefault: false,
    });
    onSelectAddress(created);
    setShowAddAddress(false);
    setNewAddressLine('');
    setNewLandmark('');
  }

  async function handlePlaceOrder() {
    setError('');
    if (!customerName.trim()) {
      setError('Please provide your name for delivery.');
      return;
    }
    if (!customerPhone.trim() || !customerPhone.includes('9')) {
      setError('Please enter a valid Nepali mobile phone number.');
      return;
    }
    if (!ageConfirmed) {
      setError('You must confirm you are 18 or older to complete order placement.');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Simulate quick secure order registration
      await new Promise(resolve => setTimeout(resolve, 800));

      const order = createCustomerOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: selectedAddress,
        items,
        paymentMethod,
        notes: orderNotes,
      });

      setIsPlacingOrder(false);
      onOrderSuccess(order);
    } catch {
      setError('An error occurred while creating your order. Please try again.');
      setIsPlacingOrder(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative z-10 my-8 w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-700">
              <Truck size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Checkout & Delivery</h3>
              <p className="text-xs text-slate-500">Fast delivery within Butwal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Details */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <User size={14} className="text-blue-600" /> Customer Information
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. Ramesh Thapa"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <MapPin size={14} className="text-blue-600" /> Delivery Address in Butwal
              </h4>
              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} /> Add New
              </button>
            </div>

            {/* New Address Form Toggle */}
            {showAddAddress ? (
              <form onSubmit={handleCreateAddress} className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 space-y-3 mb-3">
                <h5 className="font-bold text-xs text-blue-900">Add New Delivery Location</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Label</label>
                    <select
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs outline-none"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Party Venue">Party Venue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Butwal Zone</label>
                    <select
                      value={newZone}
                      onChange={e => setNewZone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs outline-none"
                    >
                      {BUTWAL_ZONES.map(z => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street / House Address</label>
                  <input
                    type="text"
                    value={newAddressLine}
                    onChange={e => setNewAddressLine(e.target.value)}
                    placeholder="e.g. Ward 8, Kalikanagar, Near Siddhartha Bank"
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nearby Landmark (Optional)</label>
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={e => setNewLandmark(e.target.value)}
                    placeholder="e.g. Next to Bhatbhateni, Blue gate"
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="rounded-lg px-3 py-1 text-xs text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            ) : null}

            {/* Saved Addresses Radio Group */}
            <div className="space-y-2">
              {savedAddresses.map(addr => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <label
                    key={addr.id}
                    onClick={() => onSelectAddress(addr)}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_address"
                      checked={isSelected}
                      onChange={() => onSelectAddress(addr)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{addr.label}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                          {addr.zone}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-snug">{addr.addressLine}</p>
                      {addr.landmark && (
                        <p className="mt-0.5 text-[11px] text-slate-400">Landmark: {addr.landmark}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Delivery Speed Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-600">
                <Clock3 size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Express Drinks Run</div>
                <div className="text-[11px] text-slate-500">Chilled & delivered in 30-45 minutes</div>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Active Now
            </span>
          </div>

          {/* Payment Method */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <Wallet size={14} className="text-blue-600" /> Payment Option
            </h4>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {/* COD */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                  paymentMethod === 'COD'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-100'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="text-blue-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-slate-500">Pay cash upon rider arrival</div>
                </div>
              </label>

              {/* Fonepay / QR */}
              <label
                onClick={() => setPaymentMethod('FONEPAY_QR')}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                  paymentMethod === 'FONEPAY_QR'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-100'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'FONEPAY_QR'}
                  onChange={() => setPaymentMethod('FONEPAY_QR')}
                  className="text-blue-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <QrCode size={13} className="text-emerald-600" /> Fonepay / eSewa QR
                  </div>
                  <div className="text-[11px] text-slate-500">Scan rider’s QR upon delivery</div>
                </div>
              </label>
            </div>
          </div>

          {/* Age Compliance Declaration Checkbox */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={e => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck size={14} className="text-amber-700 inline" /> 18+ Age Declaration:
                </span>
                I confirm that I am 18 years of age or older. I understand that our riders may verify a government photo ID upon delivery for alcoholic drinks in accordance with Nepal regulations.
              </div>
            </label>
          </div>

          {/* Order Summary Breakdown */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-700">Order Summary ({items.length} items)</div>
            <div className="flex justify-between text-slate-500">
              <span>Items Subtotal</span>
              <span>Rs. {subtotal.toLocaleString('en-NP')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total to Pay</span>
              <span>Rs. {total.toLocaleString('en-NP')}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-5">
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || !ageConfirmed}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isPlacingOrder ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Securing & Placing Order...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Confirm & Place Order · Rs. {total.toLocaleString('en-NP')} <ArrowRight size={17} />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
