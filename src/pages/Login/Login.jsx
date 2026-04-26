import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/useAuth';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Left panel */}
      <div className='hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-24 -right-24 w-96 h-96 rounded-full bg-slate-800 opacity-50' />
          <div className='absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-slate-800 opacity-30' />
        </div>
        <div className='relative flex items-center gap-3'>
          <div className='w-9 h-9 bg-white rounded-xl flex items-center justify-center'>
            <Scale className='w-5 h-5 text-slate-900' />
          </div>
          <div>
            <p className='text-white font-semibold text-lg leading-none'>JurisFile</p>
            <p className='text-slate-400 text-xs mt-0.5'>Legal Document Management</p>
          </div>
        </div>
        <div className='relative space-y-6'>
          <p className='text-3xl font-semibold text-white leading-snug'>
            Every case,
            <br />
            every document,
            <br />
            always at hand.
          </p>
          <p className='text-slate-400 text-sm leading-relaxed max-w-sm'>Manage your firm's matters, documents, clients and hearings from a single, secure platform.</p>
        </div>
        <p className='relative text-xs text-slate-500'>© 2024 JurisFile · UNICARIBE</p>
      </div>

      {/* Right panel */}
      <div className='flex-1 flex flex-col items-center justify-center px-8'>
        <div className='lg:hidden flex items-center gap-2.5 mb-10'>
          <div className='w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center'>
            <Scale className='w-4 h-4 text-white' />
          </div>
          <p className='text-slate-900 font-semibold'>JurisFile</p>
        </div>

        <div className='w-full max-w-sm space-y-7'>
          <div>
            <h1 className='text-2xl font-semibold text-slate-900'>Welcome back</h1>
            <p className='text-sm text-slate-500 mt-1'>Sign in to your JurisFile account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Email address</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
                <Input
                  type='email'
                  placeholder='you@lawfirm.com'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className='pl-9 h-9 text-sm border-gray-200 bg-white'
                  disabled={loading}
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Password</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className='pl-9 pr-9 h-9 text-sm border-gray-200 bg-white'
                  disabled={loading}
                />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'>
                  {showPassword ? <EyeOff className='w-3.5 h-3.5' /> : <Eye className='w-3.5 h-3.5' />}
                </button>
              </div>
            </div>

            {error && <p className='text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2'>{error}</p>}

            <Button type='submit' disabled={loading} className='w-full h-9 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium'>
              {loading ? (
                <span className='flex items-center gap-2'>
                  <span className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
