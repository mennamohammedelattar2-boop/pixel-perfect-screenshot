import { createFileRoute } from "@tanstack/react-router";
import { Users, UserCheck, Building2, CheckCircle2, Clock, AlertTriangle, HeartHandshake } from "lucide-react";
import { EmptyState, PageHeader, Panel, StatCard, meta } from "@/components/page";

export const Route = createFileRoute("/_authenticated/")({
  head: () => meta("Dashboard", "Overview of SBS members, committees and evaluation progress."),
  component: Dashboard,
});

const stats = [
  { label: "Total members", icon: Users },
  { label: "Active members", icon: UserCheck },
  { label: "Total committees", icon: Building2, value: 8 },
  { label: "Evaluations completed", icon: CheckCircle2 },
  { label: "Evaluations pending", icon: Clock },
  { label: "Overdue evaluations", icon: AlertTriangle },
  { label: "Members needing follow-up", icon: HeartHandshake },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Dashboard" description="A snapshot of members, evaluations and follow-ups across all committees." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Recent activity"><EmptyState title="No activity yet" hint="Evaluations, follow-ups and updates will appear here." /></Panel>
        <Panel title="Upcoming deadlines"><EmptyState title="No deadlines" hint="Task and development deadlines will be listed here." /></Panel>
        <Panel title="Pending evaluations"><EmptyState title="Nothing pending" hint="Evaluations awaiting review will show here." /></Panel>
        <Panel title="Performance trends"><EmptyState title="Not enough data" hint="Trends appear after the first evaluation cycle." /></Panel>
      </div>
    </div>
  );
}
