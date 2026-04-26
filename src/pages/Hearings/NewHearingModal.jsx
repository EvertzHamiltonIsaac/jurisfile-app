import { useState } from 'react';
import { X, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { hearingsService } from '@/services/Hearings.service';

const empty = {
  title: '',
  court: '',
  hearing_date: '',
  hearing_time: '09:00',
  description: '',
  notes: '',
};

export default function NewHearingModal({ open, onClose, onCreated, caseId }) {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.title || !form.hearing_date) {
      setError('Title and date are required.');
      return;
    }

    setLoading(true);
    try {
      // Combine date + time into ISO datetime
      const hearing_date = new Date(`${form.hearing_date}T${form.hearing_time}:00`).toISOString();

      const response = await hearingsService.create({
        case_id: caseId,
        title: form.title,
        court: form.court || undefined,
        description: form.description || undefined,
        notes: form.notes || undefined,
        hearing_date,
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
            <h2 className='text-sm font-semibold text-slate-900'>Schedule Hearing</h2>
            <p className='text-xs text-slate-400 mt-0.5'>Add a new hearing to this case</p>
          </div>
          <button onClick={handleCancel} className='w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors'>
            <X className='w-4 h-4 text-slate-500' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5 space-y-4'>
          {/* Icon */}
          <div className='flex justify-center'>
            <div className='w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center'>
              <Gavel className='w-6 h-6 text-amber-500' />
            </div>
          </div>

          {/* Title */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Hearing Title <span className='text-red-400'>*</span>
            </label>
            <Input placeholder='e.g. Preliminary hearing' value={form.title} onChange={(e) => set('title', e.target.value)} className='h-8 text-xs border-gray-200 bg-gray-50' />
          </div>

          {/* Date + Time */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Date <span className='text-red-400'>*</span>
              </label>
              <Input type='date' value={form.hearing_date} onChange={(e) => set('hearing_date', e.target.value)} className='h-8 text-xs border-gray-200 bg-gray-50' />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Time</label>
              <Input type='time' value={form.hearing_time} onChange={(e) => set('hearing_time', e.target.value)} className='h-8 text-xs border-gray-200 bg-gray-50' />
            </div>
          </div>

          {/* Court */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Court / Location</label>
            <Input
              placeholder='e.g. National District Labor Court, Room 3'
              value={form.court}
              onChange={(e) => set('court', e.target.value)}
              className='h-8 text-xs border-gray-200 bg-gray-50'
            />
          </div>

          {/* Notes */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Notes</label>
            <textarea
              placeholder='Additional notes about this hearing...'
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
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
                Scheduling...
              </span>
            ) : (
              'Schedule Hearing'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
