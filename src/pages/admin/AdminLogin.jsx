import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const res = login(username, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-sand-300 shadow-xl max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sand-100 text-olive flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-extrabold text-charcoal">
            Sri Sai Garments Admin
          </h1>

          <p className="text-xs text-charcoal-500">
            Sign in to access shop management & enquiry control panel.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-olive" /> Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-sand-50/80 text-charcoal text-xs p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-olive" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-sand-50/80 text-charcoal text-xs p-3 rounded-xl border border-sand-300 focus:outline-none focus:border-olive focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-olive/20 transition-all mt-2"
          >
            <span>Access Admin Control Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 text-[11px] text-charcoal-600 space-y-1">
          <div className="font-semibold text-olive flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Demo Login Credentials:
          </div>
          <div>Username: <code className="text-charcoal bg-sand-200/60 px-1.5 py-0.5 rounded font-mono">admin</code></div>
          <div>Password: <code className="text-charcoal bg-sand-200/60 px-1.5 py-0.5 rounded font-mono">password123</code></div>
        </div>

      </div>
    </div>
  );
}
