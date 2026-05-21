// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

serve(async (req) => {
  const { to, subject, html } = await req.json();
  const key = Deno.env.get('RESEND_API_KEY');
  const from = 'TechElite <onboarding@resend.dev>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html })
  });

  const result = await response.json();
  return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' }, status: response.status });
});
