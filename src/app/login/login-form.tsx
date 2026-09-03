"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import type { Portal } from "@/lib/portals";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ portal }: { portal?: Portal }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {portal && <input type="hidden" name="portal" value={portal.key} />}

      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          placeholder={portal?.sampleEmail ?? "you@company.com"}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="mb-0">
            Password
          </Label>
          <span className="text-xs text-muted-foreground">Seed password: Passw0rd!</span>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <div className="animate-fade-in rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          <p>{state.error}</p>
          {state.wrongPortal && (
            <Link
              href={`/login/${state.wrongPortal.key}`}
              className="mt-1 inline-block font-medium text-red-800 underline underline-offset-2"
            >
              Go to the {state.wrongPortal.label} sign in →
            </Link>
          )}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Not the right door?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          Choose a different portal
        </Link>
      </p>
    </form>
  );
}
