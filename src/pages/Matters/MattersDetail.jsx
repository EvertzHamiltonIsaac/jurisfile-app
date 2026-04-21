import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Plus,
  FileText,
  Gavel,
  Users,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/ui/StatusBadge';
import { matters, documents, hearings } from '@/Utils/MockData';

const fileIcons = { pdf: '📄', docx: '📝', xlsx: '📊' };

export default function MatterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const matter = matters.find((m) => m.id === Number(id));

  if (!matter)
    return <div className='p-6 text-sm text-slate-500'>Matter not found.</div>;

  const matterDocs = documents.filter((d) => d.matter === matter.caseNumber);
  const matterHearings = hearings.filter((h) => h.matter === matter.caseNumber);

  return (
    <div className='p-6 space-y-5'>
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate('/matters')}
          className='flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors mb-3'
        >
          <ArrowLeft className='w-3.5 h-3.5' /> Back to Matters
        </button>

        <div className='flex items-start justify-between'>
          <div>
            <div className='flex items-center gap-2.5 mb-1'>
              <span className='text-xs font-mono text-slate-400 bg-gray-100 px-2 py-0.5 rounded'>
                {matter.caseNumber}
              </span>
              <StatusBadge status={matter.status} />
              <span className='text-xs text-slate-400 bg-gray-100 px-2 py-0.5 rounded'>
                {matter.type}
              </span>
            </div>
            <h1 className='text-xl font-semibold text-slate-900'>
              {matter.title}
            </h1>
            <p className='text-sm text-slate-500 mt-0.5'>
              {matter.client} · Opened {matter.openedAt}
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='h-8 text-xs border-gray-200 gap-1.5'
          >
            <MoreHorizontal className='w-3.5 h-3.5' /> Actions
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='documents'>
        <TabsList className='bg-gray-100 h-8 p-0.5'>
          <TabsTrigger
            value='documents'
            className='text-xs h-7 px-3 data-[state=active]:bg-white data-[state=active]:shadow-none'
          >
            <FileText className='w-3.5 h-3.5 mr-1.5' /> Documents (
            {matterDocs.length})
          </TabsTrigger>
          <TabsTrigger
            value='hearings'
            className='text-xs h-7 px-3 data-[state=active]:bg-white data-[state=active]:shadow-none'
          >
            <Gavel className='w-3.5 h-3.5 mr-1.5' /> Hearings (
            {matterHearings.length})
          </TabsTrigger>
          <TabsTrigger
            value='team'
            className='text-xs h-7 px-3 data-[state=active]:bg-white data-[state=active]:shadow-none'
          >
            <Users className='w-3.5 h-3.5 mr-1.5' /> Team
          </TabsTrigger>
        </TabsList>

        {/* Documents tab */}
        <TabsContent value='documents' className='mt-4'>
          <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100'>
              <p className='text-sm font-medium text-slate-700'>Documents</p>
              <Button
                size='sm'
                className='bg-slate-900 hover:bg-slate-700 text-white gap-1.5 h-7 text-xs'
              >
                <Upload className='w-3 h-3' /> Upload
              </Button>
            </div>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-50 bg-gray-50/50'>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>
                    Title
                  </th>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>
                    Category
                  </th>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>
                    Version
                  </th>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>
                    Uploaded by
                  </th>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>
                    Last updated
                  </th>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>
                    Size
                  </th>
                </tr>
              </thead>
              <tbody>
                {matterDocs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='text-center py-10 text-sm text-slate-400'
                    >
                      No documents yet.
                    </td>
                  </tr>
                ) : (
                  matterDocs.map((doc, i) => (
                    <tr
                      key={doc.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${i !== matterDocs.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      <td className='px-5 py-3'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm'>
                            {fileIcons[doc.fileType] || '📄'}
                          </span>
                          <p className='text-xs font-medium text-slate-800'>
                            {doc.title}
                          </p>
                        </div>
                      </td>
                      <td className='px-5 py-3'>
                        <p className='text-xs text-slate-500'>{doc.category}</p>
                      </td>
                      <td className='px-5 py-3'>
                        <span className='text-xs font-mono bg-gray-100 text-slate-600 px-1.5 py-0.5 rounded'>
                          v{doc.version}
                        </span>
                      </td>
                      <td className='px-5 py-3'>
                        <p className='text-xs text-slate-500'>
                          {doc.uploadedBy}
                        </p>
                      </td>
                      <td className='px-5 py-3'>
                        <p className='text-xs text-slate-400'>
                          {doc.updatedAt}
                        </p>
                      </td>
                      <td className='px-5 py-3'>
                        <p className='text-xs text-slate-400'>
                          {doc.sizeMb} MB
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Hearings tab */}
        <TabsContent value='hearings' className='mt-4'>
          <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100'>
              <p className='text-sm font-medium text-slate-700'>Hearings</p>
              <Button
                size='sm'
                className='bg-slate-900 hover:bg-slate-700 text-white gap-1.5 h-7 text-xs'
              >
                <Plus className='w-3 h-3' /> Add Hearing
              </Button>
            </div>
            <div className='divide-y divide-gray-50'>
              {matterHearings.length === 0 ? (
                <p className='text-center py-10 text-sm text-slate-400'>
                  No hearings scheduled.
                </p>
              ) : (
                matterHearings.map((h) => (
                  <div
                    key={h.id}
                    className='flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors'
                  >
                    <div>
                      <p className='text-xs font-medium text-slate-800'>
                        {h.title}
                      </p>
                      <p className='text-[11px] text-slate-400 mt-0.5'>
                        {h.court}
                      </p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='text-right'>
                        <p className='text-xs font-medium text-slate-700'>
                          {h.date}
                        </p>
                        <p className='text-[11px] text-slate-400'>{h.time}</p>
                      </div>
                      <StatusBadge status={h.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* Team tab */}
        <TabsContent value='team' className='mt-4'>
          <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100'>
              <p className='text-sm font-medium text-slate-700'>
                Assigned Team
              </p>
              <Button
                size='sm'
                variant='outline'
                className='gap-1.5 h-7 text-xs border-gray-200'
              >
                <Plus className='w-3 h-3' /> Assign
              </Button>
            </div>
            <div className='divide-y divide-gray-50'>
              {[
                {
                  name: matter.attorney,
                  role: 'Lead Attorney',
                  initials: matter.attorney
                    .split(' ')
                    .map((n) => n[0])
                    .join(''),
                },
                { name: 'Ana Martinez', role: 'Collaborator', initials: 'AM' },
              ].map((member) => (
                <div
                  key={member.name}
                  className='flex items-center gap-3 px-5 py-4'
                >
                  <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600'>
                    {member.initials}
                  </div>
                  <div>
                    <p className='text-xs font-medium text-slate-800'>
                      {member.name}
                    </p>
                    <p className='text-[11px] text-slate-400'>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
