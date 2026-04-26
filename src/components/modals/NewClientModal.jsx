import { useState } from 'react';
import { X, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clientsService } from '@/services/Clients.service';

const empty = {
  name: '',
  type: 'Individual',
  id_number: '',
  email: '',
  phone: '',
  address: '',
};

export default function NewClientModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.name) {
      setError('Name is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await clientsService.create(form);
      onCreated?.(response.data);
      setForm(empty);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(empty);
    setError('');
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <div>
            <h2 className='text-sm font-semibold text-slate-900'>New Client</h2>
            <p className='text-xs text-slate-400 mt-0.5'>Register a new client</p>
          </div>
          <button onClick={handleCancel} className='w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors'>
            <X className='w-4 h-4 text-slate-500' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5 space-y-4'>
          {/* Type selector */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Client Type <span className='text-red-400'>*</span>
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {[
                { value: 'Fisica', label: 'Fisica', Icon: User },
                { value: 'Juridica', label: 'Juridica', Icon: Building2 },
              ].map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => set('type', value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                    form.type === value ? 'border-slate-900 bg-slate-900 text-white' : 'border-gray-200 text-slate-500 hover:border-gray-300'
                  }`}
                >
                  <Icon className='w-3.5 h-3.5' />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              {form.type === 'Individual' ? 'Full Name' : 'Company Name'} <span className='text-red-400'>*</span>
            </label>
            <Input
              placeholder={form.type === 'Individual' ? 'John Doe' : 'Acme Corp S.R.L.'}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className='h-8 text-xs border-gray-200 bg-gray-50'
            />
          </div>

          {/* ID / RNC */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>{form.type === 'Individual' ? 'National ID (Cédula)' : 'Tax ID (RNC)'}</label>
            <Input
              placeholder={form.type === 'Individual' ? '001-0000000-0' : '1-00-00000-0'}
              value={form.id_number}
              onChange={(e) => set('id_number', e.target.value)}
              className='h-8 text-xs border-gray-200 bg-gray-50'
            />
          </div>

          {/* Email + Phone */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Email</label>
              <Input
                type='email'
                placeholder='email@example.com'
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className='h-8 text-xs border-gray-200 bg-gray-50'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Phone</label>
              <Input placeholder='809-000-0000' value={form.phone} onChange={(e) => set('phone', e.target.value)} className='h-8 text-xs border-gray-200 bg-gray-50' />
            </div>
          </div>

          {/* Address */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Address</label>
            <textarea
              placeholder='Street, City, Province...'
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              rows={2}
              className='w-full text-xs border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-slate-400 resize-none'
            />
          </div>

          {error && <p className='text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2'>{error}</p>}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50/50'>
          <Button variant='outline' size='sm' onClick={handleCancel} className='h-8 text-xs border-gray-200 text-slate-600'>
            Cancel
          </Button>
          <Button size='sm' onClick={handleSubmit} disabled={loading} className='h-8 text-xs bg-slate-900 hover:bg-slate-700 text-white gap-1.5 disabled:opacity-40'>
            {loading ? (
              <span className='flex items-center gap-1.5'>
                <span className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Saving...
              </span>
            ) : (
              'Save Client'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
