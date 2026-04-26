import { useState, useRef, useCallback } from 'react';
import { X, Upload, File, FileText, FileSpreadsheet, Trash2, CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadToCloudinary } from '@/services/cloudinary';
import { documentsService } from '@/services/Documents.service';
import { CATEGORIES } from '@/Utils/utils';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function FileIcon({ type }) {
  const ext = type?.split('/').pop()?.toLowerCase();
  if (['pdf'].includes(ext)) return <FileText className='w-4 h-4 text-red-500' />;
  if (['vnd.openxmlformats-officedocument.wordprocessingml.document', 'msword'].includes(ext)) return <FileText className='w-4 h-4 text-blue-500' />;
  if (['vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.ms-excel'].includes(ext)) return <FileSpreadsheet className='w-4 h-4 text-emerald-500' />;
  return <File className='w-4 h-4 text-slate-400' />;
}

export default function UploadModal({
  open,
  onClose,
  onUploaded,
  caseId,
  caseNumber,
  versioningDoc, // if set → we are uploading a new version of this document
}) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('8');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const isVersionMode = !!versioningDoc;

  const addFiles = useCallback(
    (incoming) => {
      const arr = Array.from(incoming);
      setFiles((prev) => {
        const existing = new Set(prev.map((f) => f.name));
        return [...prev, ...arr.filter((f) => !existing.has(f.name))];
      });
      if (arr.length > 0 && !title && !isVersionMode) {
        setTitle(arr[0].name.replace(/\.[^/.]+$/, ''));
      }
    },
    [title, isVersionMode],
  );

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleCancel = () => {
    setFiles([]);
    setTitle('');
    setCategoryId('8');
    setDescription('');
    setError('');
    setProgress('');
    onClose();
  };

  const handleUpload = async () => {
    if (!files.length) return;
    if (!isVersionMode && !title.trim()) {
      setError('Please add a title for the document.');
      return;
    }
    if (!caseId) {
      setError('No case selected.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}...`);

        // Step 1 — Upload file to Cloudinary
        const cloudinaryData = await uploadToCloudinary(file);

        if (isVersionMode) {
          // Step 2A — New version of an existing document
          await documentsService.uploadVersion(versioningDoc.documento_id, cloudinaryData);
        } else {
          // Step 2B — Brand new document
          await documentsService.upload({
            case_id: caseId,
            category_id: parseInt(categoryId),
            title: files.length === 1 ? title : `${title} (${i + 1})`,
            description: description || undefined,
            ...cloudinaryData,
          });
        }
      }

      setProgress('');
      onUploaded?.();
      handleCancel();
    } catch (err) {
      setError(err.message);
      setProgress('');
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget && !uploading) handleCancel();
      }}
    >
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <div>
            <h2 className='text-sm font-semibold text-slate-900'>{isVersionMode ? 'Upload New Version' : 'Upload Document'}</h2>
            <div className='flex items-center gap-1.5 mt-0.5'>
              {isVersionMode ? (
                <p className='text-xs text-slate-400'>
                  Adding version to: <span className='font-medium text-slate-600'>{versioningDoc.title}</span>
                </p>
              ) : (
                <>
                  <p className='text-xs text-slate-400'>PDF, DOCX, XLSX supported</p>
                  {caseNumber && (
                    <>
                      <span className='text-slate-200'>·</span>
                      <span className='text-xs font-medium text-slate-500 bg-gray-100 px-2 py-0.5 rounded'>{caseNumber}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={uploading}
            className='w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-40'
          >
            <X className='w-4 h-4 text-slate-500' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto'>
          {/* Dropzone */}
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer py-8 px-6 transition-all duration-200
              ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'}
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${dragging ? 'bg-blue-100' : 'bg-white border border-gray-200'}`}>
              <CloudUpload className={`w-5 h-5 ${dragging ? 'text-blue-500' : 'text-slate-400'}`} />
            </div>
            <div className='text-center'>
              <p className={`text-sm font-medium ${dragging ? 'text-blue-600' : 'text-slate-700'}`}>{dragging ? 'Drop files here' : 'Drag & drop files here'}</p>
              <p className='text-xs text-slate-400 mt-0.5'>
                or <span className='text-slate-600 underline underline-offset-2'>browse from your computer</span>
              </p>
            </div>
            <input
              ref={inputRef}
              type='file'
              multiple={!isVersionMode}
              accept='.pdf,.doc,.docx,.xls,.xlsx'
              className='hidden'
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
              }}
            />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className='space-y-1.5'>
              <p className='text-[11px] font-semibold text-slate-400 uppercase tracking-wide'>
                Selected — {files.length} {files.length === 1 ? 'file' : 'files'}
              </p>
              <div className='max-h-32 overflow-y-auto space-y-1.5 pr-1'>
                {files.map((file) => (
                  <div key={file.name} className='flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 group'>
                    <div className='w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0'>
                      <FileIcon type={file.type} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs font-medium text-slate-800 truncate'>{file.name}</p>
                      <p className='text-[11px] text-slate-400'>{formatSize(file.size)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.name);
                      }}
                      disabled={uploading}
                      className='w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0'
                    >
                      <Trash2 className='w-3.5 h-3.5 text-red-400' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata — only for new documents, not versions */}
          {files.length > 0 && !isVersionMode && (
            <>
              <div className='border-t border-gray-100' />
              <div className='space-y-3'>
                <p className='text-[11px] font-semibold text-slate-400 uppercase tracking-wide'>Document Info</p>

                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-slate-700'>
                    Title <span className='text-red-400'>*</span>
                  </label>
                  <Input
                    placeholder='Document title'
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setError('');
                    }}
                    disabled={uploading}
                    className='h-8 text-xs border-gray-200 bg-gray-50'
                  />
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-slate-700'>Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={uploading}
                    className='w-full h-8 text-xs border border-gray-200 bg-gray-50 rounded-lg px-3 text-slate-700 focus:outline-none focus:border-slate-400'
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-slate-700'>
                    Description <span className='text-slate-400 font-normal'>(optional)</span>
                  </label>
                  <textarea
                    placeholder='Brief description...'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={uploading}
                    rows={2}
                    className='w-full text-xs border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-slate-400 resize-none disabled:opacity-50'
                  />
                </div>
              </div>
            </>
          )}

          {/* Progress */}
          {progress && (
            <div className='flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg'>
              <div className='w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0' />
              <p className='text-xs text-blue-600'>{progress}</p>
            </div>
          )}

          {/* Error */}
          {error && <p className='text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2'>{error}</p>}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50/50'>
          <Button variant='outline' size='sm' onClick={handleCancel} disabled={uploading} className='h-8 text-xs border-gray-200 text-slate-600'>
            Cancel
          </Button>
          <Button
            size='sm'
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className='h-8 text-xs bg-slate-900 hover:bg-slate-700 text-white gap-1.5 disabled:opacity-40'
          >
            {uploading ? (
              <span className='flex items-center gap-1.5'>
                <span className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Uploading...
              </span>
            ) : (
              <>
                <Upload className='w-3.5 h-3.5' />
                {isVersionMode ? 'Upload Version' : `Upload ${files.length > 0 ? `(${files.length})` : ''}`}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
