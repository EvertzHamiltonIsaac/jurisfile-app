import {
  Briefcase,
  Users,
  Gavel,
  FileText,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import { dashboardStats, matters, hearings } from '@/Utils/MockData';

const statCards = [
  {
    label: 'Active Matters',
    value: dashboardStats.activeMatters,
    icon: Briefcase,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Total Clients',
    value: dashboardStats.totalClients,
    icon: Users,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    label: 'Upcoming Hearings',
    value: dashboardStats.upcomingHearings,
    icon: Gavel,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'Total Documents',
    value: dashboardStats.totalDocuments,
    icon: FileText,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
];

export default function Dashboard() {
  const recentMatters = matters.slice(0, 4);
  const upcomingHearings = hearings
    .filter((h) => h.status === 'Pending')
    .slice(0, 3);

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-xl font-semibold text-slate-900'>
          Good morning, Carlos
        </h1>
        <p className='text-sm text-slate-500 mt-0.5'>
          Here's what's happening at JurisFile today.
        </p>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-4 gap-4'>
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className='border-gray-100 shadow-none'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-slate-500 mb-1'>{label}</p>
                  <p className='text-2xl font-semibold text-slate-900'>
                    {value}
                  </p>
                </div>
                <div
                  className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two column section */}
      <div className='grid grid-cols-5 gap-4'>
        {/* Recent Matters */}
        <Card className='col-span-3 border-gray-100 shadow-none'>
          <CardHeader className='px-5 py-4 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-sm font-semibold text-slate-900'>
                Recent Matters
              </CardTitle>
              <a
                href='/matters'
                className='text-xs text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1'
              >
                View all <TrendingUp className='w-3 h-3' />
              </a>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-50'>
                  <th className='text-left text-[11px] font-medium text-slate-400 uppercase tracking-wide px-5 py-2.5'>
                    Matter
                  </th>
                  <th className='text-left text-[11px] font-medium text-slate-400 uppercase tracking-wide px-5 py-2.5'>
                    Client
                  </th>
                  <th className='text-left text-[11px] font-medium text-slate-400 uppercase tracking-wide px-5 py-2.5'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMatters.map((m, i) => (
                  <tr
                    key={m.id}
                    className={`hover:bg-gray-50 transition-colors ${i !== recentMatters.length - 1 ? 'border-b border-gray-50' : ''}`}
                  >
                    <td className='px-5 py-3'>
                      <p className='text-xs font-medium text-slate-800 truncate max-w-[200px]'>
                        {m.title}
                      </p>
                      <p className='text-[11px] text-slate-400'>
                        {m.caseNumber}
                      </p>
                    </td>
                    <td className='px-5 py-3'>
                      <p className='text-xs text-slate-600 truncate max-w-[140px]'>
                        {m.client}
                      </p>
                    </td>
                    <td className='px-5 py-3'>
                      <StatusBadge status={m.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Upcoming Hearings */}
        <Card className='col-span-2 border-gray-100 shadow-none'>
          <CardHeader className='px-5 py-4 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-sm font-semibold text-slate-900'>
                Upcoming Hearings
              </CardTitle>
              <a
                href='/hearings'
                className='text-xs text-slate-400 hover:text-slate-700 transition-colors'
              >
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent className='p-4 space-y-3'>
            {upcomingHearings.map((h) => (
              <div
                key={h.id}
                className='flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'
              >
                <div className='w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0'>
                  <Clock className='w-4 h-4 text-amber-600' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs font-medium text-slate-800 truncate'>
                    {h.title}
                  </p>
                  <p className='text-[11px] text-slate-500 truncate'>
                    {h.matter} · {h.court.split(',')[0]}
                  </p>
                  <p className='text-[11px] text-amber-600 font-medium mt-0.5'>
                    {h.date} at {h.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
