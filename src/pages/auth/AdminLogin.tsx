import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';

const LOCK_KEY = 'admin_login_attempts';

export function AdminLoginPage() {
  const nav = useNavigate();
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const lock = useMemo(() => {
    const raw = JSON.parse(localStorage.getItem(LOCK_KEY) ?? '{"count":0,"lockedUntil":0}');
    return raw as { count: number; lockedUntil: number };
  }, [now]);

  const lockedSeconds = Math.max(0, Math.floor((lock.lockedUntil - now) / 1000));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lockedSeconds > 0) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const { data, error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signErr || !data.user) {
      const nextCount = lock.count + 1;
      const lockedUntil = nextCount >= 5 ? Date.now() + 15 * 60 * 1000 : 0;
      localStorage.setItem(LOCK_KEY, JSON.stringify({ count: nextCount >= 5 ? 0 : nextCount, lockedUntil }));
      setError(signErr?.message ?? 'Login failed');
      return;
    }
    const { data: admin } = await supabase.from('admins').select('*').eq('id', data.user.id).maybeSingle();
    if (!admin) {
      await supabase.auth.signOut();
      setError('Unauthorized access');
      return;
    }
    localStorage.setItem(LOCK_KEY, JSON.stringify({ count: 0, lockedUntil: 0 }));
    await supabase.from('admins').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);
    await fetchProfile();
    nav('/admin');
  };

  return <main className="min-h-screen grid place-items-center bg-slate-900 text-white"><form onSubmit={onSubmit} className="w-full max-w-md p-6 bg-slate-800 rounded-xl"><h1 className="text-2xl font-semibold">Admin Portal</h1><p className="text-sm text-slate-300 mt-1">Email/password only</p><input name="email" type="email" className="mt-4 w-full rounded p-2 text-black bg-white" placeholder="admin@domain.com" /><input name="password" type="password" className="mt-2 w-full rounded p-2 text-black bg-white" placeholder="Password" /><button disabled={lockedSeconds > 0} className="mt-4 w-full rounded bg-white text-black py-2 disabled:opacity-50">Sign in</button>{lockedSeconds > 0 && <p className="text-xs text-amber-300 mt-2">Locked. Try again in {lockedSeconds}s</p>}{error && <p className="text-xs text-red-300 mt-2">{error}</p>}</form></main>;
}
