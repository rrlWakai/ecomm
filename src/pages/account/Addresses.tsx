import { FormEvent, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';

export function AccountAddressesPage() {
  const user = useAuthStore((s) => s.user);
  const [message, setMessage] = useState<string | null>(null);

  const addresses = useQuery({
    queryKey: ['addresses', user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => (await supabase.from('addresses').select('*').eq('user_id', user!.id).order('created_at', { ascending: false })).data ?? []
  });

  if (!user) return <main className="p-4">Please login to manage addresses.</main>;

  const saveAddress = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      user_id: user.id,
      full_name: String(form.get('full_name') ?? ''),
      line1: String(form.get('line1') ?? ''),
      line2: String(form.get('line2') ?? ''),
      city: String(form.get('city') ?? ''),
      province: String(form.get('province') ?? ''),
      postal_code: String(form.get('postal_code') ?? ''),
      country: String(form.get('country') ?? 'PH'),
      is_default: Boolean(form.get('is_default'))
    };
    if (payload.is_default) await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').insert(payload);
    await addresses.refetch();
    setMessage('Address saved.');
  };

  const setDefault = async (id: string) => {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    await addresses.refetch();
  };

  const remove = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    await addresses.refetch();
  };

  return (
    <main className="mx-auto max-w-4xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Saved Addresses</h1>
      <form className="bg-white border rounded p-3 grid md:grid-cols-2 gap-2" onSubmit={saveAddress}>
        <input name="full_name" className="border rounded p-2" placeholder="Full name" />
        <input name="line1" className="border rounded p-2" placeholder="Line 1" />
        <input name="line2" className="border rounded p-2" placeholder="Line 2" />
        <input name="city" className="border rounded p-2" placeholder="City" />
        <input name="province" className="border rounded p-2" placeholder="Province" />
        <input name="postal_code" className="border rounded p-2" placeholder="Postal code" />
        <input name="country" defaultValue="PH" className="border rounded p-2" placeholder="Country" />
        <label className="text-sm flex items-center gap-2"><input type="checkbox" name="is_default" /> Set default</label>
        <button className="border rounded px-3 py-2 md:col-span-2">Add Address</button>
      </form>
      <div className="space-y-2">{(addresses.data ?? []).map((a: any) => <div key={a.id} className="bg-white border rounded p-3 flex items-center justify-between"><div><p className="font-medium">{a.full_name}</p><p className="text-sm">{a.line1}, {a.city}, {a.province}, {a.postal_code}, {a.country}</p>{a.is_default && <p className="text-xs text-blue-700">Default</p>}</div><div className="flex gap-2"><button className="border rounded px-2 py-1 text-sm" onClick={() => void setDefault(a.id)}>Set default</button><button className="border rounded px-2 py-1 text-sm text-red-600" onClick={() => void remove(a.id)}>Delete</button></div></div>)}</div>
      {message && <p className="text-sm">{message}</p>}
    </main>
  );
}
