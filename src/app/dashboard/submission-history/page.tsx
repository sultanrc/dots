import SubmissionHistoryTable from "./_components/submission-history-table";

export default async function SubmissionHistory() {
  return (
    <div className="px-6 py-4 space-y-4">
      <section id="header">
        <h1 className="text-4xl font-bold">Submission History</h1>
        <p>
          All documents that have ever been submitted, regardless of status.
        </p>
      </section>

      <section id="submission-history-table">
        <SubmissionHistoryTable />
      </section>
    </div>
  );
}
