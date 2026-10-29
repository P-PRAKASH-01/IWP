import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured, supabase } from '../../services/supabase';

export default function AdminResetPassword() {
  const { adminUser, isAdminLoggedIn, updatePassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(adminUser?.email || '');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [activeTab, setActiveTab] = useState('pin'); // 'pin' or 'email'
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailNotice, setEmailNotice] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Please check your .env configuration.');
      return;
    }

    if (!isAdminLoggedIn && !email.trim()) {
      setError('Please enter your administrator email address.');
      return;
    }

    if (!isAdminLoggedIn && !pin.trim()) {
      setError('Please enter your Master Recovery PIN.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('The passwords do not match. Please verify and try again.');
      return;
    }

    setBusy(true);
    try {
      if (isAdminLoggedIn) {
        // Authenticated user direct update
        const result = await updatePassword(newPassword);
        if (result.success) {
          setSuccess('Your password has been updated successfully in Supabase!');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setError(result.message || 'Failed to update password.');
        }
      } else {
        // Logged-out user reset via Master Recovery PIN
        const { data, error: rpcError } = await supabase.rpc('reset_admin_password_with_pin', {
          p_email: email.trim(),
          p_pin: pin.trim(),
          p_new_password: newPassword
        });

        if (rpcError) {
          if (rpcError.message?.includes('function reset_admin_password_with_pin') || rpcError.code === '42883') {
            setError('The Master Recovery PIN function is not yet created in your Supabase database. Please run the SQL setup script in your Supabase SQL Editor.');
          } else {
            setError(rpcError.message || 'Unable to update password. Please check your credentials.');
          }
          return;
        }

        if (data?.success) {
          setSuccess(data.message || 'Password updated successfully! You can now sign in with your new password.');
          setPin('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setError(data?.message || 'Invalid administrator email or Master Recovery PIN.');
        }
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while resetting your password.');
    } finally {
      setBusy(false);
    }
  };

  const handleSendResetEmail = async () => {
    setError('');
    setEmailNotice('');
    const targetEmail = isAdminLoggedIn ? adminUser?.email : email.trim();

    if (!targetEmail) {
      setError('Please enter your administrator email first.');
      return;
    }

    setSendingEmail(true);
    try {
      const result = await resetPassword(targetEmail);
      if (result.success) {
        setEmailNotice(`A password reset recovery email has been sent to ${targetEmail}. Please check your inbox.`);
      } else {
        setError(result.message || 'Failed to send recovery email.');
      }
    } catch (err) {
      setError(err.message || 'Unable to request password reset email.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-sand-300 shadow-xl max-w-lg w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sand-100 text-olive flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal">
            Reset Admin Password
          </h1>
          <p className="text-xs text-charcoal-500">
            {isAdminLoggedIn
              ? 'Update your administrator password directly for your active session.'
              : 'Enter your credentials to update your password without requiring email verification.'}
          </p>
        </div>

        {/* Status Indicators */}
        {error && (
          <div role="alert" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div role="status" className="p-4 rounded-xl bg-olive-50 border border-olive-200 text-olive-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-olive shrink-0" />
              <span>{success}</span>
            </div>
            {!isAdminLoggedIn && (
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-olive text-white text-xs font-bold hover:bg-olive-600 transition-colors"
                >
                  Proceed to Sign In &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        {emailNotice && (
          <div role="status" className="p-3.5 rounded-xl bg-olive-50 border border-olive-200 text-olive-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-olive" />
            <span>{emailNotice}</span>
          </div>
        )}

        {/* Tab Switching if not logged in */}
        {!isAdminLoggedIn && (
          <div className="flex border-b border-sand-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('pin'); setError(''); }}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeTab === 'pin'
                  ? 'border-olive text-olive font-bold'
                  : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              Master Recovery PIN (Instant)
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('email'); setError(''); }}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeTab === 'email'
                  ? 'border-olive text-olive font-bold'
                  : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              Reset via Email
            </button>
          </div>
        )}

        {/* Form Content */}
        {activeTab === 'pin' || isAdminLoggedIn ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            
            {/* If logged in, show current session banner */}
            {isAdminLoggedIn ? (
              <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-charcoal-500 block text-[11px]">Logged in as:</span>
                  <span className="font-bold text-charcoal">{adminUser?.email || 'Active Administrator'}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-olive-50 text-olive text-[11px] font-semibold border border-olive-200">
                  Active Session
                </span>
              </div>
            ) : (
              <>
                {/* Admin Email Field */}
                <div className="space-y-1">
                  <label htmlFor="admin-email" className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-olive" /> Administrator Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-sand-50 text-charcoal text-sm p-3 rounded-xl border border-sand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive"
                  />
                </div>

                {/* Master Recovery PIN */}
                <div className="space-y-1">
                  <label htmlFor="master-pin" className="text-xs font-semibold text-charcoal-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-olive" /> Master Recovery PIN
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="master-pin"
                      type={showPin ? 'text' : 'password'}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter your Master Recovery PIN"
                      className="w-full bg-sand-50 text-charcoal text-sm p-3 pr-10 rounded-xl border border-sand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* New Password */}
            <div className="space-y-1">
              <label htmlFor="new-password" className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-olive" /> New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-sand-50 text-charcoal text-sm p-3 pr-10 rounded-xl border border-sand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label htmlFor="confirm-password" className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-olive" /> Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your new password"
                  className="w-full bg-sand-50 text-charcoal text-sm p-3 pr-10 rounded-xl border border-sand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Validation Hints */}
            <div className="text-[11px] text-charcoal-500 space-y-1 bg-sand-50/70 p-3 rounded-xl border border-sand-200">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-olive' : 'bg-charcoal-300'}`} />
                <span>At least 8 characters long</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${newPassword && newPassword === confirmPassword ? 'bg-olive' : 'bg-charcoal-300'}`} />
                <span>Passwords match</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={busy || !isSupabaseConfigured || !newPassword || newPassword !== confirmPassword}
              className="w-full flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl shadow-xs transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              <span>{busy ? 'Updating Password…' : 'Confirm & Update Password'}</span>
            </button>
          </form>
        ) : (
          /* Email Reset Tab */
          <div className="space-y-4">
            <p className="text-xs text-charcoal-600">
              Enter your administrator email address below to receive an official password reset link.
            </p>
            <div className="space-y-1">
              <label htmlFor="email-recovery" className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-olive" /> Administrator Email
              </label>
              <input
                id="email-recovery"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-sand-50 text-charcoal text-sm p-3 rounded-xl border border-sand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive"
              />
            </div>
            <button
              type="button"
              disabled={sendingEmail || !isSupabaseConfigured || !email.trim()}
              onClick={handleSendResetEmail}
              className="w-full flex items-center justify-center gap-2 bg-sand-100 hover:bg-sand-200 disabled:opacity-50 text-charcoal font-semibold text-sm py-3.5 rounded-xl border border-sand-300 transition-colors"
            >
              <Mail className="w-4 h-4 text-olive" />
              <span>{sendingEmail ? 'Sending recovery link…' : 'Send Recovery Link to Email'}</span>
            </button>
          </div>
        )}

        {/* Back Navigation */}
        <div className="pt-2 text-center">
          {isAdminLoggedIn ? (
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-olive hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
            </button>
          ) : (
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-olive hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          )}
        </div>

      </div>
    </main>
  );
}
