import { createFileRoute } from "@tanstack/react-router";
import { DataTable, FilterBar, PageHeader, meta } from "@/components/page";

export const Route = createFileRoute("/development")({
  head: () => meta("Development Tasks", "Monthly development assignments, deadlines, progress and feedback."),
  component: () => (
    <div className="mx-auto max-w-7xl">
      <PageHeader crumbs={["Development Tasks"]} title="Development Tasks" description="Monthly development assignments, progress and feedback." />
      <FilterBar filters={["Month", "Committee", "Status"]} />
      <DataTable columns={["Assignment", "Member", "Month", "Deadline", "Status", "Feedback"]} emptyTitle="No development tasks yet" emptyHint="Monthly assignments will appear here once they are created." />
    </div>
  ),
});
