import { useState } from 'react';
import { Plus, Search, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/ui/StatusBadge';
import { hearings } from '@/Utils/MockData';

const filters = ['All', 'Pending', 'Held', 'Postponed', 'Cancelled'];

export default function Hearings() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = hearings
    .filter((h) => {
      const matchFilter = activeFilter === 'All' || h.status === activeFilter;
      const matchSearch =
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        h.matter.toLowerCase().includes(search.toLowerCase()) ||
        h.client.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className='p-6 space-y-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-slate-900'>Hearings</h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            {hearings.filter((h) => h.status === 'Pending').length} upcoming
            hearings
          </p>
        </div>
        <Button
          size='sm'
          className='bg-slate-900 hover:bg-slate-700 text-white gap-1.5 h-8 text-xs'
        >
          <Plus className='w-3.5 h-3.5' /> Schedule Hearing
        </Button>
      </div>

      {/* Search + Filters */}
      <div className='flex items-center gap-3'>
        <div className='relative flex-1 max-w-xs'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
          <Input
            placeholder='Search hearings...'
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

      {/* Hearings list */}
      <div className='space-y-2.5'>
        {filtered.length === 0 ? (
          <div className='bg-white rounded-xl border border-gray-100 py-12 text-center text-sm text-slate-400'>
            No hearings found.
          </div>
        ) : (
          filtered.map((h) => (
            <div
              key={h.id}
              className='bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors'
            >
              <div className='flex items-start justify-between gap-4'>
                {/* Date block */}
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-xl bg-slate-900 flex flex-col items-center justify-center shrink-0 text-white'>
                    <p className='text-[10px] font-medium opacity-60 uppercase'>
                      {new Date(h.date).toLocaleString('en', {
                        month: 'short',
                      })}
                    </p>
                    <p className='text-lg font-bold leading-none'>
                      {new Date(h.date).getDate()}
                    </p>
                  </div>

                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='text-sm font-medium text-slate-900'>
                        {h.title}
                      </p>
                      <StatusBadge status={h.status} />
                    </div>
                    <div className='flex items-center gap-3 text-[11px] text-slate-400'>
                      <span className='font-mono bg-gray-100 px-1.5 py-0.5 rounded text-slate-500'>
                        {h.matter}
                      </span>
                      <span>{h.client}</span>
                    </div>
                    <div className='flex items-center gap-3 text-[11px] text-slate-400 mt-1.5'>
                      <span className='flex items-center gap-1'>
                        <MapPin className='w-3 h-3' />
                        {h.court}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        {h.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attorney */}
                <div className='flex items-center gap-2 shrink-0'>
                  <div className='w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-600'>
                    {h.attorney
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <p className='text-xs text-slate-500'>{h.attorney}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
