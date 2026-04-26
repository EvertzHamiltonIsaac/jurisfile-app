import { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { casesService } from '@/services/Cases.service';
import { ROLES } from '@/Utils/utils';

export default function AssignTeamModal({ open, onClose, onAssigned, caseId }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [caseRole, setCaseRole] = useState('Collaborator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    // Fetch available users from the API
    fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jurisfile_token')}` },
    })
      .then((r) => r.json())
      .then((r) => setUsers(r.data || []))
      .catch(() => {});
  }, [open]);

  const handleSubmit = async () => {
    if (!userId) {
      setError('Please select a user.');
      return;
    }

    setLoading(true);
    try {
      await casesService.assignUser(caseId, {
        user_id: parseInt(userId),
        case_role: caseRole,
      });
      onAssigned?.();
      setUserId('');
      setCaseRole('Collaborator');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserId('');
    setCaseRole('Collaborator');
    setError('');
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <div>
            <h2 className='text-sm font-semibold text-slate-900'>Assign Team Member</h2>
            <p className='text-xs text-slate-400 mt-0.5'>Add an attorney to this case</p>
          </div>
          <button onClick={handleCancel} className='w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors'>
            <X className='w-4 h-4 text-slate-500' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5 space-y-4'>
          {/* Icon */}
          <div className='flex justify-center'>
            <div className='w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center'>
              <Users className='w-6 h-6 text-slate-500' />
            </div>
          </div>

          {/* User selector */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Attorney <span className='text-red-400'>*</span>
            </label>
            <select
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setError('');
              }}
              className='w-full h-8 text-xs border border-gray-200 bg-gray-50 rounded-lg px-3 text-slate-700 focus:outline-none focus:border-slate-400'
            >
              <option value=''>Select an attorney...</option>
              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.nombre} {u.apellido} — {u.role_name}
                </option>
              ))}
            </select>
          </div>

          {/* Role selector */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Role in Case</label>
            <div className='flex gap-2'>
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setCaseRole(role)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                    caseRole === role ? 'border-slate-900 bg-slate-900 text-white' : 'border-gray-200 text-slate-500 hover:border-gray-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {error && <p className='text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2'>{error}</p>}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50/50'>
          <Button variant='outline' size='sm' onClick={handleCancel} className='h-8 text-xs border-gray-200 text-slate-600'>
            Cancel
          </Button>
          <Button size='sm' onClick={handleSubmit} disabled={loading} className='h-8 text-xs bg-slate-900 hover:bg-slate-700 text-white gap-1.5 disabled:opacity-40'>
            {loading ? (
              <span className='flex items-center gap-1.5'>
                <span className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Assigning...
              </span>
            ) : (
              'Assign Member'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
