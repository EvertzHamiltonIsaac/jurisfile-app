import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/ui/StatusBadge';
import { matters } from '@/Utils/MockData';

const filters = ['All', 'Open', 'In Progress', 'On Hold', 'Closed'];

const typeColors = {
  Labor: 'bg-rose-50 text-rose-600',
  Civil: 'bg-blue-50 text-blue-600',
  Commercial: 'bg-violet-50 text-violet-600',
  Constitutional: 'bg-teal-50 text-teal-600',
  Criminal: 'bg-red-50 text-red-600',
  Family: 'bg-pink-50 text-pink-600',
};

export default function Matters() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = matters.filter((m) => {
    const matchFilter = activeFilter === 'All' || m.status === activeFilter;
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.client.toLowerCase().includes(search.toLowerCase()) ||
      m.caseNumber.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className='p-6 space-y-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-slate-900'>Matters</h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            {matters.length} total matters
          </p>
        </div>
        <Button
          size='sm'
          className='bg-slate-900 hover:bg-slate-700 text-white gap-1.5 h-8 text-xs'
        >
          <Plus className='w-3.5 h-3.5' /> New Matter
        </Button>
      </div>

      {/* Search + Filters */}
      <div className='flex items-center gap-3'>
        <div className='relative flex-1 max-w-xs'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
          <Input
            placeholder='Search matters...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-9 h-8 text-xs bg-gray-50 border-gray-200'
          />
        </div>
        <div className='flex items-center gap-1.5'>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-500 border border-gray-200 hover:border-gray-300 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-100 bg-gray-50/50'>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Number
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Title
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Client
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Type
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Attorney
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Status
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Opened
              </th>
              <th className='px-5 py-3'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className='text-center py-12 text-sm text-slate-400'
                >
                  No matters found.
                </td>
              </tr>
            ) : (
              filtered.map((m, i) => (
                <tr
                  key={m.id}
                  onClick={() => navigate(`/matters/${m.id}`)}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    i !== filtered.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <td className='px-5 py-3.5'>
                    <span className='text-xs font-mono font-medium text-slate-500'>
                      {m.caseNumber}
                    </span>
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs font-medium text-slate-800 max-w-[220px] truncate'>
                      {m.title}
                    </p>
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs text-slate-600 max-w-[160px] truncate'>
                      {m.client}
                    </p>
                  </td>
                  <td className='px-5 py-3.5'>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${typeColors[m.type] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs text-slate-600'>{m.attorney}</p>
                  </td>
                  <td className='px-5 py-3.5'>
                    <StatusBadge status={m.status} />
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs text-slate-400'>{m.openedAt}</p>
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
