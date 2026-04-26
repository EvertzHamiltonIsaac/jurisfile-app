import { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { documentsService } from '@/services/Documents.service';

function getMimeIcon(mime = '') {
  if (mime.includes('pdf')) return '📄';
  if (mime.includes('word')) return '📝';
  if (mime.includes('sheet') || mime.includes('excel')) return '📊';
  return '📄';
}

export default function DocumentRow({ doc, isLast, onDelete, onNewVersion }) {
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
      const res = await documentsService.getVersions(doc.documento_id);
      setVersions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingV(false);
    }
  }

  return (
    <>
      {/* ── Main row ── */}
      <tr onClick={toggleVersions} className={`hover:bg-gray-50 cursor-pointer transition-colors group ${!isLast || expanded ? 'border-b border-gray-50' : ''}`}>
        {/* Title */}
        <td className='px-5 py-3'>
          <div className='flex items-center gap-2'>
            <span className='text-sm'>{getMimeIcon(doc.mime_type)}</span>
            <div>
              <p className='text-xs font-medium text-slate-800'>{doc.titulo}</p>
              {doc.latest_version > 1 && (
                <p className='text-[10px] text-slate-400 mt-0.5'>
                  {expanded ? '▲' : '▼'} {doc.latest_version} versions
                </p>
              )}
            </div>
          </div>
        </td>

        {/* Category */}
        <td className='px-5 py-3'>
          <p className='text-xs text-slate-500'>{doc.category_name}</p>
        </td>

        {/* Version badge */}
        <td className='px-5 py-3'>
          <span className='text-xs font-mono bg-gray-100 text-slate-600 px-1.5 py-0.5 rounded'>v{doc.latest_version}</span>
        </td>

        {/* Uploaded by */}
        <td className='px-5 py-3'>
          <p className='text-xs text-slate-500'>{doc.uploader_name}</p>
        </td>

        {/* Date */}
        <td className='px-5 py-3'>
          <p className='text-xs text-slate-400'>{new Date(doc.creado_en).toLocaleDateString()}</p>
        </td>

        {/* Actions */}
        <td className='px-5 py-3'>
          <div className='flex items-center gap-1 justify-end'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNewVersion();
              }}
              className='opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 h-6 rounded-md hover:bg-slate-100 text-[11px] text-slate-500 whitespace-nowrap'
            >
              <Upload className='w-3 h-3' /> New version
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(doc.documento_id);
              }}
              className='opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center'
            >
              <Trash2 className='w-3.5 h-3.5 text-red-400' />
            </button>
          </div>
        </td>
      </tr>

      {/* ── Version history panel ── */}
      {expanded && (
        <tr>
          <td colSpan={6} className={`bg-slate-50/60 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <div className='px-5 py-4'>
              <p className='text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 ml-6'>Version History</p>

              {loadingV ? (
                <div className='flex items-center gap-2 py-2 ml-6'>
                  <div className='w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin' />
                  <p className='text-xs text-slate-400'>Loading versions...</p>
                </div>
              ) : versions.length === 0 ? (
                <p className='text-xs text-slate-400 ml-6 py-2'>No version history available.</p>
              ) : (
                <div className='relative ml-6'>
                  {/* Timeline line */}
                  <div className='absolute left-[5px] top-2 bottom-2 w-px bg-gray-200' />

                  <div className='space-y-0'>
                    {versions.map((v, vi) => (
                      <div key={v.version_id} className='flex items-start gap-4 py-2.5'>
                        {/* Dot */}
                        <div className={`w-3 h-3 rounded-full shrink-0 mt-0.5 border-2 z-10 ${vi === 0 ? 'bg-slate-900 border-slate-900' : 'bg-white border-gray-300'}`} />

                        {/* Content */}
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <span
                            className={`text-xs font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                              vi === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200'
                            }`}
                          >
                            v{v.numero_version}
                          </span>

                          <p className='text-xs text-slate-700 truncate flex-1'>{v.nombre_archivo}</p>

                          <div className='flex items-center gap-3 shrink-0'>
                            {vi === 0 && <span className='text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100'>Latest</span>}
                            {v.tamano_bytes && <p className='text-[11px] text-slate-400'>{(v.tamano_bytes / 1024).toFixed(0)} KB</p>}
                            <div className='text-right'>
                              <p className='text-[11px] text-slate-500'>{v.uploaded_by_name}</p>
                              <p className='text-[10px] text-slate-400'>{new Date(v.creado_en).toLocaleDateString()}</p>
                            </div>
                            <a
                              href={v.ruta_archivo}
                              target='_blank'
                              rel='noreferrer'
                              onClick={(e) => e.stopPropagation()}
                              className='text-[11px] text-slate-400 hover:text-slate-700 underline underline-offset-2 transition-colors'
                            >
                              View
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
