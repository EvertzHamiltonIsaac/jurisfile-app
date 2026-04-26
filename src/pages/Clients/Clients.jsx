import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NewClientModal from '@/components/modals/NewClientModal';
import { clientsService } from '@/services/Clients.service';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const res = await clientsService.getAll();
      setClients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  console.log(clients);
  const filtered = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.cedula_rnc?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin' />
      </div>
    );

  return (
    <div className='p-6 space-y-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-slate-900'>Clients</h1>
          <p className='text-sm text-slate-500 mt-0.5'>{clients.length} registered clients</p>
        </div>
        <Button size='sm' onClick={() => setModalOpen(true)} className='bg-slate-900 hover:bg-slate-700 text-white gap-1.5 h-8 text-xs'>
          <Plus className='w-3.5 h-3.5' /> New Client
        </Button>
      </div>

      <NewClientModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={(newClient) => setClients((prev) => [newClient, ...prev])} />

      {/* Search */}
      <div className='relative max-w-xs'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
        <Input placeholder='Search clients...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-9 h-8 text-xs bg-gray-50 border-gray-200' />
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-100 bg-gray-50/50'>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>Client</th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>Type</th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>ID / RNC</th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>Email</th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>Phone</th>
              <th className='px-5 py-3'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className='text-center py-12 text-sm text-slate-400'>
                  No clients found.
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <tr
                  key={c.cliente_id}
                  onClick={() => navigate(`/clients/${c.cliente_id}`)}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <td className='px-5 py-3.5'>
                    <div className='flex items-center gap-2.5'>
                      <div className='w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0'>
                        {c.type === 'LegalEntity' ? <Building2 className='w-3.5 h-3.5 text-slate-500' /> : <User className='w-3.5 h-3.5 text-slate-500' />}
                      </div>
                      <p className='text-xs font-medium text-slate-800'>{c.nombre}</p>
                    </div>
                  </td>
                  <td className='px-5 py-3.5'>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${c.type === 'LegalEntity' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'}`}>
                      {c.type === 'LegalEntity' ? 'Legal Entity' : 'Individual'}
                    </span>
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs font-mono text-slate-500'>{c.cedula_rnc}</p>
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs text-slate-500 truncate max-w-[180px]'>{c.email}</p>
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs text-slate-500'>{c.phone}</p>
                  </td>
                  <td className='px-5 py-3.5'>
                    <ChevronRight className='w-3.5 h-3.5 text-slate-300' />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
