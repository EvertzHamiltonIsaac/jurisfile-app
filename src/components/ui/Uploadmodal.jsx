import { useState, useRef, useCallback } from 'react';
import {
  X,
  Upload,
  File,
  FileText,
  FileSpreadsheet,
  Trash2,
  CloudUpload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Format bytes to human-readable string
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// File type icon
function FileIcon({ type }) {
  const ext = type?.split('/').pop()?.toLowerCase();
  if (['pdf'].includes(ext))
    return <FileText className='w-4 h-4 text-red-500' />;
  if (
    [
      'vnd.openxmlformats-officedocument.wordprocessingml.document',
      'msword',
    ].includes(ext)
  )
    return <FileText className='w-4 h-4 text-blue-500' />;
  if (
    [
      'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'vnd.ms-excel',
    ].includes(ext)
  )
    return <FileSpreadsheet className='w-4 h-4 text-emerald-500' />;
  return <File className='w-4 h-4 text-slate-400' />;
}

export default function UploadModal({ open, onClose, onUpload }) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  // Add files — deduplicate by name
  const addFiles = useCallback((incoming) => {
    const arr = Array.from(incoming);
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const newOnes = arr.filter((f) => !existingNames.has(f.name));
      return [...prev, ...newOnes];
    });
  }, []);

  const removeFile = (name) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  // Drag events
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
    onClose();
  };

  const handleUpload = () => {
    if (!files.length) return;
    onUpload?.(files); // pass files to parent — parent will call the API
    setFiles([]);
    onClose();
  };

  if (!open) return null;

  return (
    // Overlay
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      {/* Modal container */}
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <div>
            <h2 className='text-sm font-semibold text-slate-900'>
              Upload Documents
            </h2>
            <p className='text-xs text-slate-400 mt-0.5'>
              PDF, DOCX, XLSX supported
            </p>
          </div>
          <button
            onClick={handleCancel}
            className='w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors'
          >
            <X className='w-4 h-4 text-slate-500' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5 space-y-4'>
          {/* Dropzone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`
              relative flex flex-col items-center justify-center gap-3
              rounded-xl border-2 border-dashed cursor-pointer
              py-10 px-6 transition-all duration-200
              ${
                dragging
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }
            `}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragging ? 'bg-blue-100' : 'bg-white border border-gray-200'}`}
            >
              <CloudUpload
                className={`w-6 h-6 ${dragging ? 'text-blue-500' : 'text-slate-400'}`}
              />
            </div>
            <div className='text-center'>
              <p
                className={`text-sm font-medium ${dragging ? 'text-blue-600' : 'text-slate-700'}`}
              >
                {dragging ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className='text-xs text-slate-400 mt-0.5'>
                or{' '}
                <span className='text-slate-600 underline underline-offset-2'>
                  browse from your computer
                </span>
              </p>
            </div>

            {/* Hidden input */}
            <input
              ref={inputRef}
              type='file'
              multiple
              accept='.pdf,.doc,.docx,.xls,.xlsx'
              className='hidden'
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
              }}
            />
          </div>

          {/* File list */}
          <div className='space-y-1.5'>
            {files.length === 0 ? (
              <p className='text-xs text-slate-400 text-center py-2'>
                No files selected yet.
              </p>
            ) : (
              <>
                <p className='text-[11px] font-semibold text-slate-400 uppercase tracking-wide'>
                  Selected — {files.length}{' '}
                  {files.length === 1 ? 'file' : 'files'}
                </p>
                <div className='max-h-44 overflow-y-auto space-y-1.5 pr-1'>
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className='flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 group'
                    >
                      <div className='w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0'>
                        <FileIcon type={file.type} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-xs font-medium text-slate-800 truncate'>
                          {file.name}
                        </p>
                        <p className='text-[11px] text-slate-400'>
                          {formatSize(file.size)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.name);
                        }}
                        className='w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all'
                      >
                        <Trash2 className='w-3.5 h-3.5 text-red-400' />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className='flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50/50'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleCancel}
            className='h-8 text-xs border-gray-200 text-slate-600'
          >
            Cancel
          </Button>
          <Button
            size='sm'
            onClick={handleUpload}
            disabled={files.length === 0}
            className='h-8 text-xs bg-slate-900 hover:bg-slate-700 text-white gap-1.5 disabled:opacity-40'
          >
            <Upload className='w-3.5 h-3.5' />
            Upload {files.length > 0 ? `(${files.length})` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}
