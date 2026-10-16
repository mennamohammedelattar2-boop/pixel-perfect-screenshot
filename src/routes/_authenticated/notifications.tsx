import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { EmptyState, PageHeader, Panel, meta } from "@/components/page";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => meta("Notifications", "Deadlines, evaluation updates and follow-up reminders."),
  component: () => (
    <div className="mx-auto max-w-3xl">
      <PageHeader crumbs={["Notifications"]} title="Notifications" description="Reminders about deadlines, evaluations and follow-ups." />
      <Panel title="All notifications"><EmptyState icon={Bell} title="You're all caught up" hint="Notifications will appear here once reminders are set up." /></Panel>
    </div>
  ),
});
