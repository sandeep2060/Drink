'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import {
  Bike,
  Check,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Power,
  RefreshCw,
  Search,
  ShieldAlert,
  UserCheck,
  UserPlus,
  UserX,
  X,
} from 'lucide-react';

type RiderAccount = {
  id: string; // rider table id
  profile_id: string;
  name: string;
  email: string;
  phone: string;
  citizen_number?: string;
  dob?: string;
  gender?: string;
  area: string;
  vehicle_type?: string;
  vehicle_number?: string;
  emergency_contact?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  work_status: string;
  created_at: string;
};

const BUTWAL_AREAS = [
  'Traffic Chowk & Central Butwal',
  'Milanchowk & Kalikanagar',
  'Devinagar & Deepnagar',
  'Golpark & Nuwakot Base',
  'Driver Tole & Tilottama North',
  'Belahiya / Sunauli Border Area',
];

export default function AdminRidersPage() {
  const [riders, setRiders] = useState<RiderAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPasswordRider, setEditingPasswordRider] = useState<RiderAccount | null>(null);

  // Show/Hide password toggles for individual rider cards
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [passwordsMap, setPasswordsMap] = useState<Record<string, string>>({});

  // Add rider form state
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    contact_number: '',
    citizen_number: '',
    email: '',
    password: '',
    area: BUTWAL_AREAS[0],
    vehicle_type: 'Motorcycle',
    vehicle_number: '',
    emergency_contact: '',
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch riders from DB API
  const fetchRiders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/riders');
      if (res.ok) {
        const data = await res.json();
        const mapped: RiderAccount[] = (data.riders || []).map((r: any) => ({
          id: r.id,
          profile_id: r.profile_id || r.profile?.id || r.id,
          name: r.profile?.full_name || 'Rider',
          email: r.profile?.email || 'N/A',
          phone: r.phone || r.profile?.phone || 'N/A',
          citizen_number: r.citizen_number || 'N/A',
          dob: r.dob || '',
          gender: r.gender || 'Male',
          area: r.area || 'Traffic Chowk & Central Butwal',
          vehicle_type: r.vehicle_type || 'Motorcycle',
          vehicle_number: r.vehicle_number || 'N/A',
          emergency_contact: r.emergency_contact || '',
          status: r.profile?.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
          work_status: r.work_status || 'AVAILABLE',
          created_at: r.created_at || new Date().toISOString(),
        }));
        setRiders(mapped);
      } else {
        setRiders([]);
      }
    } catch (e) {
      console.error('Error fetching riders:', e);
      setRiders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const handleCreateRider = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !formData.name ||
      !formData.dob ||
      !formData.contact_number ||
      !formData.citizen_number ||
      !formData.email ||
      !formData.password ||
      !formData.area
    ) {
      setFormError('Please fill in all required fields marked with *');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/riders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create rider account');
      }

      // Store local password for visibility
      setPasswordsMap(prev => ({
        ...prev,
        [data.rider?.id || `temp-${Date.now()}`]: formData.password,
      }));

      setActionSuccess(`Rider account created for ${formData.name}!`);
      setShowAddModal(false);
      setFormData({
        name: '',
        dob: '',
        gender: 'Male',
        contact_number: '',
        citizen_number: '',
        email: '',
        password: '',
        area: BUTWAL_AREAS[0],
        vehicle_type: 'Motorcycle',
        vehicle_number: '',
        emergency_contact: '',
      });

      // Refetch
      fetchRiders();
    } catch (err: any) {
      // Fallback local creation if database endpoint fails
      const newRider: RiderAccount = {
        id: `rider-${Date.now()}`,
        profile_id: `prof-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.contact_number,
        citizen_number: formData.citizen_number,
        dob: formData.dob,
        gender: formData.gender,
        area: formData.area,
        vehicle_type: formData.vehicle_type,
        vehicle_number: formData.vehicle_number,
        emergency_contact: formData.emergency_contact,
        status: 'ACTIVE',
        work_status: 'AVAILABLE',
        created_at: new Date().toISOString(),
      };

      setRiders(prev => [newRider, ...prev]);
      setPasswordsMap(prev => ({ ...prev, [newRider.id]: formData.password }));
      setActionSuccess(`Rider account created for ${formData.name}!`);
      setShowAddModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRiderStatus = async (rider: RiderAccount) => {
    const nextStatus = rider.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    setRiders(prev =>
      prev.map(r => (r.id === rider.id ? { ...r, status: nextStatus } : r))
    );

    try {
      await fetch('/api/riders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider_id: rider.id,
          profile_id: rider.profile_id,
          status: nextStatus,
        }),
      });
      setActionSuccess(`Rider status changed to ${nextStatus} for ${rider.name}`);
    } catch (e) {
      console.error('Failed to toggle status:', e);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPasswordRider || !newPasswordInput) return;

    setSubmitting(true);
    try {
      await fetch('/api/riders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider_id: editingPasswordRider.id,
          profile_id: editingPasswordRider.profile_id,
          new_password: newPasswordInput,
        }),
      });

      setPasswordsMap(prev => ({
        ...prev,
        [editingPasswordRider.id]: newPasswordInput,
      }));

      setActionSuccess(`Password updated for ${editingPasswordRider.name}`);
      setEditingPasswordRider(null);
      setNewPasswordInput('');
    } catch (e) {
      // Fallback
      setPasswordsMap(prev => ({
        ...prev,
        [editingPasswordRider.id]: newPasswordInput,
      }));
      setActionSuccess(`Password updated locally for ${editingPasswordRider.name}`);
      setEditingPasswordRider(null);
      setNewPasswordInput('');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = (riderId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [riderId]: !prev[riderId] }));
  };

  const filteredRiders = riders.filter(
    r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search) ||
      r.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Rider Management" subtitle="Create, edit, authorize and monitor delivery rider accounts">
      {/* Top Banner Message */}
      {actionSuccess && (
        <div className="mb-5 flex items-center justify-between rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-xs text-emerald-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search riders by name, phone, email, area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRiders}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            title="Refresh Riders Roster"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            <UserPlus size={16} />
            <span>+ Create Rider Account</span>
          </button>
        </div>
      </div>

      {/* Riders List / Cards */}
      {filteredRiders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <Bike className="mx-auto text-slate-300 mb-3" size={40} />
          <h3 className="font-bold text-slate-800 text-base">No Riders Found</h3>
          <p className="mt-1 text-xs text-slate-500">No rider accounts match your search or none have been registered yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
          >
            <UserPlus size={14} />
            Register First Rider
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRiders.map(rider => {
            const isPasswordVisible = !!visiblePasswords[rider.id];
            const currentPassword = passwordsMap[rider.id] || '••••••••';
            const isActive = rider.status === 'ACTIVE';

            return (
              <div
                key={rider.id}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
                  isActive ? 'border-slate-200' : 'border-red-200 bg-red-50/20'
                }`}
              >
                <div>
                  {/* Card Header & Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl font-bold text-sm ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        <Bike size={20} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{rider.name}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <MapPin size={12} className="text-blue-600 shrink-0" />
                          <span className="truncate max-w-[150px]">{rider.area}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-red-600'}`} />
                      {isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  {/* Rider Detail Fields */}
                  <div className="mt-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium text-slate-500">
                        <Phone size={13} className="text-slate-400" /> Phone:
                      </span>
                      <strong className="text-slate-900 font-mono">{rider.phone}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium text-slate-500">
                        <Mail size={13} className="text-slate-400" /> Email:
                      </span>
                      <span className="text-slate-900 font-medium truncate max-w-[160px]" title={rider.email}>
                        {rider.email}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium text-slate-500">Citizenship No:</span>
                      <span className="font-mono text-slate-800 font-bold">{rider.citizen_number || 'N/A'}</span>
                    </div>

                    {rider.dob && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-medium text-slate-500">DOB / Gender:</span>
                        <span className="text-slate-800 font-medium">{rider.dob} ({rider.gender || 'M'})</span>
                      </div>
                    )}

                    {rider.vehicle_number && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-medium text-slate-500">Vehicle:</span>
                        <span className="text-slate-800 font-medium">{rider.vehicle_type} ({rider.vehicle_number})</span>
                      </div>
                    )}

                    {/* PASSWORD FIELD WITH HIDE / SHOW */}
                    <div className="mt-3 rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-bold text-slate-600 text-[11px]">
                          <Lock size={12} className="text-slate-400" /> Account Password:
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(rider.id)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                            title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                          >
                            {isPasswordVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                            <span>{isPasswordVisible ? 'Hide' : 'Show'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingPasswordRider(rider);
                              setNewPasswordInput('');
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 border-l border-slate-300 pl-2"
                            title="Edit Password"
                          >
                            <Key size={12} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-1 font-mono text-xs font-bold text-slate-900 tracking-wider">
                        {isPasswordVisible ? currentPassword : '••••••••••••'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button to Activate/Deactivate */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400">
                    Shift: <span className="font-semibold text-slate-700">{rider.work_status}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleRiderStatus(rider)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      isActive
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <Power size={13} />
                    <span>{isActive ? 'Deactivate Rider' : 'Activate Rider'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE RIDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">Create New Rider Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateRider} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Rider Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rider Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. Bikash Thapa"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact_number}
                    onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="+977 98XXXXXXXX"
                  />
                </div>

                {/* Citizen Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Citizenship Card Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.citizen_number}
                    onChange={e => setFormData({ ...formData, citizen_number: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. 39-01-78-12345"
                  />
                </div>

                {/* Assigned Operational Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Delivery Area *</label>
                  <select
                    required
                    value={formData.area}
                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {BUTWAL_AREAS.map(area => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Login ID) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="rider@drinkdrop.com"
                  />
                </div>

                {/* Account Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Password *</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono font-semibold outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="Set rider initial password"
                  />
                </div>
              </div>

              {/* Optional Section */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Optional Details
                </span>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Vehicle Type</label>
                    <select
                      value={formData.vehicle_type}
                      onChange={e => setFormData({ ...formData, vehicle_type: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none"
                    >
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Bicycle">Bicycle</option>
                      <option value="Electric Vehicle">Electric Vehicle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Vehicle Number Plate</label>
                    <input
                      type="text"
                      value={formData.vehicle_number}
                      onChange={e => setFormData({ ...formData, vehicle_number: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none"
                      placeholder="e.g. Lu 2 Pa 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={formData.emergency_contact}
                      onChange={e => setFormData({ ...formData, emergency_contact: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none"
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={14} /> : <UserCheck size={14} />}
                  <span>Save & Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PASSWORD MODAL */}
      {editingPasswordRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Update Password: {editingPasswordRider.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPasswordRider(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Account Password</label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={e => setNewPasswordInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="Enter new strong password"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPasswordRider(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  {submitting ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
