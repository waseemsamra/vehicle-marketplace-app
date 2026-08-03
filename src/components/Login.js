import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { confirmSignUp } from '../config/amplify';

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    confirmPassword: '',
    given_name: '',
    family_name: '',
    phone_number: ''
  });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, {
          given_name: formData.given_name,
          family_name: formData.family_name,
          phone_number: formData.phone_number
        });
        setShowConfirmation(true);
      } else {
        await signIn(formData.email, formData.password);
        const isAdmin = formData.email === 'waseemsamra@gmail.com' || formData.email.includes('admin');
        navigate(isAdmin ? '/admin/dashboard' : '/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await confirmSignUp({ username: formData.email, confirmationCode });
      setShowConfirmation(false);
      setIsSignUp(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">Confirm Account</h2>
          <p className="text-slate-400 mb-6">Check {formData.email} for code</p>
          
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">{error}</div>}
          
          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Code</label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
              {loading ? 'Confirming...' : 'Confirm'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                  <input type="text" value={formData.given_name} onChange={(e) => setFormData({ ...formData, given_name: e.target.value })} required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                  <input type="text" value={formData.family_name} onChange={(e) => setFormData({ ...formData, family_name: e.target.value })} required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <input type="tel" placeholder="+1234567890" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500" />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength="8" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500" />
          </div>
          
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-brand-500 hover:text-brand-400 text-sm">
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Login;
