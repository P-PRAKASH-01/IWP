import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';

export default function AdminResetPassword() {
  const { adminUser, updatePassword, resetPassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ type: '', message: '' });

  const adminEmail = adminUser?.email || '';

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    if (newPassword.length < 8) {
      setUpdateError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setUpdateError('The new passwords do not match. Please verify and try again.');
      return;
    }

    setUpdating(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        setUpdateSuccess(result.message || 'Password has been updated successfully.');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setUpdateError(result.message || 'Unable to update password. Please check your credentials.');
      }
    } catch (err) {
      setUpdateError(err.message || 'An unexpected error occurred while updating password.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!adminEmail) {
      setEmailStatus({ type: 'error', message: 'No administrator email found for this session.' });
      return;
    }

    setEmailStatus({ type: '', message: '' });
    setSendingEmail(true);

    try {
      const result = await resetPassword(adminEmail);
      if (result.success) {
        setEmailStatus({ type: 'success', message: `Password reset link sent to ${adminEmail}. Check your inbox.` });
      } else {
        setEmailStatus({ type: 'error', message: result.message });
      }
    } catch (err) {
      setEmailStatus({ type: 'error', message: err.message || 'Failed to send password reset email.' });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        <header>
          <div className="flex items-center gap-2 text-olive text-xs font-bold uppercase tracking-wider mb-1">
            <KeyRound className="w-4 h-4" /> Account Security
          </div>
          <h1 className="text-2xl font-bold text-charcoal">Reset Administrator Password</h1>
          <p className="mt-1 text-sm text-charcoal-600">
            Update your administrator password directly or trigger a reset link sent to your registered email.
          </p>
        </header>

        {!isSupabaseConfigured && (
          <div role="status" className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            Supabase is not configured. Password update requires configured Supabase credentials in your .env file.
          </div>
        )}

        {/* Administrator Info Pill */}
        <div className="bg-white rounded-2xl border border-sand-300 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sand-100 text-olive flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-charcoal-500 font-medium">Logged in Administrator</div>
              <div className="text-sm font-bold text-charcoal">{adminEmail || 'Active Admin Session'}</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-olive-50 text-olive-800 border border-olive-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Authorized Session
          </span>
        </div>

        {/* Option 1: Direct Password Update */}
        <section className="bg-white rounded-2xl border border-sand-300 p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
              <Lock className="w-4 h-4 text-olive" /> Update Password Directly
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Enter and confirm your new password below. It will immediately update your Supabase administrator account.
            </p>
          </div>

          {updateError && (
            <div role="alert" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{updateError}</span>
            </div>
          )}

          {updateSuccess && (
            <div role="status" className="p-3.5 rounded-xl bg-olive-50 border border-olive-200 text-olive-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-olive" />
              <span>{updateSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="block text-xs font-semibold text-charcoal-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 8 characters"
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

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="block text-xs font-semibold text-charcoal-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
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

            <div className="text-[11px] text-charcoal-500 space-y-1 bg-sand-50/70 p-3 rounded-xl border border-sand-200">
              <div className="font-semibold text-charcoal-600">Password Requirements:</div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-olive' : 'bg-charcoal-300'}`} />
                <span>At least 8 characters long</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${newPassword && newPassword === confirmPassword ? 'bg-olive' : 'bg-charcoal-300'}`} />
                <span>Both passwords must match</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updating || !isSupabaseConfigured || !newPassword}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-olive hover:bg-olive-600 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>{updating ? 'Updating Password…' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Option 2: Email Reset Link */}
        <section className="bg-white rounded-2xl border border-sand-300 p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
              <Mail className="w-4 h-4 text-olive" /> Send Password Reset Email Link
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Prefer resetting via email? Trigger a secure one-time password recovery link to your inbox ({adminEmail || 'your admin email'}).
            </p>
          </div>

          {emailStatus.message && (
            <div
              role="alert"
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                emailStatus.type === 'success'
                  ? 'bg-olive-50 border-olive-200 text-olive-800'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {emailStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-olive" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{emailStatus.message}</span>
            </div>
          )}

          <div>
            <button
              type="button"
              disabled={sendingEmail || !isSupabaseConfigured}
              onClick={handleSendResetEmail}
              className="inline-flex items-center justify-center gap-2 bg-sand-100 hover:bg-sand-200 disabled:opacity-50 text-charcoal font-semibold text-sm px-5 py-2.5 rounded-xl border border-sand-300 transition-colors"
            >
              <Mail className="w-4 h-4 text-olive" />
              <span>{sendingEmail ? 'Sending reset email…' : 'Send Reset Link to Email'}</span>
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
