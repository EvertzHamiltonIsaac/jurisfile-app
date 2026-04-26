import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-50'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin' />
          <p className='text-xs text-slate-400'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to='/login' replace />;

  return children;
}
