import SubmissionsPage from "./_components/submissions";

export default async function Submissions() {
  return (
    <div className="px-6 py-4 space-y-4">
      <section id="header">
        <h1 className="text-4xl font-bold">Submissions</h1>
        <p>
          All documents that have ever been submitted, regardless of status.
        </p>
      </section>

      <section id="submission-history-table">
        <SubmissionsPage />
      </section>
    </div>
  );
}
