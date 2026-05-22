import { ChangeEvent, FormEvent, useState } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { supabase } from '../../lib/supabase';

export function AccountProfilePage() {
  const { user, profile, fetchProfile } = useAuthStore();
  const [message, setMessage] = useState<string | null>(null);

  if (!user) return <main className="p-6">Please login to manage profile.</main>;

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const full_name = String(form.get('full_name') ?? '');
    const phone = String(form.get('phone') ?? '');
    await supabase.from('profiles').update({ full_name, phone }).eq('id', user.id);
    await fetchProfile();
    setMessage('Profile updated.');
  };

  const onAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) return setMessage(error.message);
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
    await fetchProfile();
    setMessage('Avatar uploaded.');
  };

  const updateEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '');
    const { error } = await supabase.auth.updateUser({ email });
    setMessage(error ? error.message : 'Email change requested. Confirm via inbox.');
  };

  const updatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get('password') ?? '');
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : 'Password updated.');
  };

  return (
    <main className="mx-auto max-w-[980px] px-6 py-16 md:py-24">
      <h1 className="text-5xl font-light tracking-tight md:text-7xl">Profile</h1>
      <div className="mt-10 space-y-8">
      <form className="space-y-3 border-t border-black/10 pt-8" onSubmit={onSave}>
        <input name="full_name" defaultValue={profile?.full_name ?? ''} className="w-full border-b border-black/20 bg-transparent py-3 text-lg outline-none placeholder:text-[#8a8a8a]" placeholder="Full name" />
        <input name="phone" defaultValue={profile?.phone ?? ''} className="w-full border-b border-black/20 bg-transparent py-3 text-lg outline-none placeholder:text-[#8a8a8a]" placeholder="Phone" />
        <button className="mt-4 border border-black bg-black px-5 py-2 text-sm text-white transition-opacity hover:opacity-85">Save Profile</button>
      </form>
      <div className="space-y-2 border-t border-black/10 pt-8"><p className="text-sm uppercase tracking-[0.16em] text-[#666666]">Avatar</p><input type="file" accept="image/*" aria-label="Upload avatar image" onChange={onAvatar} /></div>
      <form className="space-y-3 border-t border-black/10 pt-8" onSubmit={updateEmail}><p className="text-sm uppercase tracking-[0.16em] text-[#666666]">Change Email</p><input name="email" type="email" defaultValue={user.email ?? ''} placeholder="Enter email" className="w-full border-b border-black/20 bg-transparent py-3 text-lg outline-none" /><button className="border border-black/20 px-4 py-2 text-sm">Update Email</button></form>
      <form className="space-y-3 border-t border-black/10 pt-8" onSubmit={updatePassword}><p className="text-sm uppercase tracking-[0.16em] text-[#666666]">Change Password</p><input name="password" type="password" minLength={8} placeholder="New password" className="w-full border-b border-black/20 bg-transparent py-3 text-lg outline-none" /><button className="border border-black/20 px-4 py-2 text-sm">Update Password</button></form>
      {message && <p className="text-sm text-[#666666]">{message}</p>}
      </div>
    </main>
  );
}
