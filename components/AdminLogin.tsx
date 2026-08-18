import React, { useState } from 'react';
import { Mail, Lock as LockIcon, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { loginAdmin } from '../src/services/authService';
import { CustomCursor } from './CustomCursor';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginAdmin(email, password);
      if (user) {
        onLoginSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.code === 'auth/user-not-found'
        ? 'User not found. Check your email.'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password.'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email format.'
        : err.message || 'Login failed. Please try again.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomCursor />
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
          <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-2 border border-slate-700 text-center">
            <Loader2 size={36} className="animate-spin text-white mb-2" />
            <p className="font-semibold text-white tracking-wide">Verifying Credentials</p>
            <p className="text-sm text-slate-400">Securing your admin session...</p>
          </div>
        </div>
      )}
      <main className="w-full relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black flex items-center justify-center p-4 overflow-hidden">
        
        {/* Back Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="fixed top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700 rounded-lg transition-all duration-200"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Website</span>
        </button>
        
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full"></div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <img src="/apple-touch-icon.png" alt="Admin Badge" className="mx-auto mb-4 w-16 h-16" />
            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-slate-400">Sign in to manage your portfolio</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portfolio.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="text-red-400" size={18} />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-slate-900 hover:bg-slate-50 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-slate-400 text-sm">
            Only authorized administrators can access this panel.
          </p>
        </div>
      </main>
    </>
  );
};
