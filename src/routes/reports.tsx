import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, FilterBar, PageHeader, Panel, meta } from "@/components/page";

export const Route = createFileRoute("/reports")({
  head: () => meta("Reports & Analytics", "Committee comparisons, evaluation trends and engagement metrics."),
  component: () => (
    <div className="mx-auto max-w-7xl">
      <PageHeader crumbs={["Reports & Analytics"]} title="Reports & Analytics" description="Committee summaries, performance trends and engagement indicators. Exports will be enabled once data is available." />
      <FilterBar search={false} filters={["Period", "Committee"]} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Committee comparison"><EmptyState title="No data" hint="Committee-level summaries appear after evaluations are recorded." /></Panel>
        <Panel title="Evaluation trends"><EmptyState title="No data" hint="Member performance trends will chart here." /></Panel>
        <Panel title="Engagement indicators" className="lg:col-span-2"><EmptyState title="No data" hint="Engagement metrics from follow-ups and surveys will appear here." /></Panel>
      </div>
    </div>
  ),
});
