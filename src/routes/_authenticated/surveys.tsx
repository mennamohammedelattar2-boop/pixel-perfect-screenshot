import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, PageHeader, Panel, meta } from "@/components/page";

export const Route = createFileRoute("/_authenticated/surveys")({
  head: () => meta("Improvement Surveys", "Quarterly improvement surveys, responses and action plans."),
  component: () => (
    <div className="mx-auto max-w-7xl">
      <PageHeader crumbs={["Improvement Surveys"]} title="Improvement Surveys" description="Quarterly surveys, collected feedback and improvement action plans." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Quarterly surveys"><EmptyState title="No surveys" hint="Quarterly surveys will be listed here." /></Panel>
        <Panel title="Identified problems"><EmptyState title="Nothing identified" hint="Problems raised in responses will be grouped here." /></Panel>
        <Panel title="Action items"><EmptyState title="No action items" hint="Improvement actions will be tracked here." /></Panel>
      </div>
    </div>
  ),
});
