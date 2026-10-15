import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { Badge, PageHeader, meta } from "@/components/page";
import { committees } from "@/lib/nav";

export const Route = createFileRoute("/committees")({
  head: () => meta("Committees", "The eight SBS committees with leaders, member counts and evaluation settings."),
  component: () => (
    <div className="mx-auto max-w-7xl">
      <PageHeader crumbs={["Committees"]} title="Committees" description="The eight SBS committees, their leaders and evaluation settings." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {committees.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <span className="rounded-lg bg-primary/10 p-2 text-primary"><Building2 className="h-4 w-4" /></span>
              {c.pendingName && <Badge tone="warning">Name pending</Badge>}
            </div>
            <p className="mt-4 font-semibold" dir="auto">{c.name}</p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Members</dt><dd>—</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Leader</dt><dd>Not assigned</dd></div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  ),
});
