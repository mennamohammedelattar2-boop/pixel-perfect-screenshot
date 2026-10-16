import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/sbs-logo.jpg.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · SBS HR" },
      { name: "description", content: "Sign in to the SBS HR internal platform. Access is by invitation only." },
      { property: "og:title", content: "Sign in · SBS HR" },
      { property: "og:description", content: "Sign in to the SBS HR internal platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null); setInfo(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(error.message);
      navigate({ to: "/", replace: true });
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setBusy(false);
      if (error) return setError(error.message);
      setInfo("If this email has an account, a reset link is on its way.");
    }
  }

  const input = "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo.url} alt="SBS" className="h-14 w-14 rounded-lg object-contain" />
          <h1 className="mt-3 text-lg font-semibold">SBS HR</h1>
          <p className="text-xs text-mint-foreground" lang="ar" dir="rtl">شباب بتساعد شباب</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium" htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          </div>
          {mode === "signin" && (
            <div>
              <label className="mb-1 block text-xs font-medium" htmlFor="password">Password</label>
              <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
            </div>
          )}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-success">{info}</p>}
          <button disabled={busy} className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Send reset link"}
          </button>
        </form>
        <button onClick={() => { setMode(mode === "signin" ? "forgot" : "signin"); setError(null); setInfo(null); }} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Forgot your password?" : "Back to sign in"}
        </button>
        <p className="mt-6 text-center text-xs text-muted-foreground">Access is by invitation only. Ask Head HR or the system administrator for an invite.</p>
      </div>
    </div>
  );
}
