import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, KeyRound, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const passwordRecovery = searchParams.get('mode') === 'recovery' || (typeof window !== 'undefined' && window.location.hash.includes('type=recovery'));

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      if (passwordRecovery && password !== confirmPassword) {
        setError('The new passwords do not match.');
        return;
      }
      const result = passwordRecovery
        ? await updatePassword(password)
        : await login(email, password);
      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.message);
      }
    } catch (loginError) {
      setError(loginError.message || 'Sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    setNotice('');
    if (!email.trim()) {
      setError('Enter your administrator email first.');
      return;
    }
    setBusy(true);
    try {
      const result = await resetPassword(email.trim());
      if (result.success) setNotice(result.message);
      else setError(result.message);
    } catch (resetError) {
      setError(resetError.message || 'Password reset could not be requested.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-sand-300 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sand-100 text-olive flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal">
            {passwordRecovery ? 'Set a new password' : 'Sri Sai Garments Admin'}
          </h1>
          <p className="text-xs text-charcoal-500">
            {passwordRecovery ? 'Use at least 12 characters for your new password.' : 'Sign in with an authorized administrator account.'}
          </p>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
        {notice && <p role="status" className="p-3 rounded-xl bg-olive-50 border border-olive-200 text-olive-800 text-xs">{notice}</p>}

        {!isSupabaseConfigured && (
          <div role="status" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            Admin sign-in is disabled until the Supabase URL and publishable key are configured. See the README setup instructions.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {!passwordRecovery && <div className="space-y-1">
            <label htmlFor="admin-email" className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-olive" aria-hidden="true" /> Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-sand-50 text-charcoal text-sm p-3 rounded-xl border border-sand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive"
            />
          </div>}
          <div className="space-y-1">
            <label htmlFor="admin-password" className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-olive" aria-hidden="true" /> {passwordRecovery ? 'New password' : 'Password'}
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete={passwordRecovery ? 'new-password' : 'current-password'}
              minLength={passwordRecovery ? 12 : undefined}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-sand-50 text-charcoal text-sm p-3 rounded-xl border border-sand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive"
            />
          </div>
          {passwordRecovery && <div className="space-y-1">
            <label htmlFor="admin-confirm-password" className="text-xs font-semibold text-charcoal-700">Confirm new password</label>
            <input
              id="admin-confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full bg-sand-50 text-charcoal text-sm p-3 rounded-xl border border-sand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive"
            />
          </div>}
          <button
            type="submit"
            disabled={busy || !isSupabaseConfigured}
            className="w-full flex items-center justify-center gap-2 bg-olive enabled:hover:bg-olive-600 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
          >
            <span>{busy ? 'Please wait…' : passwordRecovery ? 'Save new password' : 'Sign in'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          {!passwordRecovery ? <button
              type="button"
              disabled={busy || !isSupabaseConfigured}
              onClick={handlePasswordReset}
              className="w-full text-xs font-semibold text-olive hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive rounded"
            >
              Forgot password?
            </button> : (
            <button
              type="button"
              disabled={busy}
              onClick={() => navigate('/admin/login', { replace: true })}
              className="w-full text-xs font-semibold text-charcoal-500 hover:text-charcoal hover:underline rounded text-center"
            >
              Back to sign in
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
