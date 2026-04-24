import { useState } from 'react';
import { Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UploadModal from '@/components/ui/UploadModal';
import { documents } from '@/Utils/MockData';

const fileIcons = { pdf: '📄', docx: '📝', xlsx: '📊' };

const categoryColors = {
  Complaint: 'bg-rose-50 text-rose-600',
  Contract: 'bg-blue-50 text-blue-600',
  Correspondence: 'bg-amber-50 text-amber-600',
  'Court Order': 'bg-violet-50 text-violet-600',
  Minutes: 'bg-teal-50 text-teal-600',
  Evidence: 'bg-orange-50 text-orange-600',
};

export default function Documents() {
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleUpload = (files) => {
    // TODO: send files to backend API
    console.log('Files to upload:', files);
  };

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.matter.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='p-6 space-y-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold text-slate-900'>Documents</h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            {documents.length} documents across all matters
          </p>
        </div>
        <Button
          size='sm'
          onClick={() => setUploadOpen(true)}
          className='bg-slate-900 hover:bg-slate-700 text-white gap-1.5 h-8 text-xs'
        >
          <Upload className='w-3.5 h-3.5' /> Upload Document
        </Button>
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* Search */}
      <div className='relative max-w-xs'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
        <Input
          placeholder='Search documents...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-9 h-8 text-xs bg-gray-50 border-gray-200'
        />
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-100 bg-gray-50/50'>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Document
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Matter
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Category
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Version
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Uploaded by
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Updated
              </th>
              <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>
                Size
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className='text-center py-12 text-sm text-slate-400'
                >
                  No documents found.
                </td>
              </tr>
            ) : (
              filtered.map((doc, i) => (
                <tr
                  key={doc.id}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <td className='px-5 py-3.5'>
                    <div className='flex items-center gap-2.5'>
                      <span className='text-base'>
                        {fileIcons[doc.fileType] || '📄'}
                      </span>
                      <div>
                        <p className='text-xs font-medium text-slate-800'>
                          {doc.title}
                        </p>
                        <p className='text-[11px] text-slate-400 uppercase'>
                          {doc.fileType}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-5 py-3.5'>
                    <span className='text-xs font-mono text-slate-500 bg-gray-100 px-1.5 py-0.5 rounded'>
                      {doc.matter}
                    </span>
                  </td>
                  <td className='px-5 py-3.5'>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${categoryColors[doc.category] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {doc.category}
                    </span>
                  </td>
                  <td className='px-5 py-3.5'>
                    <span className='text-xs font-mono bg-gray-100 text-slate-600 px-1.5 py-0.5 rounded'>
                      v{doc.version}
                    </span>
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs text-slate-500'>{doc.uploadedBy}</p>
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs text-slate-400'>{doc.updatedAt}</p>
                  </td>
                  <td className='px-5 py-3.5'>
                    <p className='text-xs text-slate-400'>{doc.sizeMb} MB</p>
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
