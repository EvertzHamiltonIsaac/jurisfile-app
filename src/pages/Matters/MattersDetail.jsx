import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, FileText, Gavel, Users, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/ui/StatusBadge';
import UploadModal from '@/components/modals/Uploadmodal';
// import NewHearingModal from '@/components/modals/NewHearingModal';
import AssignTeamModal from '@/components/modals/AssignTeamModal';
import { casesService } from '@/services/Cases.service';
import { documentsService } from '@/services/Documents.service';
// import { hearingsService } from '@/services/hearings.service';
import { CASE_STATUSES, CASE_TYPES } from '@/Utils/utils';
import DocumentRow from '@/components/ui/DocumentRow';
// function getMimeIcon(mime = '') {
//   if (mime.includes('pdf')) return '📄';
//   if (mime.includes('word')) return '📝';
//   if (mime.includes('sheet') || mime.includes('excel')) return '📊';
//   return '📄';
// }

export default function MatterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [matter, setMatter] = useState(null);
  const [docs, setDocs] = useState([]);
  const [hearings, setHearings] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [versioningDoc, setVersioningDoc] = useState(null);

  // Modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [_hearingOpen, setHearingOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id]);

  async function fetchAll() {
    setLoading(true);
    try {
      const [matterRes, docsRes, teamRes] = await Promise.all([casesService.getOne(id), documentsService.getCaseDocuments(id), casesService.getTeam(id)]);

      setMatter(matterRes.data);
      setEditStatus(matterRes.data.case_status_id);
      setHearings([]);
      setDocs(docsRes.data);
      setTeam(teamRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate() {
    try {
      const res = await casesService.update(id, { case_status_id: parseInt(editStatus) });
      setMatter(res.data);
      setEditing(false);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete() {
    try {
      await casesService.update(id, { case_status_id: 5 }); // Archive instead of hard delete
      navigate('/matters');
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteDoc(docId) {
    if (!window.confirm('Delete this document?')) return;
    try {
      await documentsService.remove(docId);
      setDocs((prev) => prev.filter((d) => d.document_id !== docId));
      fetchAll();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading)
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin' />
      </div>
    );

  if (error || !matter) return <div className='p-6 text-sm text-red-500'>{error || 'Matter not found.'}</div>;

  return (
    <div className='p-6 space-y-5'>
      {/* Back */}
      <button onClick={() => navigate('/matters')} className='flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors'>
        <ArrowLeft className='w-3.5 h-3.5' /> Back to Matters
      </button>

      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <div className='flex items-center gap-2.5 mb-1'>
            <span className='text-xs font-mono text-slate-400 bg-gray-100 px-2 py-0.5 rounded'>{matter.numero}</span>
            <StatusBadge status={matter.case_status} />
            <span className='text-xs text-slate-400 bg-gray-100 px-2 py-0.5 rounded'>{matter.case_type}</span>
          </div>
          <h1 className='text-xl font-semibold text-slate-900'>{matter.titulo}</h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            {matter.client_name} · Opened {new Date(matter.fecha_apertura).toLocaleDateString()}
          </p>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='outline' onClick={() => setEditing(!editing)} className='h-8 text-xs border-gray-200 gap-1.5'>
            <Pencil className='w-3.5 h-3.5' /> Edit Status
          </Button>
          <Button size='sm' variant='outline' onClick={() => setDeleteConfirm(true)} className='h-8 text-xs border-red-200 text-red-500 hover:bg-red-50 gap-1.5'>
            <Trash2 className='w-3.5 h-3.5' /> Archive
          </Button>
        </div>
      </div>

      {/* Edit status inline */}
      {editing && (
        <div className='flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100'>
          <p className='text-xs font-medium text-slate-600'>Change status:</p>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
            className='h-7 text-xs border border-gray-200 bg-white rounded-lg px-2 text-slate-700 focus:outline-none'
          >
            {CASE_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <Button size='sm' onClick={handleStatusUpdate} className='h-7 text-xs bg-slate-900 hover:bg-slate-700 text-white'>
            Save
          </Button>
          <button onClick={() => setEditing(false)} className='text-xs text-slate-400 hover:text-slate-600'>
            Cancel
          </button>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className='flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100'>
          <p className='text-xs text-red-600 flex-1'>This will archive the matter. Are you sure?</p>
          <Button size='sm' onClick={handleDelete} className='h-7 text-xs bg-red-500 hover:bg-red-600 text-white'>
            Yes, Archive
          </Button>
          <button onClick={() => setDeleteConfirm(false)} className='text-xs text-slate-400 hover:text-slate-600'>
            Cancel
          </button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue='documents'>
        <TabsList className='bg-gray-100 h-8 p-0.5'>
          <TabsTrigger value='documents' className='text-xs h-7 px-3 data-[state=active]:bg-white data-[state=active]:shadow-none'>
            <FileText className='w-3.5 h-3.5 mr-1.5' /> Documents ({docs.length})
          </TabsTrigger>
          <TabsTrigger value='hearings' className='text-xs h-7 px-3 data-[state=active]:bg-white data-[state=active]:shadow-none'>
            <Gavel className='w-3.5 h-3.5 mr-1.5' /> Hearings ({hearings.length})
          </TabsTrigger>
          <TabsTrigger value='team' className='text-xs h-7 px-3 data-[state=active]:bg-white data-[state=active]:shadow-none'>
            <Users className='w-3.5 h-3.5 mr-1.5' /> Team ({team.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Documents ── */}
        <TabsContent value='documents' className='mt-4'>
          <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100'>
              <p className='text-sm font-medium text-slate-700'>Documents</p>
              <Button size='sm' onClick={() => setUploadOpen(true)} className='bg-slate-900 hover:bg-slate-700 text-white gap-1.5 h-7 text-xs'>
                <Upload className='w-3 h-3' /> Upload
              </Button>
            </div>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-50 bg-gray-50/50'>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>Title</th>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>Category</th>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>Version</th>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>Uploaded by</th>
                  <th className='text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5'>Date</th>
                  <th className='px-5 py-2.5'></th>
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='text-center py-10 text-sm text-slate-400'>
                      No documents yet.
                    </td>
                  </tr>
                ) : (
                  docs.map((doc, i) => (
                    <DocumentRow
                      key={doc.documento_id}
                      doc={doc}
                      isLast={i === docs.length - 1}
                      onDelete={handleDeleteDoc}
                      onNewVersion={() => {
                        setVersioningDoc(doc);
                        setUploadOpen(true);
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ── Hearings ── */}
        <TabsContent value='hearings' className='mt-4'>
          <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100'>
              <p className='text-sm font-medium text-slate-700'>Hearings</p>
              <Button size='sm' onClick={() => setHearingOpen(true)} className='bg-slate-900 hover:bg-slate-700 text-white gap-1.5 h-7 text-xs'>
                <Plus className='w-3 h-3' /> Add Hearing
              </Button>
            </div>
            <div className='divide-y divide-gray-50'>
              {hearings.length === 0 ? (
                <p className='text-center py-10 text-sm text-slate-400'>No hearings scheduled.</p>
              ) : (
                hearings.map((h) => (
                  <div key={h.hearing_id} className='flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors'>
                    <div>
                      <p className='text-xs font-medium text-slate-800'>{h.title}</p>
                      <p className='text-[11px] text-slate-400 mt-0.5'>{h.court}</p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='text-right'>
                        <p className='text-xs font-medium text-slate-700'>{new Date(h.hearing_date).toLocaleDateString()}</p>
                        <p className='text-[11px] text-slate-400'>{new Date(h.hearing_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <StatusBadge status={h.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Team ── */}
        <TabsContent value='team' className='mt-4'>
          <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100'>
              <p className='text-sm font-medium text-slate-700'>Assigned Team</p>
              <Button size='sm' variant='outline' onClick={() => setTeamOpen(true)} className='gap-1.5 h-7 text-xs border-gray-200'>
                <Plus className='w-3 h-3' /> Assign
              </Button>
            </div>
            <div className='divide-y divide-gray-50'>
              {team.length === 0 ? (
                <p className='text-center py-10 text-sm text-slate-400'>No team members assigned.</p>
              ) : (
                team.map((member) => (
                  <div key={member.usuario_id} className='flex items-center gap-3 px-5 py-4'>
                    <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600'>
                      {member.nombre[0]}
                      {member.apellido[0]}
                    </div>
                    <div>
                      <p className='text-xs font-medium text-slate-800'>
                        {member.nombre} {member.apellido}
                      </p>
                      <p className='text-[11px] text-slate-400'>
                        {member.rol_en_caso} · {member.role_name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <UploadModal
        open={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          setVersioningDoc(null);
          fetchAll();
        }}
        caseId={parseInt(id)}
        caseNumber={matter?.case_number}
        versioningDoc={versioningDoc}
        onUploaded={() => {
          setUploadOpen(false);
          setVersioningDoc(null);
          fetchAll();
        }}
      />
      {/* <NewHearingModal open={hearingOpen} onClose={() => setHearingOpen(false)} caseId={parseInt(id)} onCreated={(h) => setHearings((prev) => [...prev, h])} /> */}
      <AssignTeamModal open={teamOpen} onClose={() => setTeamOpen(false)} caseId={parseInt(id)} onAssigned={fetchAll} />
    </div>
  );
}
