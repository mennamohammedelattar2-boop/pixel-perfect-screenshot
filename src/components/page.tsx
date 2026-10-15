import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({ title, description, crumbs }: { title: string; description: string; crumbs?: string[] }) {
  return (
    <div className="mb-6">
      {crumbs && (
        <p className="mb-1 text-xs text-muted-foreground">{["Home", ...crumbs].join("  /  ")}</p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-border bg-card shadow-card ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h3 className="text-sm font-semibold">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatCard({ label, icon: Icon, value }: { label: string; icon: LucideIcon; value?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">{value ?? "—"}</p>
      {value === undefined && <p className="mt-1 text-xs text-muted-foreground">No data yet</p>}
    </div>
  );
}

export function EmptyState({ title, hint, icon: Icon = Inbox }: { title: string; hint: string; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span className="rounded-full bg-muted p-3 text-muted-foreground"><Icon className="h-5 w-5" /></span>
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warning" | "success" }) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    warning: "bg-warning/15 text-warning-foreground",
    success: "bg-success/15 text-success",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

/** Filter controls are shown disabled until real data is connected. */
export function FilterBar({ filters, search = true }: { filters: string[]; search?: boolean }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2" title="Filters become available once data is connected">
      {search && (
        <input disabled placeholder="Search…" className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:w-64" />
      )}
      {filters.map((f) => (
        <select key={f} disabled className="h-9 rounded-lg border border-input bg-card px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60">
          <option>{f}: All</option>
        </select>
      ))}
    </div>
  );
}

export function DataTable({ columns, emptyTitle, emptyHint }: { columns: string[]; emptyTitle: string; emptyHint: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>{columns.map((c) => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}</tr>
        </thead>
        <tbody>
          <tr><td colSpan={columns.length}><EmptyState title={emptyTitle} hint={emptyHint} /></td></tr>
        </tbody>
      </table>
    </div>
  );
}

export function meta(title: string, description: string) {
  const t = `${title} · SBS HR`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
