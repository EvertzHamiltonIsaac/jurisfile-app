import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Building2, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/ui/StatusBadge';
import { clientsService } from '@/services/Clients.service';

export default function ClientsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id]);

  async function fetchAll() {
    setLoading(true);
    try {
      const [clientRes, casesRes] = await Promise.all([clientsService.getOne(id), clientsService.getClientCases(id)]);
      setClient(clientRes.data);
      setForm(clientRes.data);
      setCases(casesRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSave() {
    setSaving(true);
    try {
      const res = await clientsService.update(id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        id_number: form.id_number,
      });
      setClient(res.data);
      setEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await clientsService.remove(id);
      navigate('/clients');
    } catch (err) {
      alert(err.message);
      setDeleteConfirm(false);
    }
  }

  if (loading)
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin' />
      </div>
    );

  if (error || !client) return <div className='p-6 text-sm text-red-500'>{error || 'Client not found.'}</div>;

  return (
    <div className='p-6 space-y-5'>
      {/* Back */}
      <button onClick={() => navigate('/clients')} className='flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors'>
        <ArrowLeft className='w-3.5 h-3.5' /> Back to Clients
      </button>

      {/* Header */}
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0'>
            {client.type === 'LegalEntity' ? <Building2 className='w-5 h-5 text-slate-500' /> : <User className='w-5 h-5 text-slate-500' />}
          </div>
          <div>
            <h1 className='text-xl font-semibold text-slate-900'>{client.nombre}</h1>
            <p className='text-sm text-slate-500 mt-0.5'>
              {client.type === 'LegalEntity' ? 'Legal Entity' : 'Individual'} · {client.cedula_rnc || 'No ID'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='outline' onClick={() => setEditing(!editing)} className='h-8 text-xs border-gray-200 gap-1.5'>
            <Pencil className='w-3.5 h-3.5' /> Edit
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => setDeleteConfirm(true)}
            className='h-8 text-xs border-red-200 text-red-500 hover:bg-red-50 gap-1.5'
            disabled={cases.length > 0}
            title={cases.length > 0 ? 'Cannot delete a client with active cases' : ''}
          >
            <Trash2 className='w-3.5 h-3.5' /> Delete
          </Button>
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className='flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100'>
          <p className='text-xs text-red-600 flex-1'>This will permanently delete the client. Are you sure?</p>
          <Button size='sm' onClick={handleDelete} className='h-7 text-xs bg-red-500 hover:bg-red-600 text-white'>
            Yes, Delete
          </Button>
          <button onClick={() => setDeleteConfirm(false)} className='text-xs text-slate-400 hover:text-slate-600'>
            Cancel
          </button>
        </div>
      )}

      <div className='grid grid-cols-3 gap-4'>
        {/* Info card */}
        <div className='col-span-1 bg-white rounded-xl border border-gray-100 p-5 space-y-4'>
          <p className='text-xs font-semibold text-slate-500 uppercase tracking-wide'>Contact Info</p>

          {editing ? (
            <div className='space-y-3'>
              <div className='space-y-1'>
                <label className='text-[11px] font-medium text-slate-500'>Name</label>
                <Input value={form.name || ''} onChange={(e) => set('name', e.target.value)} className='h-7 text-xs border-gray-200' />
              </div>
              <div className='space-y-1'>
                <label className='text-[11px] font-medium text-slate-500'>Email</label>
                <Input value={form.email || ''} onChange={(e) => set('email', e.target.value)} className='h-7 text-xs border-gray-200' />
              </div>
              <div className='space-y-1'>
                <label className='text-[11px] font-medium text-slate-500'>Phone</label>
                <Input value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} className='h-7 text-xs border-gray-200' />
              </div>
              <div className='space-y-1'>
                <label className='text-[11px] font-medium text-slate-500'>ID / RNC</label>
                <Input value={form.id_number || ''} onChange={(e) => set('id_number', e.target.value)} className='h-7 text-xs border-gray-200' />
              </div>
              <div className='space-y-1'>
                <label className='text-[11px] font-medium text-slate-500'>Address</label>
                <textarea
                  value={form.address || ''}
                  onChange={(e) => set('address', e.target.value)}
                  rows={2}
                  className='w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none resize-none'
                />
              </div>
              <div className='flex gap-2 pt-1'>
                <Button size='sm' onClick={handleSave} disabled={saving} className='h-7 text-xs bg-slate-900 hover:bg-slate-700 text-white flex-1'>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    setEditing(false);
                    setForm(client);
                  }}
                  className='h-7 text-xs border-gray-200 flex-1'
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className='space-y-3'>
              {[
                { label: 'Email', value: client.email },
                { label: 'Phone', value: client.telefono },
                { label: 'ID/RNC', value: client.cedula_rnc },
                { label: 'Address', value: client.direccion },
                { label: 'Member since', value: new Date(client.creado_en).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className='text-[11px] text-slate-400'>{label}</p>
                  <p className='text-xs text-slate-700 mt-0.5'>{value || '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cases */}
        <div className='col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden'>
          <div className='flex items-center gap-2 px-5 py-3.5 border-b border-gray-100'>
            <Briefcase className='w-3.5 h-3.5 text-slate-400' />
            <p className='text-sm font-medium text-slate-700'>Cases ({cases.length})</p>
          </div>
          <div className='divide-y divide-gray-50'>
            {cases.length === 0 ? (
              <p className='text-center py-10 text-sm text-slate-400'>No cases for this client.</p>
            ) : (
              cases.map((c) => (
                <div
                  key={c.case_id}
                  onClick={() => navigate(`/matters/${c.case_id}`)}
                  className='flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors'
                >
                  <div>
                    <p className='text-xs font-medium text-slate-800'>{c.title}</p>
                    <p className='text-[11px] text-slate-400 mt-0.5'>
                      {c.case_number} · {c.case_type}
                    </p>
                  </div>
                  <StatusBadge status={c.case_status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
