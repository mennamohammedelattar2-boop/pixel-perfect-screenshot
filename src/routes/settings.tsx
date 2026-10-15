import { createFileRoute } from "@tanstack/react-router";
import { Badge, PageHeader, meta } from "@/components/page";

export const Route = createFileRoute("/settings")({
  head: () => meta("Settings", "User roles, permissions, committees, evaluation criteria and notifications."),
  component: Settings,
});

const sections = [
  { title: "User management", desc: "Invite users and manage their accounts." },
  { title: "Roles & permissions", desc: "Admin, HR, committee leader and member access levels." },
  { title: "Committee configuration", desc: "Names, leaders and settings for the eight committees." },
  { title: "Evaluation criteria", desc: "Technical and behavioral criteria used in task evaluations." },
  { title: "Scoring rules", desc: "Weights, scales and thresholds for scores." },
  { title: "Notification preferences", desc: "Which reminders are sent and when." },
];

function Settings() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader crumbs={["Settings"]} title="Settings" description="Configure access, committees and evaluation rules." />
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{s.title}</p>
              <Badge>Coming next stage</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
