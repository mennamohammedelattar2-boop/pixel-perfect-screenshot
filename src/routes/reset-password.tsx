import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set your password · SBS HR" },
      { name: "description", content: "Choose a password for your SBS HR account." },
      { property: "og:title", content: "Set your password · SBS HR" },
      { property: "og:description", content: "Choose a password for your SBS HR account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setReady(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    setBusy(true); setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3 rounded-2xl border border-border bg-card p-8 shadow-card">
        <h1 className="text-lg font-semibold">Set your password</h1>
        {!ready ? (
          <p className="text-sm text-muted-foreground">Open this page from the link in your invitation or reset email.</p>
        ) : (
          <>
            <input type="password" required autoComplete="new-password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm" />
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <button disabled={busy} className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Save password"}</button>
          </>
        )}
      </form>
    </div>
  );
}
