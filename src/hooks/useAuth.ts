import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Session, User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const signInWithOTP = async (phone: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Supabase expects phone numbers in international format
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      const message = err.message || "Error enviando OTP";
      setError(message);
      console.error('OTP sign-in error:', message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Supabase expects phone numbers in international format
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      const message = err.message || "Código OTP inválido";
      setError(message);
      console.error('OTP verification error:', message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      const message = err.message || "Error logging in";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => {
    try {
      setError(null);
      setLoading(true);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: authData.user.id,
              name,
              email,
              phone,
              role: "passenger",
            },
          ]);

        if (profileError) throw profileError;
      }

      return authData;
    } catch (err: any) {
      const message = err.message || "Error registering";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpiar el estado después del logout exitoso
      setSession(null);
      setUser(null);
    } catch (err: any) {
      const message = err.message || "Error logging out";
      setError(message);
      console.error('Logout error:', message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    login,
    register,
    logout,
    signInWithOTP,
    verifyOTP,
    isAuthenticated: !!session,
  };
};
