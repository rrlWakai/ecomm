import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authSchema } from "../../lib/zod-schemas";
import { useAuthStore } from "../../stores/auth.store";

export function RegisterPage() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);
  const user = useAuthStore((s) => s.user);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-3xl font-semibold">Already signed in</h1>
        <p className="mt-4 text-sm text-slate-600">
          You are already signed in. Visit your account dashboard to continue.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            className="rounded border border-black px-4 py-2"
            to="/account/orders"
          >
            Go to orders
          </Link>
        </div>
      </main>
    );
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = authSchema.safeParse({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    if (!payload.success) {
      setError(
        payload.error.errors[0]?.message ?? "Invalid registration details",
      );
      return;
    }

    const success = await signUp(payload.data.email, payload.data.password);
    if (!success) {
      setError(useAuthStore.getState().error ?? "Registration failed");
      return;
    }

    navigate("/account/orders");
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-4xl font-semibold">Register</h1>
      <p className="mt-3 max-w-xl text-sm text-slate-600">
        Create a new account to save your cart, checkout faster, and manage
        orders.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded border border-slate-300 px-4 py-3"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            name="password"
            type="password"
            placeholder="Minimum 8 characters"
            className="mt-2 w-full rounded border border-slate-300 px-4 py-3"
            required
            minLength={8}
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded bg-black px-6 py-3 text-sm font-medium text-white hover:bg-slate-900"
        >
          Create Account
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="text-black underline">
          Sign in
        </Link>
        .
      </p>
    </main>
  );
}
