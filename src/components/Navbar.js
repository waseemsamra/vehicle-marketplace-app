import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div onClick={() => navigate('/')} className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Velociti</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#featured" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Browse Cars</a>
            <a href="#sell" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sell Car</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-slate-300">{user.username}</span>
                {(user.signInUserSession?.accessToken?.payload['cognito:groups']?.includes('admin') || user.username?.includes('admin')) && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={signOut}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-200 transition-all transform hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
