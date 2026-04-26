import { useState, useEffect } from 'react';
import { X, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { casesService } from '@/services/Cases.service';
import { clientsService } from '@/services/Clients.service';

const CASE_TYPES = [
  { id: 1, name: 'Civil' },
  { id: 2, name: 'Penal' },
  { id: 3, name: 'Laboral' },
  { id: 4, name: 'Mercantil' },
  { id: 5, name: 'Familia' },
  { id: 6, name: 'Constitutional' },
  { id: 7, name: 'Administrativo' },
];

const CASE_STATUSES = [
  { id: 1, name: 'Abierto' },
  { id: 2, name: 'En Proceso' },
  { id: 3, name: 'En Espera' },
  { id: 4, name: 'En Cerrado' },
  { id: 5, name: 'Archivado' },
];

const empty = {
  case_number: '',
  title: '',
  client_id: '',
  case_type_id: '',
  case_status_id: '1',
  description: '',
  opened_at: new Date().toISOString().split('T')[0],
};

export default function NewMatterModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(empty);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load clients for the dropdown
  useEffect(() => {
    if (!open) return;
    clientsService
      .getAll()
      .then((r) => setClients(r.data))
      .catch(() => {});
  }, [open]);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  console.log(form);
  const handleSubmit = async () => {
    if (!form.case_number || !form.title || !form.client_id || !form.case_type_id) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await casesService.create({
        ...form,
        client_id: parseInt(form.client_id),
        case_type_id: parseInt(form.case_type_id),
        case_status_id: parseInt(form.case_status_id),
      });
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
            <h2 className='text-sm font-semibold text-slate-900'>New Matter</h2>
            <p className='text-xs text-slate-400 mt-0.5'>Create a new legal case</p>
          </div>
          <button onClick={handleCancel} className='w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors'>
            <X className='w-4 h-4 text-slate-500' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto'>
          {/* Icon */}
          <div className='flex justify-center'>
            <div className='w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center'>
              <Briefcase className='w-6 h-6 text-slate-500' />
            </div>
          </div>

          {/* Case Number + Title */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Case Number <span className='text-red-400'>*</span>
              </label>
              <Input placeholder='2024-001' value={form.case_number} onChange={(e) => set('case_number', e.target.value)} className='h-8 text-xs border-gray-200 bg-gray-50' />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Opened Date</label>
              <Input type='date' value={form.opened_at} onChange={(e) => set('opened_at', e.target.value)} className='h-8 text-xs border-gray-200 bg-gray-50' />
            </div>
          </div>

          {/* Title */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Title <span className='text-red-400'>*</span>
            </label>
            <Input
              placeholder='Brief description of the case'
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className='h-8 text-xs border-gray-200 bg-gray-50'
            />
          </div>

          {/* Client */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Client <span className='text-red-400'>*</span>
            </label>
            <select
              value={form.client_id}
              onChange={(e) => set('client_id', e.target.value)}
              className='w-full h-8 text-xs border border-gray-200 bg-gray-50 rounded-lg px-3 text-slate-700 focus:outline-none focus:border-slate-400'
            >
              <option value=''>Select a client...</option>
              {clients.map((c) => (
                <option key={c.cliente_id} value={c.cliente_id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Type + Status */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Type <span className='text-red-400'>*</span>
              </label>
              <select
                value={form.case_type_id}
                onChange={(e) => set('case_type_id', e.target.value)}
                className='w-full h-8 text-xs border border-gray-200 bg-gray-50 rounded-lg px-3 text-slate-700 focus:outline-none focus:border-slate-400'
              >
                <option value=''>Select type...</option>
                {CASE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Status</label>
              <select
                value={form.case_status_id}
                onChange={(e) => set('case_status_id', e.target.value)}
                className='w-full h-8 text-xs border border-gray-200 bg-gray-50 rounded-lg px-3 text-slate-700 focus:outline-none focus:border-slate-400'
              >
                {CASE_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Description</label>
            <textarea
              placeholder='Brief description of the case...'
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
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
                Creating...
              </span>
            ) : (
              'Create Matter'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
