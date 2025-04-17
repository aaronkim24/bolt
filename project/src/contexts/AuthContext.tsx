import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  interests: string[];
  activities: string[];
  location?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active sessions and set up auth subscription
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('프로필을 불러오는데 실패했습니다.');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);

      // First attempt to sign up the user
      const { data: { user, session }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('rate_limit')) {
          throw new Error('rate_limit_exceeded');
        }
        throw signUpError;
      }

      if (!user || !session) {
        throw new Error('회원가입 중 오류가 발생했습니다.');
      }

      // Create the initial profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email,
          name,
          interests: [],
          activities: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        throw profileError;
      }

      // Set the user and fetch profile
      setUser(user);
      await fetchProfile(user.id);

    } catch (error: any) {
      console.error('Error registering:', error);
      if (error.message === 'rate_limit_exceeded') {
        throw new Error('rate_limit_exceeded');
      } else {
        throw new Error('회원가입에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      setError('로그아웃 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      setError(null);
      if (!user) throw new Error('사용자가 로그인되어 있지 않습니다.');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('프로필 업데이트에 실패했습니다.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      login, 
      register,
      logout, 
      updateProfile,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}