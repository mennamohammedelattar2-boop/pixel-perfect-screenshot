import { createFileRoute } from "@tanstack/react-router";
import { DataTable, FilterBar, PageHeader, meta } from "@/components/page";

export const Route = createFileRoute("/_authenticated/members")({
  head: () => meta("Members", "Searchable directory of SBS members with committee and HR assignments."),
  component: () => (
    <div className="mx-auto max-w-7xl">
      <PageHeader crumbs={["Members"]} title="Members" description="Directory of all members, their committees, HR contacts and evaluation status." />
      <FilterBar filters={["Committee", "Status", "HR member", "Evaluation"]} />
      <DataTable
        columns={["Member name", "Committee", "Assigned HR", "Status", "Latest evaluation", "Last follow-up"]}
        emptyTitle="No members yet"
        emptyHint="Members will appear here once the member database is connected. Profiles will include evaluation history, follow-up notes and development records."
      />
    </div>
  ),
});
