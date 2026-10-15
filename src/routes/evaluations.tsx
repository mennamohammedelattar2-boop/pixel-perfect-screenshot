import { createFileRoute } from "@tanstack/react-router";
import { DataTable, FilterBar, PageHeader, meta } from "@/components/page";

export const Route = createFileRoute("/evaluations")({
  head: () => meta("Task Evaluations", "Workspace for task-based member evaluations and feedback."),
  component: () => (
    <div className="mx-auto max-w-7xl">
      <PageHeader crumbs={["Task Evaluations"]} title="Task Evaluations" description="Evaluation records, task status, deadlines, technical criteria and feedback." />
      <FilterBar filters={["Committee", "Member", "Task status", "Evaluation status", "Date"]} />
      <DataTable columns={["Task", "Member", "Committee", "Deadline", "Task status", "Evaluation", "Score"]} emptyTitle="No evaluations yet" emptyHint="Task evaluations will appear here once the evaluation workflow is set up." />
    </div>
  ),
});
