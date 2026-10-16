import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, PageHeader, Panel, meta } from "@/components/page";

export const Route = createFileRoute("/_authenticated/follow-up")({
  head: () => meta("HR Follow-up", "Track assigned members, follow-ups, issues and communication history."),
  component: () => (
    <div className="mx-auto max-w-7xl">
      <PageHeader crumbs={["HR Follow-up"]} title="HR Follow-up" description="Assigned members, follow-up records, engagement issues and action items." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="My assigned members"><EmptyState title="No members assigned" hint="Members assigned to you will appear here." /></Panel>
        <Panel title="Upcoming follow-ups"><EmptyState title="Nothing scheduled" hint="Scheduled follow-ups will be listed here." /></Panel>
        <Panel title="Open issues & action items"><EmptyState title="No open issues" hint="Engagement issues and action items will be tracked here." /></Panel>
        <Panel title="Communication & follow-up history"><EmptyState title="No records" hint="Past conversations and notes will appear here." /></Panel>
      </div>
    </div>
  ),
});
