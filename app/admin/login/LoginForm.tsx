"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, { error: "" });

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <div>
        <label htmlFor="username" className="mb-2 block text-[11px] uppercase tracking-[0.15em]">
          Username
        </label>
        <input id="username" name="username" type="text" autoComplete="username" required className="field-input" />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-[11px] uppercase tracking-[0.15em]">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field-input" />
      </div>

      {state.error && <p className="text-xs text-[#8a3b3b]">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}