import { useState, _useEffect } from 'react';
import { Search, Trash2, ChevronDown, ChevronRight, ExternalLink, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { documentsService } from '@/services/Documents.service';

const categoryColors = {
  Complaint: 'bg-rose-50 text-rose-600',
  Contract: 'bg-blue-50 text-blue-600',
  Correspondence: 'bg-amber-50 text-amber-600',
  'Court Order': 'bg-violet-50 text-violet-600',
  Minutes: 'bg-teal-50 text-teal-600',
  Evidence: 'bg-orange-50 text-orange-600',
  'Power of Attorney': 'bg-indigo-50 text-indigo-600',
  Other: 'bg-gray-100 text-gray-600',
};

function getMimeIcon(mime = '') {
  if (mime.includes('pdf')) return '📄';
  if (mime.includes('word')) return '📝';
  if (mime.includes('sheet') || mime.includes('excel')) return '📊';
  return '📄';
}

function getMimeExt(mime = '') {
  if (mime.includes('pdf')) return 'PDF';
  if (mime.includes('word')) return 'DOCX';
  if (mime.includes('sheet')) return 'XLSX';
  return 'FILE';
}

function DocumentRow({ doc, isLast, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [versions, setVersions] = useState([]);
  const [loadingV, setLoadingV] = useState(false);

  async function toggleVersions() {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (versions.length > 0) return;
    setLoadingV(true);
    try {
      const res = await documentsService.getVersions(doc.document_id);
      setVersions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingV(false);
    }
  }

  return (
    <>
      <tr onClick={toggleVersions} className={`hover:bg-gray-50 cursor-pointer transition-colors group ${!isLast || expanded ? 'border-b border-gray-50' : ''}`}>
        <td className='px-5 py-3.5'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 shrink-0 flex items-center justify-center text-slate-300'>
              {expanded ? <ChevronDown className='w-3.5 h-3.5 text-slate-500' /> : <ChevronRight className='w-3.5 h-3.5' />}
            </div>
            <span className='text-base shrink-0'>{getMimeIcon(doc.mime_type)}</span>
            <div className='min-w-0'>
              <p className='text-xs font-medium text-slate-800 truncate'>{doc.title}</p>
              <p className='text-[10px] text-slate-400 uppercase'>{getMimeExt(doc.mime_type)}</p>
            </div>
          </div>
        </td>
        <td className='px-5 py-3.5'>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${categoryColors[doc.category_name] || 'bg-gray-100 text-gray-600'}`}>{doc.category_name}</span>
        </td>
        <td className='px-5 py-3.5'>
          <span className='text-xs font-mono bg-gray-100 text-slate-600 px-1.5 py-0.5 rounded'>v{doc.latest_version}</span>
        </td>
        <td className='px-5 py-3.5'>
          <p className='text-xs text-slate-500'>{doc.uploader_name}</p>
        </td>
        <td className='px-5 py-3.5'>
          <p className='text-xs text-slate-400'>{new Date(doc.created_at).toLocaleDateString()}</p>
        </td>
        <td className='px-5 py-3.5'>
          <div className='flex items-center gap-1.5 justify-end'>
            <a
              href={doc.file_path}
              target='_blank'
              rel='noreferrer'
              onClick={(e) => e.stopPropagation()}
              className='opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center'
            >
              <ExternalLink className='w-3.5 h-3.5 text-slate-400' />
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(doc.document_id);
              }}
              className='opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center'
            >
              <Trash2 className='w-3.5 h-3.5 text-red-400' />
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} className={`bg-slate-50/60 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <div className='px-14 py-4'>
              <div className='flex items-center gap-1.5 mb-3'>
                <Clock className='w-3 h-3 text-slate-400' />
                <p className='text-[10px] font-semibold text-slate-400 uppercase tracking-widest'>Version History</p>
              </div>
              {loadingV ? (
                <div className='flex items-center gap-2 py-2'>
                  <div className='w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin' />
                  <p className='text-xs text-slate-400'>Loading versions...</p>
                </div>
              ) : versions.length === 0 ? (
                <p className='text-xs text-slate-400 py-2'>No version history available.</p>
              ) : (
                <div className='relative'>
                  <div className='absolute left-[5px] top-2 bottom-2 w-px bg-gray-200' />
                  <div className='space-y-0'>
                    {versions.map((v, vi) => (
                      <div key={v.version_id} className='flex items-start gap-4 py-2.5'>
                        <div className={`w-3 h-3 rounded-full shrink-0 mt-0.5 border-2 z-10 ${vi === 0 ? 'bg-slate-900 border-slate-900' : 'bg-white border-gray-300'}`} />
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <span
                            className={`text-xs font-mono px-1.5 py-0.5 rounded border shrink-0 ${vi === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200'}`}
                          >
                            v{v.version_number}
                          </span>
                          <p className='text-xs text-slate-700 truncate flex-1'>{v.file_name}</p>
                          <div className='flex items-center gap-3 shrink-0'>
                            {vi === 0 && <span className='text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100'>Latest</span>}
                            {v.file_size_bytes && <p className='text-[11px] text-slate-400'>{(v.file_size_bytes / 1024).toFixed(0)} KB</p>}
                            <div className='text-right'>
                              <p className='text-[11px] text-slate-500'>{v.uploaded_by_name}</p>
                              <p className='text-[10px] text-slate-400'>{new Date(v.created_at).toLocaleDateString()}</p>
                            </div>
                            <a
                              href={v.file_path}
                              target='_blank'
                              rel='noreferrer'
                              className='flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 underline underline-offset-2 transition-colors shrink-0'
                            >
                              <ExternalLink className='w-3 h-3' /> View
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, _setLoading] = useState(false);
  const [search, setSearch] = useState('');

  async function handleDelete(docId) {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await documentsService.remove(docId);
      setDocuments((prev) => prev.filter((d) => d.document_id !== docId));
    } catch (err) {
      alert(err.message);
    }
  }

  const filtered = documents.filter((d) => d.title?.toLowerCase().includes(search.toLowerCase()) || d.category_name?.toLowerCase().includes(search.toLowerCase()));

  if (loading)
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin' />
      </div>
    );

  return (
    <div className='p-6 space-y-5'>
      <div>
        <h1 className='text-xl font-semibold text-slate-900'>Documents</h1>
        <p className='text-sm text-slate-500 mt-0.5'>Manage documents from each Matter</p>
      </div>

      {documents.length > 0 && (
        <div className='relative max-w-xs'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
          <Input placeholder='Search documents...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-9 h-8 text-xs bg-gray-50 border-gray-200' />
        </div>
      )}

      <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
        {documents.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 gap-3'>
            <div className='w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl'>📁</div>
            <div className='text-center'>
              <p className='text-sm font-medium text-slate-700'>Documents live inside Matters</p>
              <p className='text-xs text-slate-400 mt-1 max-w-xs'>Open a Matter to upload, view and manage its documents — including full version history.</p>
            </div>
            <a href='/matters' className='mt-1 text-xs text-slate-600 underline underline-offset-2 hover:text-slate-900 transition-colors'>
              Go to Matters →
            </a>
          </div>
        ) : (
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-100 bg-gray-50/50'>
                <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>Document</th>
                <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>Category</th>
                <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>Version</th>
                <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>Uploaded by</th>
                <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3'>Date</th>
                <th className='px-5 py-3'></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <DocumentRow key={doc.document_id} doc={doc} isLast={i === filtered.length - 1} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
