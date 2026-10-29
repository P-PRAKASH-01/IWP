import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return undefined;
    }

    let active = true;
    const checkAdmin = async (user) => {
      if (!user) {
        if (active) {
          setAdminUser(null);
          setIsAdminLoggedIn(false);
          setIsLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from('admin_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Unable to verify admin access:', error.message);
      }
      if (active) {
        setAdminUser(user);
        setIsAdminLoggedIn(!error && Boolean(data));
        setIsLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Unable to restore admin session:', error.message);
      void checkAdmin(data?.session?.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(true);
      window.setTimeout(() => {
        void checkAdmin(session?.user);
      }, 0);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Admin sign-in is unavailable until Supabase is configured.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };

    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      const { error: signOutError } = await supabase.auth.signOut();
      return {
        success: false,
        message: signOutError
          ? `This account is not authorized, and its session could not be cleared: ${signOutError.message}`
          : profileError?.message || 'This account is not authorized to administer the store.'
      };
    }

    setAdminUser(data.user);
    setIsAdminLoggedIn(true);
    return { success: true };
  };

  const logout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setAdminUser(null);
    setIsAdminLoggedIn(false);
  };

  const resetPassword = async (email) => {
    if (!supabase) {
      return { success: false, message: 'Password reset requires a configured Supabase project.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login?mode=recovery`
    });
    return error
      ? { success: false, message: error.message }
      : { success: true, message: 'If an account exists, a password reset email has been sent.' };
  };

  const updatePassword = async (password) => {
    if (!supabase) return { success: false, message: 'Password reset requires a configured Supabase project.' };
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, message: error.message };
    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (profileError || !profile) {
      const { error: signOutError } = await supabase.auth.signOut();
      return {
        success: false,
        message: signOutError
          ? `This account is not authorized, and its session could not be cleared: ${signOutError.message}`
          : profileError?.message || 'This account is not authorized to administer the store.'
      };
    }
    setAdminUser(data.user);
    setIsAdminLoggedIn(true);
    return { success: true, message: 'Password updated successfully.' };
  };

  return (
    <AuthContext.Provider value={{ adminUser, isAdminLoggedIn, isLoading, login, logout, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
