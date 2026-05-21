import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

type AuthState = {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  error: null,
  init: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user ?? null });
    await get().fetchProfile();
    set({ isLoading: false });
  },
  signInWithEmail: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ error: error.message });
      return false;
    }
    await get().fetchProfile();
    return true;
  },
  signInWithGoogle: async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }); },
  signInWithGitHub: async () => { await supabase.auth.signInWithOAuth({ provider: 'github' }); },
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      set({ error: error?.message ?? 'Sign up failed' });
      return false;
    }
    await supabase.from('profiles').upsert({ id: data.user.id, full_name: email.split('@')[0], role: 'customer' });
    await get().fetchProfile();
    return true;
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAdmin: false });
  },
  fetchProfile: async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) {
      set({ user: null, profile: null, isAdmin: false });
      return;
    }
    const [{ data: profile }, { data: admin }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('admins').select('id').eq('id', user.id).maybeSingle()
    ]);
    set({ user, profile: profile ?? null, isAdmin: Boolean(admin) });
  }
}));
