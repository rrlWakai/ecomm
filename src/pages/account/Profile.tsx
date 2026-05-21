import { ChangeEvent, FormEvent, useState } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { supabase } from '../../lib/supabase';

export function AccountProfilePage() {
  const { user, profile, fetchProfile } = useAuthStore();
  const [message, setMessage] = useState<string | null>(null);

  if (!user) return <main className="p-4">Please login to manage profile.</main>;

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
    <main className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <form className="bg-white border rounded p-3 space-y-2" onSubmit={onSave}>
        <input name="full_name" defaultValue={profile?.full_name ?? ''} className="border rounded p-2 w-full" placeholder="Full name" />
        <input name="phone" defaultValue={profile?.phone ?? ''} className="border rounded p-2 w-full" placeholder="Phone" />
        <button className="border rounded px-3 py-1">Save Profile</button>
      </form>
      <div className="bg-white border rounded p-3 space-y-2"><p className="font-medium">Avatar</p><input type="file" accept="image/*" onChange={onAvatar} /></div>
      <form className="bg-white border rounded p-3 space-y-2" onSubmit={updateEmail}><p className="font-medium">Change Email</p><input name="email" type="email" defaultValue={user.email ?? ''} className="border rounded p-2 w-full" /><button className="border rounded px-3 py-1">Update Email</button></form>
      <form className="bg-white border rounded p-3 space-y-2" onSubmit={updatePassword}><p className="font-medium">Change Password</p><input name="password" type="password" minLength={8} className="border rounded p-2 w-full" /><button className="border rounded px-3 py-1">Update Password</button></form>
      {message && <p className="text-sm">{message}</p>}
    </main>
  );
}
